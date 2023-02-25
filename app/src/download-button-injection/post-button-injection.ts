import { waitForElementExistence } from "../../lib/await-element";
import { createElementByHTML } from "../../lib/html-util";
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
	// single-page posts have a child node of tag `section` that contains the number of likes and the profile picture of some user that has liked the post.
	// its previous sibling is the like & comment & save - bar.
	
	// immediately querying the element doesn't work. i suppose the page is not ready at that point. 
	// thus i'm forced to lookup the element periodically until it is found. i've chosen an interval of 500 milliseconds and a maximum number of 10 attempts. 

	const sectionElement = await waitForElementExistence(200, 10, postElement, "section");
	if (!sectionElement) {
		console.warn(`trying to inject download buttons into post, but cannot find any child with tag 'Section' that was expected to be in the following element: `, postElement);
		return;
	}

	const likeCommentShareBar = sectionElement.previousElementSibling;
	if (!likeCommentShareBar){
		console.warn("trying to inject download button into post, but cannot find the bar with the like, comment, share buttons. it was supposed to be the previous sibling of the following element: ", sectionElement);
		return;
	}

	const downloadButton = makeAndPrepareDownloadButton(postElement);
	likeCommentShareBar.appendChild(downloadButton);

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