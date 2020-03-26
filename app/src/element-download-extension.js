
import { downloadResource } from '../lib/download-util.js';
import instaChangeDetector from '../lib/insta-change-detection.js';
import * as instaInfoUtil from '../lib/insta-info-util.js';
import { getFolderPath } from './disk-writing/lookup-write-path';
import { download as storeOnDisk } from './disk-writing/disk-download';

const getFilenameForUrl = (url) => {

	const endings = [".mp4", ".jpg"];
	for (let ending of endings){

		const index = url.indexOf(ending);
		if (index >= 0){

			let filename = url.substring(0, index + ending.length);
			filename = filename.substring(filename.lastIndexOf("/") + 1);
			return filename;
		}
	}
	
	return url;
};

const getHighestQualityImageSrc = (media) => {

	let srcset = media.srcset;
	let highQualSrc = srcset[srcset.length - 1].src;
	//highQualSrc = highQualSrc.substring(0, highQualSrc.indexOf(".jpg") + 4);
	return highQualSrc;
};

const getAppropMediaSrc = (media) => {

	return media.type == "video" ? media.src : getHighestQualityImageSrc(media);
};

const getResourceUrl = url => chrome.extension.getURL(url);

const getDownloadIconSrc = (iconAppendix) => {
	return getResourceUrl(`icons/download-icon-${iconAppendix}.png`);
};

const initIconImg = (img, size, iconAppendix) => {
	let sizeStyle = size + "px";
	img.style.width = sizeStyle;
	img.style.height = sizeStyle;
	img.src = getDownloadIconSrc(iconAppendix);
};

const setElementSize = (element, size) => {

	let sizeStyle = size + "px";
	element.style.width = sizeStyle;
	element.style.height = sizeStyle;
};

const findSpriteByText = (startNode, innerText) => {

	//return document.evaluate(`//span[contains(text(), ${innerText})]`, startNode, null, XPathResult.ANY_TYPE, null ).iterateNext()
	//const found = Array.from(startNode.querySelectorAll("span")).find(el => el.innerText == innerText);
	const found = startNode.querySelector(`span [aria-label="${innerText}"`);
	if (found === undefined){
		return null;
	}
	return found;
};

const findAnySpriteByText = (startNode, innerTexts) => {

	for (let innerText of innerTexts){

		const found = findSpriteByText(startNode, innerText);
		if (found != null){

			return found;
		}
	}

	return null;
};

class InstaLoaderBar {

	constructor(){}

	getMediaSrc(){}

	addToInsta(instaElement){

		this.instaElement = instaElement;
		this.appendToInsta(instaElement);
	}

	appendToInsta(instaElement){}

	add(obj){

		obj.instaBar = this;
		this.getChildrenContainer().appendChild(obj.getElement());
		obj.onAppend(this.instaElement);
	}

	getChildrenContainer(){}

	getElement(){}
}

class InstaButton extends EventTarget {

	constructor(){
		super();
	}

	setStyle(size, padding, margin){}
}

class InstaDownloadButton extends InstaButton {

	constructor(){
		
		super();

		let button = document.createElement("a");
		button.style.width = "fit-content";
		button.style.height = "fit-content";
		button.style.cursor = "pointer";
		button.addEventListener("click", () => this.onClick());

		let buttonImg = document.createElement("img");
		button.appendChild(buttonImg);

		this.buttonElement = button;
		this.buttonImg = buttonImg;
	}

	getMediaSrc(){
		return this.instaBar.getMediaSrc();
	}

	//onValidMediaRetrieved(mediaSrc){}

	onAppend(instaElement){

		/*
		let elementTypes = InstaLoader.infoUtil.getElementTypesOnCurrentPage();
		let elementType = elementTypes[0];
		let iconAppendixMap = {
			preview: "gray",
			post: "dark",
			story: "black"
		};
		let iconAppendix = iconAppendixMap[elementType];
		let src = getIconSrc(iconAppendix);
		this.buttonImg.src = src;
		*/
	}

	setStyle(size, padding, margin){

		let buttonImg = this.buttonImg;
		let button = this.buttonElement;

		setElementSize(buttonImg, size);

		button.style.padding = padding;
		button.style.margin = margin;
	}

	getElement(){

		return this.buttonElement;
	}

	onClick(){
		/*
		this.getMediaSrc(mediaSrc => {
			if (mediaSrc == null){
				console.error("no media found");
				return;
			}
			this.onValidMediaRetrieved(mediaSrc);
		});
		*/
	}
}

class PromptDownloadButton extends InstaDownloadButton {

	constructor(){
		
		super();
	}

	onAppend(instaElement){

		let elementTypes = instaInfoUtil.getElementTypesOnCurrentPage();
		let elementType = elementTypes[0];
		let iconAppendixMap = {
			preview: "white",
			post: "dark",
			story: "white"
		};
		let iconAppendix = iconAppendixMap[elementType];
		let src = getDownloadIconSrc(iconAppendix);
		this.buttonImg.src = src;
	}

	promptDownload(){
		this.getMediaSrc()
			.then(data => {
				downloadResource(data.src, getFilenameForUrl(data.src));
			})
			.catch(error => {
				console.error(error);
			});
	}

