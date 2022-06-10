import { isLeft } from "fp-ts/lib/Either";
import { createElementByHTML } from "../../lib/html-util";
import { getMediaSrcByHtml } from "../data-extraction/directly-in-browser/media-extraction";
import { getHrefOfPost } from "../data-extraction/directly-in-browser/post-href";
import { createMediaFetcherBySrcElementAndFetchFunc } from "../data-extraction/from-fetch-response/cached-media-fetching";
import { getMediaInfoFromResponseObject } from "../data-extraction/from-fetch-response/fetch-media-data";
import { fetchMediaInfo } from "../data-extraction/instagram-api/media-info";
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

const getMediaSrcOfPostElement = (postElement: HTMLElement): Promise<MediaWriteInfo> => {
	// const previewSrc = getPreviewSrcOfPost(postElement);
	// if (!previewSrc) {
	// 	return Promise.reject("preview-src not found");
	// }

	const data = getMediaSrcByHtml(postElement);
	if (!data) {
		return Promise.reject("media-src not found");
	}
	return Promise.resolve(data);
};

async function fetchRecentMediaAndExtract(){
	const mediaInfoJsonEither = await fetchMediaInfo();
	if (isLeft(mediaInfoJsonEither)){
		throw mediaInfoJsonEither.left;
	}
	const extractedInfo = getMediaInfoFromResponseObject(
		mediaInfoJsonEither.right
	);
	return extractedInfo;
}

function makeMediaSrcFetcher(postElement: HTMLElement){
	const pageType = getCurrentPageType();
	console.log("pagetype", pageType);
	if (pageType === "post"){
		return createMediaFetcherBySrcElementAndFetchFunc
			(fetchRecentMediaAndExtract)
			(postElement)
	}
	return () => getMediaSrcOfPostElement(postElement);
}

export function injectDownloadButtonsIntoPost(postElement: HTMLElement){
	const sectionEl = postElement.querySelector("section");
	if (!sectionEl){
		console.warn(`trying to inject download buttons into post, but cannot find any child with tag 'Section'`);
		return;
	}

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
	
	const getMediaSrc = makeMediaSrcFetcher(postElement);
	// const getMediaSrc = () => getMediaSrcOfPostElement(postElement);
	// const getMediaSrc = createMediaFetcherBySrcElement(postElement);
	const downloadButton = createDiskDownloadButton(getMediaSrc);

	applyPostDownloadElementStyle(postElement, downloadButton);
	bar.appendChild(downloadButton);

	sectionEl.insertAdjacentElement("beforeend", bar);

	if (getCurrentPageType() === "mainFeed") {
		const linkButton = makeLinkButton(getHrefOfPost(postElement));
		applyPostDownloadElementStyle(postElement, linkButton.firstElementChild);
		sectionEl.appendChild(linkButton);
	}
};