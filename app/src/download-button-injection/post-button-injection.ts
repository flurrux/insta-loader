import { Either, isLeft, left, right } from "fp-ts/es6/Either";
import { Option, isNone, isSome, none, some } from "fp-ts/es6/Option";
import { waitForElementExistence } from "../../lib/await-element";
import { findInAncestors } from "../../lib/find-dom-ancestor";
import { createElementByHTML } from "../../lib/html-util";
import { tryMultiAndDelayed } from "../../lib/multi-try-delayed";
import { observeCarouselIndex } from "../carousel-index-observer";
import { getHrefOfPost } from "../data-extraction/directly-in-browser/general-post-info/post-href";
import { findTypeOfPost } from "../data-extraction/directly-in-browser/general-post-info/post-type";
import { queryMediaElement } from "../data-extraction/directly-in-browser/media-and-src/query-media-element";
import { makeWebInfoMediaExtractor } from "../data-extraction/hybrid/cached-media-fetching";
import { createDiskDownloadButton } from "../download-buttons/disk-download-button";
import { makeLinkButton } from "../download-buttons/link-button";
import { getCurrentPageType } from "../insta-navigation-observer";


function findSavePostElement(postElement: HTMLElement): Option<HTMLElement> {
	const saveButtonPolygon = postElement.querySelector('polygon[points="20 21 12 13.44 4 21 4 3 20 3 20 21"]');
	if (!saveButtonPolygon){
		// console.warn("trying to inject a download button, but could not find the save-button for the reference point.");
		return none;
	}

	const buttonElement1Opt = findInAncestors(
		(element) => element.matches('*[role="button"]'),
		saveButtonPolygon
	);

	if (isNone(buttonElement1Opt)){
		// console.warn("trying to inject a download button, and found the svg of the save button that we use a reference point, but could not find the expected button element in its ancestors");
		return none;
	}

	const buttonElement1 = buttonElement1Opt.value;
	const buttonElement2 = buttonElement1.parentElement;

	// this will not happen in all likelyhoold, but for the typechecker:
	if (buttonElement2 == null){
		return none;
	}

	if (!buttonElement2.matches('*[role="button"]')){
		// console.log("trying to inject a download button, and found the save button, but its parent is not another button layer as expected.");
		return none;
	}

	return some(buttonElement2);
};

const getPostDownloadElementStyle = (postElement: HTMLElement): Partial<CSSStyleDeclaration> | null => {
	const saveToCollectionElOpt = findSavePostElement(postElement);
	if (isNone(saveToCollectionElOpt)) return null;
	
	const saveToCollectionEl = saveToCollectionElOpt.value;
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
	const downloadButton = createDiskDownloadButton({
		fetchMediaInfo: makeWebInfoMediaExtractor(postElement)
	});
	
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




// main-feed post -----------------------------

function makeAndPrepareLinkButton(postElement: HTMLElement){
	const linkButton = makeLinkButton(getHrefOfPost(postElement));
	applyPostDownloadElementStyle(postElement, linkButton.firstElementChild);
	return linkButton;
}

function determineTypeOfLazyPost(postElement: HTMLElement){
	return new Promise(
		(resolve) => {
			const postTypeOpt = findTypeOfPost(postElement);
			if (isSome(postTypeOpt)){
				resolve(postTypeOpt.value);
				return;
			}
			
			const findPostTypeDelayed = tryMultiAndDelayed(
				() => {
					const postTypeOpt = findTypeOfPost(postElement);
					if (isNone(postTypeOpt)) return;
					resolve(postTypeOpt.value);
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
	if (!carouselElement) return;

	observeCarouselIndex(
		carouselElement,
		({ child, index }) => {
			const mediaElement = queryMediaElement(child);
			if (!mediaElement) return;
			setDownloadButtonVisible(
				mediaElement.matches("img")
			);
		}
	);
}


function injectDownloadButtonsIntoMainFeedPost(postElement: HTMLElement) {
	const saveButtonOpt = findSavePostElement(postElement);
	if (isNone(saveButtonOpt)){
		console.warn(`trying to inject download buttons into post, but cannot find the save-button for reference`);
		return;
	}

	const saveButton = saveButtonOpt.value;
	const container = saveButton.parentElement?.parentElement;
	Object.assign(
		container?.style,
		{ display: "flex", alignItems: "center" }
	);

	const linkButton = makeAndPrepareLinkButton(postElement);
	container.appendChild(linkButton);

	const downloadButton = makeAndPrepareDownloadButton(postElement);
	container.appendChild(downloadButton);

	autoShowLinkForMainFeedVideos(linkButton, downloadButton, postElement);
}



// single post page -------------

type SinglePostPageInjectionPoint = {
	likeCommentShareBar: HTMLElement,
	saveButtonWrapper: HTMLElement
}

async function findSinglePagePostInjectionPoint(postElement: HTMLElement): Promise<Either<any, SinglePostPageInjectionPoint>> {
	
	// immediately querying the element doesn't work. i suppose the page is not ready at that point. 
	// thus i'm forced to lookup the element periodically until it is found. i've chosen an interval of 200 milliseconds and a maximum number of 10 attempts. 

	// there are two elements of tag 'polygon' on the page: the share and save buttons.
	// we'll wait for any of such elements to show up:

	const polygonElement = await waitForElementExistence(200, 10, postElement, "polygon");
	if (!polygonElement) {
		return left([
			`trying to inject download buttons into post, but cannot find any child with tag 'polygon' that was expected to be in the following element: `,
			postElement
		])
	}

	const polygonElements = Array.from(postElement.querySelectorAll("polygon"));
	if (polygonElements.length !== 2){
		console.warn(`expected to find exactly two svg-polygon elements on this page, but got a different number, namely ${polygonElements.length}`);
	}

	if (polygonElements.length < 1){
		return left("expected to find atleast one svg-polygon on this page that belonged to the share-button, but did not find any.");
	}

	// we'll assume that the first polygon element is a descendant of the share button

	const firstPolygon = polygonElements[0];
	const shareButtonOpt = findInAncestors(
		(el) => el.matches("button"), firstPolygon
	);

	if (isNone(shareButtonOpt)){
		return left([
			`found an svg-polygon element that was assumed to belong to the share-button. then we tried to find the share-button itself, but got no matches. here is the polygon element:`,
			firstPolygon
		])
	}

	const shareButton = shareButtonOpt.value;
	const likeCommentShareParent = shareButton.parentElement;
	if (!likeCommentShareParent){
		return left([
			"found the share-button, but the DOM structure is not as expected and therefore can't find find the point where to inject the download button. here is the share-button:",
			shareButton
		]);
	}

	const likeCommentShareBar = likeCommentShareParent.parentElement as HTMLElement;

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

	return right({ likeCommentShareBar, saveButtonWrapper });
}

async function injectDownloadButtonsIntoSinglePagePost(postElement: HTMLElement) {
	const saveButtonWrapperEith = await findSinglePagePostInjectionPoint(postElement);
	if (isLeft(saveButtonWrapperEith)){
		console.warn(saveButtonWrapperEith.left);
		return;
	}
	const { saveButtonWrapper, likeCommentShareBar } = saveButtonWrapperEith.right;

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

// ----------------------------



export function injectDownloadButtonsIntoPost(postElement: HTMLElement){
	if ( getCurrentPageType() === "mainFeed" ){
		injectDownloadButtonsIntoMainFeedPost(postElement);
	}
	else {
		injectDownloadButtonsIntoSinglePagePost(postElement);
	}
}