import { Either, isLeft, right } from "fp-ts/es6/Either";
import { identity } from "fp-ts/es6/function";
import { runtime } from "webextension-polyfill";
import { createFileNameByUrl } from "../../lib/url-to-filename";
import { download as downloadByChrome } from '../disk-writing/chrome-download';
import { DownloadFeedbackButton } from "./download-feedback-button";
import { getIconUrl } from "./icon-url";
import { MediaFetchFn } from "../media-fetch-fn";


// defining some handy types first:

export interface MediaWriteInfo {
	src: string,
	username: string
};

export type LoadingCallback = (progress: number) => void;



// # download by given media info (filename, url)

type DownloadArgs = {
	mediaInfo: MediaWriteInfo,
	loadingCallback: LoadingCallback
}

async function tryDownloadMedia(args: DownloadArgs): Promise<Either<any, void>> {
	const { mediaInfo, loadingCallback } = args;
	const mediaSrc = mediaInfo.src;

	const fileNameEither = createFileNameByUrl(mediaSrc);
	if (isLeft(fileNameEither)){
		return fileNameEither;
	}

	const fileName = fileNameEither.right;

	await downloadByChrome(
		{
			filePath: `Instagram/${mediaInfo.username}/${fileName}`,
			url: mediaSrc
		},
		loadingCallback
	);

	return right(undefined);
};



// # first try to fetch the media info and then try to download it.
// if anything goes wrong, show an error message:

type FetchAndDownloadArgs = {
	fetchMediaInfo: MediaFetchFn,
	loadingCallback: LoadingCallback
}

function dispatchDownloadErrorMessage(message: string){
	runtime.sendMessage({
		type: "show-notification",
		notification: {
			title: "download failed",
			message,
			iconUrl: getIconUrl("insta-loader-icon-48")
		}
	});
}

async function tryFetchAndDownloadMediaWithErrorFeedback(args: FetchAndDownloadArgs): Promise<boolean> {
	const { fetchMediaInfo: getMediaInfo, loadingCallback } = args;

	const mediaInfoEith = await getMediaInfo();
	if (isLeft(mediaInfoEith)){
		console.error(mediaInfoEith.left);
		dispatchDownloadErrorMessage(
			"something went wrong while trying to fetch the image or video. sorry for this vague message. i'm trying to provide better messages in future releases."
		);
		return false;
	}

	const mediaInfo = mediaInfoEith.right;

	// now that we've successfully fetched the media info,
	// try to download it:
	const downloadResult = await tryDownloadMedia({
		mediaInfo, loadingCallback
	});

	// handle failure to download
	if (isLeft(downloadResult)){
		const downloadFail = downloadResult.left;
		console.error(downloadFail);
		dispatchDownloadErrorMessage(
			`we've successfully figured out the download url and username, but the download failed anyway. not exactly sure why. i will try to include the exact reason soon. you may want to try downloading this file on your own. here's the url:\n${mediaInfo.src}\nusername: ${mediaInfo.username}`
		);
		return false;
	}

	return true;
};



// # download button

export type DiskDownloadButtonOptions = {
	fetchMediaInfo: MediaFetchFn,
	onDownloadStart?: VoidCallback,
	onDownloadEnd?: (downloadSuccessful: boolean) => void
};

export const createDiskDownloadButton = (options: DiskDownloadButtonOptions): HTMLElement => {

	const {
		fetchMediaInfo,
		onDownloadStart = identity,
		onDownloadEnd = identity
	} = options;

	const buttonWrapper = new DownloadFeedbackButton();
	const buttonEl = buttonWrapper.getElement();
	
	const startDownload = async () => {
		buttonWrapper.downloadState = "loading";
		
		const updateProgress = (progress: number) => {
			buttonWrapper.loadingProgress = progress;
		};

		onDownloadStart(undefined);

		const wasDownloadSuccessful = await tryFetchAndDownloadMediaWithErrorFeedback({
			fetchMediaInfo,
			loadingCallback: updateProgress
		});
		
		buttonWrapper.downloadState = wasDownloadSuccessful ? "success" : "fail";

		onDownloadEnd(wasDownloadSuccessful);
	};
	
	buttonEl.addEventListener("download-request", startDownload);

	buttonEl.addEventListener("mousedown", startDownload);

	return buttonEl;
};