import { getOwnUsername } from "../insta-info-util";
import { createFileNameByUrl } from "../../lib/url-to-filename";
import { getFolderPath } from "../disk-writing/lookup-write-path";
import { download as storeOnDisk } from '../disk-writing/disk-download';
import { download as downloadByChrome } from '../disk-writing/chrome-download';
import { DownloadFeedbackButton } from "./download-feedback-button";
import { joinPaths } from '../../lib/path-util';

export interface MediaWriteInfo {
	src: string,
	username: string
};
export type LoadingCallback = (progress: number) => void;
export interface DiskDownloadButtonOptions {
	onDownloadStart: () => void,
	onDownloadEnd: () => void
};
const downloadFileIndirectly = async (
	getMediaInfo: () => Promise<MediaWriteInfo>,
	loadingCallback: LoadingCallback) => {

	let mediaInfo: MediaWriteInfo = null;
	try {
		const ownUserName = getOwnUsername();
		mediaInfo = await getMediaInfo();
		const mediaSrc = mediaInfo.src;
		const fileName = createFileNameByUrl(mediaSrc);

		const downloadNatively = false;
		if (downloadNatively){
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
		else {
			await downloadByChrome({
				filePath: `Instagram/${mediaInfo.username}/${fileName}`,
				url: mediaSrc
			}, loadingCallback);
		}
	}
	catch (error) {
		console.error(error);
		const message = mediaInfo ? `${error}, \n user: ${mediaInfo.username}, \n src: ${mediaInfo.src}` : error;
		chrome.runtime.sendMessage({
			type: "show-notification",
			notification: {
				title: "download failed",
				message,
				iconUrl: chrome.extension.getURL("icons/insta-loader-icon-48.png")
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
	buttonEl.addEventListener("mousedown", async (e) => {
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
	});
	return buttonEl;
};