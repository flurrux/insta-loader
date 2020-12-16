import { MediaWriteInfo, createDiskDownloadButton } from "../download-buttons/disk-download-button";
import { getPreviewSrcOfPost, getMediaInfoByHtml, createMediaFetcherBySrcElement } from "../insta-info-util";
import { createElementByHTML } from "../../lib/html-util";

const findInteractionSection = (postElement: HTMLElement): HTMLElement => {
	return postElement.querySelector("section");
};
const findSavePostElement = (postElement: HTMLElement): Element => {
	const section = postElement.querySelector("section");
	if (!section) {
		console.warn("section with buttons not found");
		return;
	}
	const svgs = Array.from(section.querySelectorAll("svg"));
	return svgs[svgs.length - 1];
};
const getPostDownloadElementStyle = (postElement: HTMLElement): Partial<CSSStyleDeclaration> => {
	const saveToCollectionEl = findSavePostElement(postElement);
	const saveToCollectionButton = saveToCollectionEl.parentElement;
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
	let previewSrc = getPreviewSrcOfPost(postElement);
	if (!previewSrc) {
		return Promise.reject("preview-src not found");
	}
	const data = getMediaInfoByHtml(postElement);
	return Promise.resolve(data);
};
export const injectDownloadButtonsIntoPost = (postElement: HTMLElement) => {
	const sectionEl = findInteractionSection(postElement);

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
	// const getMediaSrc = () => getMediaSrcOfPostElement(postElement);
	const getMediaSrc = createMediaFetcherBySrcElement(postElement);
	const downloadButton = createDiskDownloadButton(getMediaSrc);
	applyPostDownloadElementStyle(postElement, downloadButton);
	bar.appendChild(downloadButton);

	sectionEl.insertAdjacentElement("beforeend", bar);
};