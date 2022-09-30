import { isLeft } from "fp-ts/es6/Either";
import { createFileNameByUrl } from "../../lib/url-to-filename";
import { getOwnUsername } from "../data-extraction/directly-in-browser/own-username";
import { download as downloadByChrome } from '../disk-writing/chrome-download';
import { download as storeOnDisk } from '../disk-writing/disk-download';
import { getFolderPath } from "../disk-writing/lookup-write-path";
import { DownloadFeedbackButton } from "./download-feedback-button";
import { getIconUrl } from "./icon-url";


export interface MediaWriteInfo {
	src: string,
	username: string
};
export type LoadingCallback = (progress: number) => void;

type DownloadMethod = "native" | "chrome-background";
const defaultDownloadMethod: DownloadMethod = "chrome-background";

const getDownloadMethod = (): Promise<DownloadMethod> => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(
			{ downloadMethod: defaultDownloadMethod },
			(items: { downloadMethod: DownloadMethod }) => {
				if (chrome.runtime.lastError){
					reject(chrome.runtime.lastError.message);
					return;
				}
				resolve(items.downloadMethod);
			}
		);
	});
};

const downloadInBackground = async (mediaInfo: MediaWriteInfo, loadingCallback: LoadingCallback): Promise<void> => {
	const downloadMethod = await getDownloadMethod();
	const mediaSrc = mediaInfo.src;

	const fileNameEither = createFileNameByUrl(mediaSrc);
	if (isLeft(fileNameEither)){
		throw fileNameEither.left;
	}
	const fileName = fileNameEither.right;

	if (downloadMethod === "native") {
		const ownUserName = getOwnUsername();
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
	else if (downloadMethod === "chrome-background"){
		await downloadByChrome({
			filePath: `Instagram/${mediaInfo.username}/${fileName}`,
			url: mediaSrc
		}, loadingCallback);
	}
};

export interface DiskDownloadButtonOptions {
	onDownloadStart: () => void,
	onDownloadEnd: () => void
};
const downloadFileIndirectly = async (
	getMediaInfo: () => Promise<MediaWriteInfo>,
	loadingCallback: LoadingCallback) => {

	let mediaInfo: MediaWriteInfo = null;
	try {
		mediaInfo = await getMediaInfo();
		await downloadInBackground(mediaInfo, loadingCallback);		
	}
	catch (error) {
		console.error(error);
		const message = mediaInfo ? `${error}, \n user: ${mediaInfo.username}, \n src: ${mediaInfo.src}` : error;
		chrome.runtime.sendMessage({
			type: "show-notification",
			notification: {
				title: "download failed",
				message,
				iconUrl: getIconUrl("insta-loader-icon-48")
			}
		});

		//throw the error again for caller
		throw error;
	}
};
export const createDiskDownloadButton = (
	getMediaInfo: () => Promise<MediaWriteInfo>,
	options: Partial<DiskDownloadButtonOptions> = {}): HTMLElement => {

	options = {
		onDownloadStart: () => { },
		onDownloadEnd: () => { },
		...options
	};

	const buttonWrapper = new DownloadFeedbackButton();
	const buttonEl = buttonWrapper.getElement();
	const startDownload = async () => {
		buttonWrapper.downloadState = "loading";
		const updateProgress = (progress: number) => buttonWrapper.loadingProgress = progress;
		options.onDownloadStart();
		try {
			await downloadFileIndirectly(getMediaInfo, updateProgress);
			buttonWrapper.downloadState = "success";
		}
		catch (e){
			buttonWrapper.downloadState = "fail";
		}
		options.onDownloadEnd();
	};
	buttonEl.addEventListener("download-request", startDownload);
	buttonEl.addEventListener("mousedown", startDownload);
	return buttonEl;
};