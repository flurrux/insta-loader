
import { downloadResource } from '../lib/download-util.js';
import storeOnDisk from './disk-writing/request-disk-download.js';
import instaChangeDetector from '../lib/insta-change-detection.js';
import * as instaInfoUtil from '../lib/insta-info-util.js';
import getWriteFolderPath from './disk-writing/request-write-path.js';

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

const triggerMouseEvent = (node, eventType) => {
	
	let clickEvent = document.createEvent ('MouseEvents');
	clickEvent.initEvent (eventType, true, true);
	node.dispatchEvent (clickEvent);
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

const getResourceUrl = url => window.getInstaExtensionUrl(url);

const getIconSrc = (iconAppendix) => {

	return getResourceUrl(`icons/download icon ${iconAppendix}.png`);
};

const initIconImg = (img, size, iconAppendix) => {

	let sizeStyle = size + "px";
	img.style.width = sizeStyle;
	img.style.height = sizeStyle;
	img.src = getIconSrc(iconAppendix);
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

	constructor(){

	}

	getMediaSrc(callback){}

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

	getMediaSrc(callback){

		this.instaBar.getMediaSrc(callback);
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
		let src = getIconSrc(iconAppendix);
		this.buttonImg.src = src;
	}

	promptDownload(){
		this.getMediaSrc(mediaSrc => {
			if (mediaSrc == null){
				console.error("no media found");
				return;
			}
			downloadResource(mediaSrc, getFilenameForUrl(mediaSrc));
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
			console.error(answer.data);
			return "fail";
		}
		else if (answer.origin === "native host response") {
			const resultEntry = answer.data[0];
			const resultEntryType = resultEntry.type;
			if (resultEntryType === "success") {
				return "success";
			}
			else if (resultEntryType === "error") {
				console.error(resultEntry.data);
				return "fail";
			}
		}
		return "loading";
	}

	onDiskDownloadReturn(answer){
		const nextState = this.getNextState(answer);
		if (nextState === "loading"){
			this._loadingProgress = answer.data[0].data.progress;
		}
		this.setState(nextState);
	}

	async storeOnDisk(mediaSrc, username){
		const ownUsername = instaInfoUtil.getOwnUsername();
		const folderPath = await getWriteFolderPath({ mediaSrc, username, ownUsername });
		const fileName = getFilenameForUrl(mediaSrc);
		storeOnDisk({ mediaSrc, folderPath, fileName }, (answer) => this.onDiskDownloadReturn(answer));
	}

	onClick(){
		this.setState("loading");
		this.getMediaSrc((src, username) => {
			if (src == null){
				this.setState("fail");
				return;
			}
			this.storeOnDisk(src, username);
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

	getMediaSrc(callback){

		let linkElement = this.instaElement.querySelector("a");
		if (linkElement == null){

			console.warn("instagram may have changed this element");
			callback(null);
			return;
		}
		let postHref = linkElement.href;

		instaInfoUtil.getMediaInfo(postHref, (data) => {
			if (data.mediaArray.length == 0){
				console.warn("no media could be found. is this a page that contains media?");
				callback(null);
				return;
			}

			let mediaObj = data.mediaArray[0];
			let src = getAppropMediaSrc(mediaObj);
			let username = data.username;
			callback(src, username);
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
		return parent.querySelector(`*[aria-label*="Save"]`) ||
			parent.querySelector(`*[aria-label*="Remove"]`);
	}

	add(obj){

		super.add(obj);
		
		let saveToCollectionEl = this.findSaveElement();
		let blueprintEl = saveToCollectionEl.parentElement;

		let size = saveToCollectionEl.clientHeight;
		let padding = getComputedStyle(blueprintEl).padding;
		obj.setStyle(size, padding, "0px");
	}

	getMediaSrc(callback){

		let postElement = this.instaElement;
		let postHref = instaInfoUtil.getHrefOfPost(postElement);
		let previewSrc = instaInfoUtil.getPreviewSrcOfPost(postElement);
		if (previewSrc == null){
			callback(null);
			return;
		}

		const data = instaInfoUtil.getMediaInfoByHtml(postElement);
		callback(data.media.src, data.username);

		// const onMediaRetrieved = (data) => {

		// 	let mediaArray = data.mediaArray;
		// 	let mediaToDownload = null;
		// 	if (mediaArray.length == 1){
		// 		mediaToDownload = mediaArray[0];
		// 	}
		// 	else {
		// 		//multiple medias from collection, find the one that is currently visible
		// 		let mediaIndex = 0;
		// 		{
		// 			const indexIndicator = postElement.querySelector(".XCodT");
		// 			mediaIndex = Array.from(indexIndicator.parentElement.children).indexOf(indexIndicator);
		// 		}
		// 		mediaToDownload = mediaArray[mediaIndex];

		// 		//legacy, instagram used to load the collection element dynamically,
		// 		//so we had to get the media by matching the preview-src
		// 		//mediaToDownload = mediaArray.find(entry => entry.previewSrc == previewSrc);
		// 	}

		// 	if (mediaToDownload == null){
		// 		return;
		// 	}

		// 	let src = getAppropMediaSrc(mediaToDownload);
		// 	let username = data.username;
		// 	callback(src, username);
		// }
		// instaInfoUtil.getMediaInfo(postHref, onMediaRetrieved);


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

//pausing
let mouseDownOnStory, appendStoryPauseButton;
{
	const press = () => {

		let startTime = window.performance.now();
		//console.log(getPressElement());
		//let pressElement = getPressElement();
		let duration = window.performance.now() - startTime;
		triggerMouseEvent(getPressElement(), "mousedown");
	};
	mouseDownOnStory = press;

	const getPressElement = () => {

		return document.querySelector("._v88d1");
	};

	const pausedLabelClass = "_53tkq";

	const isPlaying = () => {

		return document.querySelector(`.${pausedLabelClass}`) == null;
	};

	{
		let StoryPlayer;
		{
			
			StoryPlayer = {};
			StoryPlayer.onPlayStateChanged = [];

			const onPlayStateChanged = (playing) => {

				StoryPlayer.onPlayStateChanged.forEach(callback => callback(playing));
			};

			const isPausedLabel = (element) => {

				return element.classList.contains("");
			};

			const onPlayStateMutation = (mutation) => {

				onPlayStateChanged(isPlaying());    
			};

			const initPlayStateObserver = () => {

				let pauseLabelParent = document.querySelector("._2tt3z");
				let observer = new MutationObserver((mutationArray) => onPlayStateMutation(mutationArray[0]));
				observer.observe(pauseLabelParent, { childList: true });
			};

			StoryPlayer.init = initPlayStateObserver;
		}

		let StoryPauser;
		{
			StoryPauser = {};

			let customPaused = false;
			let triggeredPlayStateChange = false;
			let onMouseDown = () => {

				triggeredPlayStateChange = true;
				customPaused = false;
				let node = getPressElement();
				node.removeEventListener("mousedown", onMouseDown);
				node.removeEventListener("mouseleave", onMouseLeave);
			};

			const onMouseLeave = () => {

			};

			const pauseStory = () => {
				
				customPaused = true;
				press();

				let node = getPressElement();
				node.addEventListener("mousedown", onMouseDown);
				node.addEventListener("mouseleave", onMouseLeave);
			};

			const resumeStory = () => {

				customPaused = false;
				let node = getPressElement();
				node.removeEventListener("mousedown", onMouseDown);
				node.removeEventListener("mouseleave", onMouseLeave);
				triggerMouseEvent(node, "mouseup");
			};

			const onPlayStateChanged = (playing) => {
				
				if (triggeredPlayStateChange){

					triggeredPlayStateChange = false;
				}
				else {

					if (customPaused && playing){

						triggeredPlayStateChange = true;
						console.log("press");
						setTimeout(20, press);
					}
				}
			};
			StoryPlayer.onPlayStateChanged.push(onPlayStateChanged);

			const appendPauseButton = () => {

				let buttonHtml = `
					<button class="_t848o" style="top: 50px;">
						<div class="coreSpriteCloseLight">
							<span class="_8scx2">Close</span>
						</div>
					</button>
				`;

				let closeButton = document.querySelector("._t848o");
				closeButton.insertAdjacentHTML("afterend", buttonHtml);
				let button = closeButton.nextElementSibling;
					
				const onButtonClick = () => {

					triggeredPlayStateChange = true;
					let playing = isPlaying();
					if (playing){

						pauseStory();
					}
					else {

						if (customPaused){

							resumeStory();
						}
					}
				};
				button.addEventListener("click", onButtonClick);

			};

			StoryPauser.append = appendPauseButton;
		}

		appendStoryPauseButton = () => {

			StoryPlayer.init();
			StoryPauser.append();
		};
	}
}

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

	getMediaSrc(callback){

		let src = instaInfoUtil.getSrcOfStory(this.instaElement);
		let username = instaInfoUtil.getUsernameOfStory(this.instaElement);
		callback(src, username);
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

	//appendStoryPauseButton();
	//createStoryDownloadButton(storyElement);
	
	createBar(new StoryBar(), storyElement);
};

instaChangeDetector.addEventListener("onStoryAdded", e => onStoryAdded(e.detail.element));




instaChangeDetector.start();




/*
	{
		function createStoryDownloadButton(storyElement){

			let closeButton = storyElement.querySelector('*[class*="Close"').parentElement;
			let downloadButtonHtml = `

				<button class="_t848o" style="top: 90px;">
					<img style="width: 32px; height: 32px;" />
				</button>
			`;

			closeButton.insertAdjacentHTML('afterend', downloadButtonHtml);
			let downloadButton = closeButton.nextElementSibling;

			let img = downloadButton.querySelector("img");
			initIconImg(img, 32, "white");

			function onClick(){

				let src = instaInfoUtil.getSrcOfStory(storyElement);
				downloadUtil.downloadResource(src);
			}
			downloadButton.addEventListener("click", onClick);
		}

		function createPostDownloadButton(postElement){

			
			let borderColors = ["", "cyan", "blue", "orange", "red", "lime"];
			let borderColor = postElement.style.borderColor;
			let nextBorderColor = borderColors[borderColors.indexOf(borderColor) + 1];
			postElement.style.borderWidth = "5px";
			postElement.style.borderColor = nextBorderColor;
			return;
			
		}

		function createPreviewDownloadButton(previewElement){

			//when a preview element is hovered, the number of likes and comments
			//show up in an overlay. that overlay is appended as the last child 
			//and takes all the hover events. so when it shows up, move our overlay
			//down to be the last child
			
			function onLastChildChanged(mutations){

				let mutation = mutations[0];
				let addedNodes = mutation.addedNodes;
				if (addedNodes.length > 0){

					linkElement.removeChild(overlayEl);
					linkElement.appendChild(overlayEl);
				}
			}
			let observer = new MutationObserver(onLastChildChanged);
			observer.observe(linkElement, { childList: true });
			
		}
	}
*/