	onClick(){
		this.promptDownload();
	}
}

class DiskDownloadButton extends InstaDownloadButton {

	constructor(){

		super();

		//states:
		//default, loading, success, fail
		this.currentState = "default"; //"loading", "success", "fail"
		this.stateIconSources = {
			default: "save", 
			loading: "spinner-of-dots",
			success: "verify-sign-green",
			fail: "error"
		};
		this.setState("default");
		
		//loading
		this._loadingProgress = 0;
		this._spinnerCtx = null;
		this._spinnerCanvas = null;
	}

	onAppend(instaElement){

		instaChangeDetector.addOnPostSrcChanged(instaElement, () => this.setState("default"));
	}


	_redrawSpinner(){
		const ctx = this._spinnerCtx;
		const progress = this._loadingProgress;
		const squareSize = 32;
		ctx.clearRect(0, 0, squareSize, squareSize);
		ctx.lineWidth = 4;
		const radius = (squareSize - ctx.lineWidth) / 2;
		ctx.strokeStyle = "cyan";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.arc(squareSize / 2, squareSize / 2, radius, -Math.PI / 2, progress * Math.PI * 2 - Math.PI / 2);
		ctx.stroke();

		this.buttonImg.src = this._spinnerCanvas.toDataURL();
	}
	_handleSpinner(){
		const state = this.currentState;
		if (state === "loading"){
			if (this._spinnerCtx === null){
				const canvas = document.createElement("canvas");
				canvas.width = 32;
				canvas.height = 32;
				this._spinnerCtx = canvas.getContext("2d");
				this._spinnerCanvas = canvas;
			}
			this._redrawSpinner();
		}

		if (state !== "loading" && this._spinnerCtx !== null){
			this._spinnerCtx = null;
			this._spinnerCanvas = null;
		}
	}
	setState(nextState){

		if (nextState !== this.currentState){
			this.dispatchEvent(new CustomEvent("download-state-changed", { detail: { state: nextState } }));
		}
		const state = this.currentState = nextState;

		this._handleSpinner();
		if (state !== "loading") {
			let iconName = this.stateIconSources[state];
			if (this.currentState == "default"){

				let elementTypes = instaInfoUtil.getElementTypesOnCurrentPage();
				let elementType = elementTypes[0];
				let iconAppendix = elementType == "post" ? "dark" : "white";
				iconName += " " + iconAppendix;
			}
			this.buttonImg.src = getResourceUrl(`icons/${iconName}.png`);
		}
	}

	getNextState(answer){
		if (answer.origin === "native host disconnect") {
			return { state: "fail", error: answer.data };
		}
		else if (answer.origin === "native host response") {
			const resultEntry = answer.data[0];
			const resultEntryType = resultEntry.type;
			if (resultEntryType === "success") {
				return { state: "success" };
			}
			else if (resultEntryType === "error") {
				return { state: "fail", error: resultEntry.data };
			}
		}
		return { state: "loading" };
	}

	async storeOnDisk(mediaSrc, userName){
		const ownUserName = instaInfoUtil.getOwnUsername();
		const folderPath = await getFolderPath({ mediaSrc, userName, ownUserName });
		// const folderPath = `/home/christian/Corn/Babes/${username}`;
		const fileName = getFilenameForUrl(mediaSrc);
		return new Promise((resolve, reject) => {
			const data = {
				link: mediaSrc,
				folderPath,
				fileName
			};
			storeOnDisk(data, (answer) => {
				const nextStateData = this.getNextState(answer);
				const nextState = nextStateData.state;
				if (nextState === "loading") {
					this._loadingProgress = answer.data[0].data.progress;
					this.setState("loading");
				}
				else if (nextState === "success") {
					this.setState("success");
					resolve();
				}
				else if (nextState === "fail"){
					this.setState("fail");
					reject(nextStateData.error);
				}
			});
		});
	}

	_onError(error){
		console.error(error);
		this.setState("fail");
		chrome.runtime.sendMessage("nlbkkdknaklpmlpcifpbgoamdopmhkbh", {
			type: "notification",
			title: "instagram download failed",
			message: error
		});
	}

	onClick(){
		this.setState("loading");
		this.getMediaSrc()
			.then(data => {
				return this.storeOnDisk(data.src, data.username);
			})
			.catch(error => {
				this._onError(error);
			});
	}
}

const createBar = (bar, instaElement) => {

	bar.addToInsta(instaElement);

	let promptButton = new PromptDownloadButton();
	bar.add(promptButton);

	let diskButton = new DiskDownloadButton();
	bar.add(diskButton);
	diskButton.addEventListener("download-state-changed", e => {
		if (!bar.diskDownloadStateChanged) return;
		bar.diskDownloadStateChanged(e.detail.state);
	});
};

//preview ########

class PreviewBar extends InstaLoaderBar {

	constructor(){

		super();

		let overlayEl = document.createElement("div");
		let overlayStyle = overlayEl.style;
		overlayStyle.width = "100%";
		overlayStyle.position = "absolute";
		overlayStyle.left = "0px";
		overlayStyle.bottom = "0px";
		overlayStyle.flexDirection = "row";

		this.overlayContainer = overlayEl;
	}

