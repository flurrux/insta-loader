import { MediaWriteInfo, createDiskDownloadButton } from "../download-buttons/disk-download-button";
import { getPreviewSrcOfPost, getMediaInfoByHtml } from "../insta-info-util";
import { createElementByHTML } from "../../lib/html-util";

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
	return Promise.resolve({
		username: data.username,
		src: data.media.src
	} as MediaWriteInfo);
};
export const injectDownloadButtonsIntoPost = (postElement: HTMLElement) => {
	let saveElement = findSavePostElement(postElement);
	if (saveElement === null) {
		console.warn("save-sprite not found");
		return;
	}
	let savePostEl = saveElement.parentElement.parentElement;
	savePostEl.style.marginRight = "0px";

	const bar = createElementByHTML(`
		<div style="display: flex; flex-direction: row;"></div>
	`);
	const getMediaSrc = () => getMediaSrcOfPostElement(postElement);
	const downloadButton = createDiskDownloadButton(getMediaSrc);
	applyPostDownloadElementStyle(postElement, downloadButton);
	bar.appendChild(downloadButton);

	savePostEl.parentElement.insertAdjacentElement("beforeend", bar);
};