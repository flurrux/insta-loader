import { pipe } from "fp-ts/es6/function";
import { waitForElementExistence } from "../../lib/await-element";
import { createElementByHTML, querySelectorAncestor } from "../../lib/html-util";
import { tryMultiAndDelayed } from "../../lib/multi-try-delayed";
import { observeCarouselIndex } from "../carousel-index-observer";
import { getCurrentCarouselElement } from "../data-extraction/directly-in-browser/carousel/carousel-item";
import { queryMediaElement } from "../data-extraction/directly-in-browser/media-and-src/query-media-element";
import { getHrefOfPost } from "../data-extraction/directly-in-browser/post-href";
import { findTypeOfPost } from "../data-extraction/directly-in-browser/post-type";
import { makeLazyMediaExtractor } from "../data-extraction/hybrid/cached-media-fetching";
import { createDiskDownloadButton, MediaWriteInfo } from "../download-buttons/disk-download-button";
import { makeLinkButton } from "../download-buttons/link-button";
import { getCurrentPageType } from "../insta-navigation-observer";
import { Predicate } from "fp-ts/es6/Predicate";
import { Option, elem, isNone, none, some } from "fp-ts/es6/Option";


function findSavePostElement(postElement: HTMLElement) {
	const section = postElement.querySelector("section");
	if (!section) {
		console.warn("trying to find bar with like-button, save-button, etc. in order to inject the download-button, but cannot find it!");
		return null;
	}
	const svgs = Array.from(section.querySelectorAll("svg"));
	if (svgs.length === 0) return null;
	return svgs[svgs.length - 1];
};

const getPostDownloadElementStyle = (postElement: HTMLElement): Partial<CSSStyleDeclaration> | null => {
	const saveToCollectionEl = findSavePostElement(postElement);
	if (!saveToCollectionEl) return null;
	const saveToCollectionButton = saveToCollectionEl.parentElement;
	if (!saveToCollectionButton) return null;
	const size = saveToCollectionEl.clientHeight + "px";
	const padding = getComputedStyle(saveToCollectionButton).getPropertyValue("padding");
	return {
		width: size,
		height: size,
		padding,
	};
};

const applyPostDownloadElementStyle = (postElement: HTMLElement, element: HTMLElement) => {
	Object.assign(element.style, getPostDownloadElementStyle(postElement));
};


