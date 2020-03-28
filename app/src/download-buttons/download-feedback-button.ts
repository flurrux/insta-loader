import { getElementTypesOnCurrentPage } from '../insta-info-util';


type DownloadState = "initial" | "loading" | "success" | "fail";

const iconNames = {
	initial: "save",
	loading: "spinner-of-dots",
	success: "verify-sign-green",
	fail: "error"
};

const chrome = (window as any).chrome;

export class DownloadFeedbackButton {
	
	_downloadState: DownloadState = "initial";
	get downloadState(): DownloadState {
		return this._downloadState;
	}
	set downloadState(val: DownloadState){
		this._downloadState = val;
		this._onDownloadStateChanged();
	}
	
	_loadingProgress: number = 0;
	get loadingProgress(): number {
		return this._loadingProgress;
	}
	set loadingProgress(val: number) {
		this._loadingProgress = val;
		if (this._downloadState === "loading"){
			this._drawSpinner();
		}
	}

	_spinnerCtx = null;
	_spinnerCanvas = null;
	_buttonImg = null;
	_rootElement = null;

	constructor(){
		this._rootElement = document.createElement("a");
		Object.assign(this._rootElement.style, {
			width: "fit-content",
			height: "fit-content",
			cursor: "pointer"
		});
		this._buttonImg = document.createElement("img");
		Object.assign(this._buttonImg.style, {
			width: "inherit",
			height: "inherit"
		});
		this._rootElement.appendChild(this._buttonImg);
		this._setInitialState();
	}
	getElement(): HTMLElement {
		return this._rootElement;
	}
	_setInitialState(){
		let elementType = getElementTypesOnCurrentPage()[0];
		let iconAppendix = elementType == "post" ? "dark" : "white";
		const iconName = `${iconNames["initial"]}-${iconAppendix}`;
		this._buttonImg.src = chrome.extension.getURL(`icons/${iconName}.png`);
	}
	_onDownloadStateChanged(){
		const state = this._downloadState;
		if (state === "loading"){
			//lazily instantiate canvas
			if (!this._spinnerCanvas){
				this._spinnerCanvas = document.createElement("canvas");
				this._spinnerCtx = this._spinnerCanvas.getContext("2d");
				this._drawSpinner();
			}
		}
		else {
			this._spinnerCanvas = null;
			this._spinnerCtx = null;

			let iconName = iconNames[state];
			if (state === "initial") {
				let elementType = getElementTypesOnCurrentPage()[0];
				let iconAppendix = elementType == "post" ? "dark" : "white";
				iconName += `-${iconAppendix}`;
			}
			this._buttonImg.src = chrome.extension.getURL(`icons/${iconName}.png`);
		}
	}
	_drawSpinner(){
		const ctx = this._spinnerCtx;
		const progress = this._loadingProgress;
		const squareSize = 32;
		Object.assign(this._spinnerCanvas, {
			width: squareSize,
			height: squareSize
		});
		ctx.clearRect(0, 0, squareSize, squareSize);
		ctx.lineWidth = 4;
		const radius = (squareSize - ctx.lineWidth) / 2;
		ctx.strokeStyle = "cyan";
		ctx.lineCap = "round";
		ctx.beginPath();
		const squareSizeHalf = squareSize / 2;
		const angleOffset = -Math.PI / 2;
		ctx.arc(squareSizeHalf, squareSizeHalf, radius, angleOffset, angleOffset + progress * 2 * Math.PI);
		ctx.stroke();

		this._buttonImg.src = this._spinnerCanvas.toDataURL();
	}
};