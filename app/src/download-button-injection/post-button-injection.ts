import { createElementByHTML } from "../../lib/html-util";
import { createDiskDownloadButton, MediaWriteInfo } from "../download-buttons/disk-download-button";
import { getMediaSrcByHtml } from "../data-extraction/directly-in-browser/media-extraction";
import { getPreviewSrcOfPost } from "../data-extraction/directly-in-browser/post-preview";


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

	const getMediaSrc = () => getMediaSrcOfPostElement(postElement);
	// const getMediaSrc = createMediaFetcherBySrcElement(postElement);
	
	const downloadButton = createDiskDownloadButton(getMediaSrc);
	applyPostDownloadElementStyle(postElement, downloadButton);
	bar.appendChild(downloadButton);

	sectionEl.insertAdjacentElement("beforeend", bar);
};