function makeAndPrepareDownloadButton(postElement: HTMLElement){
	const downloadButton = createDiskDownloadButton(
		makeLazyMediaExtractor(postElement)
	);
	applyPostDownloadElementStyle(postElement, downloadButton);

	const bar = createElementByHTML(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		></div>
	`);
	bar.appendChild(downloadButton);
	return bar;
}

function makeAndPrepareLinkButton(postElement: HTMLElement){
	const linkButton = makeLinkButton(getHrefOfPost(postElement));
	applyPostDownloadElementStyle(postElement, linkButton.firstElementChild);
	return linkButton;
}

function determineTypeOfLazyPost(postElement: HTMLElement){
	return new Promise(
		(resolve) => {
			const postType = findTypeOfPost(postElement);
			if (postType){
				resolve(postType);
				return;
			}
			
			const findPostTypeDelayed = tryMultiAndDelayed(
				() => {
					const postType = findTypeOfPost(postElement);
					if (!postType) return;
					resolve(postType);
					observer.disconnect();
				},
				600
			)
			const observer = new MutationObserver(findPostTypeDelayed);
			observer.observe(postElement, { childList: true, subtree: true });
		}
	);
}

async function autoShowLinkForMainFeedVideos(
	linkButton: HTMLElement, downloadButton: HTMLElement, 
	postElement: HTMLElement){
		
	const downloadButtonDisplayBefore = downloadButton.style.display;
	const setDownloadButtonVisible = (visible: boolean) => {
		downloadButton.style.display = visible ? downloadButtonDisplayBefore : "none";
		linkButton.style.display = visible ? "none" : "initial";
	};

	if (getCurrentPageType() !== "mainFeed"){
		linkButton.style.display = "none";
		return;
	}

	const postType = await determineTypeOfLazyPost(postElement);
	
	if (postType === "image") return;
	if (postType === "video"){
		setDownloadButtonVisible(false);
		return;
	}
	
	const carouselElement = postElement.querySelector("ul");
	if (!carouselElement) return null;
	observeCarouselIndex(
		carouselElement,
		({ child }) => {
			const mediaElement = queryMediaElement(child);
			if (!mediaElement) return;
			setDownloadButtonVisible(
				mediaElement.matches("img")
			);
		}
	);
}

function injectDownloadButtonsIntoMainFeedPost(postElement: HTMLElement) {
	const sectionEl = postElement.querySelector("section");
	if (!sectionEl) {
		console.warn(`trying to inject download buttons into post, but cannot find any child with tag 'Section'`);
		return;
	}

	const linkButton = makeAndPrepareLinkButton(postElement);
	sectionEl.appendChild(linkButton);

	const downloadButton = makeAndPrepareDownloadButton(postElement);
	sectionEl.appendChild(downloadButton);

	autoShowLinkForMainFeedVideos(linkButton, downloadButton, postElement);
}

async function injectDownloadButtonsIntoSinglePagePost(postElement: HTMLElement) {
	
	// immediately querying the element doesn't work. i suppose the page is not ready at that point. 
	// thus i'm forced to lookup the element periodically until it is found. i've chosen an interval of 200 milliseconds and a maximum number of 10 attempts. 

	// there are two elements of tag 'polygon' on the page: the share and save buttons.
	// we'll wait for any of such elements to show up:

	const polygonElement = await waitForElementExistence(200, 10, postElement, "polygon");
	if (!polygonElement) {
		console.warn(`trying to inject download buttons into post, but cannot find any child with tag 'polygon' that was expected to be in the following element: `, postElement);
		return;
	}

	const saveButtonPolygon = pipe(
		Array.from(postElement.querySelectorAll("polygon")),
		(array) => array[array.length - 1]
	);

	const saveButton = querySelectorAncestor("div[role=button]", saveButtonPolygon);
	if (!saveButton){
		console.warn(`attempted to find the ancestor-button of a polygon element, but without success. here is the element in question: `, saveButtonPolygon);
		return;
	}

	// find the like & comment & share - bar in ancestors
	const likeCommentShareBarOpt = findInAncestors(
		(el) => el.childElementCount > 2,
		saveButton
	);

	if (isNone(likeCommentShareBarOpt)){
		console.warn(`found the save-button, but could not identify the like&comment&share bar in its ancestors, here is the button: `, saveButton);
		return;
	}
	const likeCommentShareBar = likeCommentShareBarOpt.value;
	
	// likeCommentShareBar appears to be a grid with 3 elements.
	// if we pushed another child, it will not fit inside that row.
	// instead, we'll push the new element into the wrapper that holds the save button.
	const saveButtonWrapper = likeCommentShareBar.lastChild as HTMLElement;

	// adjust the wrappers style a bit to make it look less crooked.
	// fingers crossed we won't break nothing.
	Object.assign(
		saveButtonWrapper.style,
		{ display: "flex", alignItems: "baseline" }
	);

	const downloadButton = makeAndPrepareDownloadButton(postElement);
	saveButtonWrapper.appendChild(downloadButton);

	const buttonSize = likeCommentShareBar.querySelector("svg")?.width.baseVal.value;
	if (buttonSize !== undefined){
		Object.assign(
			( downloadButton.querySelector("img") as HTMLImageElement ).style,
			{
				width: `${buttonSize}px`,
				height: `${buttonSize}px`
			}
		);
	}
}

export function injectDownloadButtonsIntoPost(postElement: HTMLElement){
	if ( getCurrentPageType() === "mainFeed" ){
		injectDownloadButtonsIntoMainFeedPost(postElement);
	}
	else {
		injectDownloadButtonsIntoSinglePagePost(postElement);
	}
}


function findInAncestors(predicate: Predicate<HTMLElement>, element: HTMLElement): Option<HTMLElement> {
	let curElement = element;
	for (let i = 0; i < 1000; i++){
		if (predicate(curElement)){
			return some(curElement);
		}
		const nextElement = curElement.parentElement;
		if (!nextElement) return none;
		curElement = nextElement;
	}
	return none;
}