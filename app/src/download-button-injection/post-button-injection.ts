import { isLeft, isRight, left, right } from "fp-ts/lib/Either";
import { createElementByHTML } from "../../lib/html-util";
import { findMediaIdOnPostPage } from "../data-extraction/directly-in-browser/media-id";
import { getHrefOfPost } from "../data-extraction/directly-in-browser/post-href";
import { createMediaFetcherBySrcElementAndFetchFunc } from "../data-extraction/from-fetch-response/cached-media-fetching";
import { getMediaInfoFromResponseObject } from "../data-extraction/from-fetch-response/fetch-media-data";
import { fetchMediaID } from "../data-extraction/from-fetch-response/media-id";
import { fetchMediaInfoWithCurrentHeaders } from "../data-extraction/instagram-api/media-info";
import { createDiskDownloadButton } from "../download-buttons/disk-download-button";


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


async function queryOrFetchMediaId(postElement: HTMLElement){
	// first try to find the media-ID in the DOM
	const queriedMediaID = findMediaIdOnPostPage();
	if (isRight(queriedMediaID)) return queriedMediaID;

	// media-ID was not found in the DOM. 
	// this could have several reasons, maybe the post is an overlay or we're on the mainfeed.  
	// now try to get a response of the post page and extract it from there.  
	const postHref = getHrefOfPost(postElement);
	if (!postHref){
		return left("could not find url of post");
	}
	return await fetchMediaID(postHref);
}

async function fetchMediaAndExtract(postElement: HTMLElement){
	const mediaIdEither = await queryOrFetchMediaId(postElement);
	if (isLeft(mediaIdEither)){
		return mediaIdEither;
	}
	const mediaInfoJsonEither = await fetchMediaInfoWithCurrentHeaders(mediaIdEither.right);
	if (isLeft(mediaInfoJsonEither)){
		throw mediaInfoJsonEither;
	}
	const extractedInfo = getMediaInfoFromResponseObject(
		mediaInfoJsonEither.right
	);
	return right(extractedInfo);
}

function makeMediaSrcFetcher(postElement: HTMLElement){
	return createMediaFetcherBySrcElementAndFetchFunc
		(() => fetchMediaAndExtract(postElement))
		(postElement)
}




export function injectDownloadButtonsIntoPost(postElement: HTMLElement){
	const sectionEl = postElement.querySelector("section");
	if (!sectionEl){
		console.warn(`trying to inject download buttons into post, but cannot find any child with tag 'Section'`);
		return;
	}

	// if (getCurrentPageType() === "mainFeed") {
	// 	const linkButton = makeLinkButton(getHrefOfPost(postElement));
	// 	applyPostDownloadElementStyle(postElement, linkButton.firstElementChild);
	// 	sectionEl.appendChild(linkButton);
	// }

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
	
	const downloadButton = createDiskDownloadButton(
		makeMediaSrcFetcher(postElement)
	);

	applyPostDownloadElementStyle(postElement, downloadButton);
	bar.appendChild(downloadButton);

	sectionEl.insertAdjacentElement("beforeend", bar);
};