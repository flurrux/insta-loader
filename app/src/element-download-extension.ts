
import { downloadResource } from '../lib/download-util';
import instaChangeDetector from '../lib/insta-change-detection';
import * as instaInfoUtil from '../lib/insta-info-util';
import { getFolderPath } from './disk-writing/lookup-write-path';
import { download as storeOnDisk } from './disk-writing/disk-download';
import { createFileNameByUrl } from '../lib/url-to-filename';
import { DownloadFeedbackButton } from './download-feedback-button';

const chrome = (window as any).chrome;

const getResourceUrl = (url: string): string => chrome.extension.getURL(url);

const createElementByHTML = (html: string): HTMLElement => {
	const wrapper = document.createElement("div") as HTMLDivElement;
	wrapper.innerHTML = html;
	return wrapper.firstElementChild as HTMLElement;
};


//prompt download ###

const getDownloadIconSrc = (iconAppendix: string): string => {
	return getResourceUrl(`icons/download-icon-${iconAppendix}.png`);
};
const getPromptDownloadIcon = (type: instaInfoUtil.InstaElementType): string => {
	let elementTypes = instaInfoUtil.getElementTypesOnCurrentPage();
	let elementType = elementTypes[0];
	let iconAppendixMap = {
		preview: "white",
		post: "dark",
		story: "white"
	};
	let iconAppendix = iconAppendixMap[elementType];
	let src = getDownloadIconSrc(iconAppendix);
	return src;
};
const downloadFileDirectly = async (getMediaSrc: () => Promise<string>) => {
	try {
		const src = await getMediaSrc();
		const fileName = createFileNameByUrl(src);
		downloadResource(src, fileName);
	}
	catch(e){
		console.error(e);
	}
};
const createPromptDownloadButton = (getMediaSrc: () => Promise<string>): HTMLElement => {
	const button = createElementByHTML(`
		<a style="width: fit-content; height: fit-content; cursor: pointer;">
			<img src=${getPromptDownloadIcon(instaInfoUtil.getElementTypesOnCurrentPage()[0])}></img>
		</a>
	`);	
	button.addEventListener("click", () => downloadFileDirectly(getMediaSrc));

	return button;
};


//disk download ###

interface MediaWriteInfo {
	src: string,
	username: string
};
type LoadingCallback = (progress: number) => void;
const downloadFileIndirectly = async (
	getMediaInfo: () => Promise<MediaWriteInfo>, 
	loadingCallback: LoadingCallback) => {
	
	let mediaInfo: MediaWriteInfo = null;	
	try {
		const ownUserName = instaInfoUtil.getOwnUsername();
		mediaInfo = await getMediaInfo();
		const mediaSrc = mediaInfo.src;
		const fileName = createFileNameByUrl(mediaSrc);
		
		const folderPath = await getFolderPath({ 
			mediaSrc, 
			userName: mediaInfo.username, 
			ownUserName 
		});

		await storeOnDisk(
			{
				link: mediaSrc,
				folderPath,
				fileName
			},
			loadingCallback
		);
	}
	catch(error){
		console.error(error);
		const message = mediaInfo ? `${error}, \n user: ${mediaInfo.username}, \n src: ${mediaInfo.src}` : error;
		chrome.runtime.sendMessage({
			type: "show-notification",
			notification: {
				title: "download failed",
				message,
				iconUrl: getResourceUrl("icons/insta-loader-icon-48.png")
			}
		});

		//throw the error again for caller
		throw error;
	}
};
const createDiskDownloadButton = (getMediaInfo: () => Promise<MediaWriteInfo>): HTMLElement => {
	const buttonWrapper = new DownloadFeedbackButton();
	const buttonEl = buttonWrapper.getElement();
	buttonEl.addEventListener("mousedown", e => {
		buttonWrapper.downloadState = "loading";
		downloadFileIndirectly(
				getMediaInfo, 
				(progress: number) => buttonWrapper.loadingProgress = progress
			)
			.then(() => buttonWrapper.downloadState = "success")
			.catch(() => buttonWrapper.downloadState = "fail")
	});
	return buttonEl;
};