	add(obj){

		super.add(obj);
		
		let size = 24;
		let padding = "5px";
		obj.setStyle(size, padding, "0px");
	}

	getMediaSrc(){
		let linkElement = this.instaElement.querySelector("a");
		if (linkElement == null){
			return Promise.reject("link-element not found");
		}
		let postHref = linkElement.href;

		return instaInfoUtil
			.getMediaInfo(postHref)
			.then(data => {
				let mediaObj = data.mediaArray[0];
				let src = getAppropMediaSrc(mediaObj);
				let username = data.username;
				return { username, src };
			}); 
	}

	appendToInsta(instaElement){

		instaElement.appendChild(this.overlayContainer);
	}

	getChildrenContainer(){

		return this.overlayContainer;
	}

	getElement(){

		return this.overlayContainer;
	}
}
const onPreviewAdded = (previewElement) => {

	createBar(new PreviewBar(), previewElement);
};
instaChangeDetector.addEventListener("onPreviewAdded", e => onPreviewAdded(e.detail.element));

//post ############

class PostBar extends InstaLoaderBar {

	constructor(){
		
		super();
		
		let container = document.createElement("div");
		container.style.flexDirection = "row";

		this.container = container;
	}

	findSaveElement(){
		const parent = this.instaElement;
		const section = parent.querySelector("section");
		if (!section){
			console.warn("section with buttons not found");
			return;
		}
		const svgs = Array.from(section.querySelectorAll("svg"));
		return svgs[svgs.length - 1];
	}

	add(obj){

		super.add(obj);
		
		let saveToCollectionEl = this.findSaveElement();
		let blueprintEl = saveToCollectionEl.parentElement;

		let size = saveToCollectionEl.clientHeight;
		let padding = getComputedStyle(blueprintEl).padding;
		obj.setStyle(size, padding, "0px");
	}

	getMediaSrc(){
		let postElement = this.instaElement;
		let previewSrc = instaInfoUtil.getPreviewSrcOfPost(postElement);
		if (previewSrc == null){
			return Promise.reject("preview-src not found");
		}
		const data = instaInfoUtil.getMediaInfoByHtml(postElement);
		return Promise.resolve({ 
			username: data.username, 
			src: data.media.src 
		});
	};

	appendToInsta(instaElement){

		this.instaElement = instaElement;
		let saveSprite = this.findSaveElement();
		if (saveSprite == null){
			console.warn("save-sprite not found");
			return;
		}
		let savePostEl = saveSprite.parentElement.parentElement;
		savePostEl.style.marginRight = "0px";
		savePostEl.parentElement.insertAdjacentElement("beforeend", this.container);
	}

	getChildrenContainer(){

		return this.container;
	}

	getElement(){

		return this.container;
	}
}
const onPostAdded = (postElement) => {
	createBar(new PostBar(), postElement);
};
instaChangeDetector.addEventListener("onPostAdded", e => onPostAdded(e.detail.element));


//story #######

class StoryBar extends InstaLoaderBar {

	constructor(){

		super();

		let container = document.createElement("div");
		let containerStyle = container.style;
		containerStyle.position = "absolute";
		containerStyle.right = "-56px";
		containerStyle.top = "56px";

		this.container = container;
	}

	findCloseElement(){

		//return findSpriteByText(this.instaElement, "Close");
		return this.instaElement.querySelector(".coreSpriteCloseLight").children[0];
	}

	add(obj){

		super.add(obj);

		//let closeSprite = document.querySelector('*[class*="Close"');
		var closeSprite = this.findCloseElement();
		
		let size = closeSprite.clientHeight;
		let blueprintEl = closeSprite.parentElement.parentElement;
		let margin = getComputedStyle(blueprintEl).margin;
		obj.setStyle(size, "0px", margin);
	}

	getMediaSrc(){
		let src = instaInfoUtil.getSrcOfStory(this.instaElement);
		let username = instaInfoUtil.getUsernameOfStory(this.instaElement);
		return Promise.resolve({ src, username });
	}

	appendToInsta(instaElement){

		let closeButton = this.findCloseElement();
		if (closeButton == null){

			console.warn("cannot find the close button. instagram may have changed it.");
			return;
		}

		closeButton = closeButton.parentElement.parentElement;
		closeButton.insertAdjacentElement("afterend", this.container);
	}

	getChildrenContainer(){

		return this.container;
	}

	diskDownloadStateChanged(newState){
		const video = document.querySelector("video");
		if (!video) return;
		if (newState === "loading"){
			video.pause();
			const keepPaused = () => video.pause();
			video.addEventListener("play", keepPaused);
			this._keepPaused = keepPaused;
		}
		else if (newState === "success"){
			video.removeEventListener("play", this._keepPaused);
			video.play();
		}
	}
}

const onStoryAdded = (storyElement) => {
	createBar(new StoryBar(), storyElement);
};

instaChangeDetector.addEventListener("onStoryAdded", e => onStoryAdded(e.detail.element));




instaChangeDetector.start();