//post ###

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
	let previewSrc = instaInfoUtil.getPreviewSrcOfPost(postElement);
	if (!previewSrc) {
		return Promise.reject("preview-src not found");
	}
	const data = instaInfoUtil.getMediaInfoByHtml(postElement);
	return Promise.resolve({
		username: data.username,
		src: data.media.src
	} as MediaWriteInfo);
};
const injectDownloadButtonsIntoPost = (postElement: HTMLElement) => {
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
instaChangeDetector.addEventListener("onPostAdded", e => injectDownloadButtonsIntoPost((e as any).detail.element));


//preview ###

const getMediaSrcOfPreviewElement = (previewEl: HTMLElement): Promise<MediaWriteInfo> => {
	const linkElement = previewEl.querySelector("a");
	if (linkElement === null){
		return Promise.reject("link-element not found");
	}
	let postHref = linkElement.href;

	return instaInfoUtil
		.fetchMediaInfo(postHref)
		.then(data => {
			let src = data.mediaArray[0].src;
			let username = data.username;
			return { username, src };
		}); 
};
const injectDownloadButtonsIntoPreview = (previewEl: HTMLElement) => {
	const previewOverlay = createElementByHTML(`
		<div style="
				width: 100%;
				position: absolute;
				left: 0px;
				bottom: 0px;
				flex-direction: row;"
		>
		</div>
	`);
	const getMediaSrc = () => getMediaSrcOfPreviewElement(previewEl);
	const diskDownloadButton = createDiskDownloadButton(getMediaSrc);
	Object.assign(diskDownloadButton.style, {
		width: "24px",
		height: "24px",
		padding: "5px"
	});
	previewOverlay.appendChild(diskDownloadButton);

	previewEl.appendChild(previewOverlay);
};
instaChangeDetector.addEventListener("onPreviewAdded", e => injectDownloadButtonsIntoPreview((e as any).detail.element));


//story ###
const findCloseStoryElement = (storyEl: HTMLElement): HTMLElement => {
	return storyEl.querySelector(".coreSpriteCloseLight").children[0] as HTMLElement;
};
const getMediaSrcOfStoryElement = (storyEl: HTMLElement): Promise<MediaWriteInfo> => {
	try {
		const src = instaInfoUtil.getSrcOfStory(storyEl);
		const username = instaInfoUtil.getUsernameByStoryUrl(window.location.href);
		return Promise.resolve({ src, username });
	}
	catch (e){
		return Promise.reject(e);
	}
};
const getStoryDownloadElementStyle = (storyEl: HTMLElement): Partial<CSSStyleDeclaration> => {
	const closeSprite = findCloseStoryElement(storyEl);
	const size = closeSprite.clientHeight + "px";
	const blueprintEl = closeSprite.parentElement.parentElement;
	const margin = getComputedStyle(blueprintEl).getPropertyValue("margin");
	return {
		width: size,
		height: size,
		margin
	};
};
const injectDownloadButtonsIntoStory = (storyEl: HTMLElement) => {
	const closeEl = findCloseStoryElement(storyEl);
	if (closeEl === null){
		console.warn("cannot find the close button. instagram may have changed it.");
		return;
	}

	const container = createElementByHTML(`
		<div style="position: absolute; right: -56px; top: 56px;"></div>
	`);
	const getMediaSrc = () => getMediaSrcOfStoryElement(storyEl);
	const diskDownloadButton = createDiskDownloadButton(getMediaSrc);
	Object.assign(diskDownloadButton.style, getStoryDownloadElementStyle(storyEl));
	container.appendChild(diskDownloadButton);

	const closeButton = closeEl.parentElement.parentElement;
	closeButton.insertAdjacentElement("afterend", container);
};
instaChangeDetector.addEventListener("onStoryAdded", e => injectDownloadButtonsIntoStory((e as any).detail.element));



instaChangeDetector.start();
