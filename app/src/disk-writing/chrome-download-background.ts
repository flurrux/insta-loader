import { DownloadRequest, DownloadProgressResponse, DownloadSuccessResponse, DownloadErrorResponse } from "./chrome-download-types";


interface DownloadOptions {
	url: string,
	filename: string,
	conflictAction: "uniquify" | "overwrite" | "prompt"
};
type DownloadItemState = "in_progress" | "interrupted" | "complete";
type InterruptReason = "FILE_FAILED" | "FILE_ACCESS_DENIED" | "FILE_NO_SPACE" | "FILE_NAME_TOO_LONG" | "FILE_TOO_LARGE" | "FILE_VIRUS_INFECTED" | "FILE_TRANSIENT_ERROR" | "FILE_BLOCKED" | "FILE_SECURITY_CHECK_FAILED" | "FILE_TOO_SHORT" | "FILE_HASH_MISMATCH" | "FILE_SAME_AS_SOURCE" | "NETWORK_FAILED" | "NETWORK_TIMEOUT" | "NETWORK_DISCONNECTED" | "NETWORK_SERVER_DOWN" | "NETWORK_INVALID_REQUEST" | "SERVER_FAILED" | "SERVER_NO_RANGE" | "SERVER_BAD_CONTENT" | "SERVER_UNAUTHORIZED" | "SERVER_CERT_PROBLEM" | "SERVER_FORBIDDEN" | "SERVER_UNREACHABLE" | "SERVER_CONTENT_LENGTH_MISMATCH" | "SERVER_CROSS_ORIGIN_REDIRECT" | "USER_CANCELED" | "USER_SHUTDOWN" | "CRASH";
interface DownloadItem {
	id: number,
	url: string,
	finalUrl: string,
	filename: string,
	startTime: string,
	state: DownloadItemState,
	paused: boolean,
	canResume: boolean,
	error: InterruptReason,
	exists: boolean,
	bytesReceived: number,
	totalBytes: number,
	fileSize: number
};

interface DownloadProgress {
	progress: number,
	bytesReceived: number,
	totalBytes: number
};
type DownloadProgressCallback = (progressData: DownloadProgress) => void;

const startDownloadAndGetItem = (options: DownloadOptions): Promise<DownloadItem> => {
	return new Promise((resolve, reject) => {
		chrome.downloads.download(
			options,
			(downloadId: number) => {
				if (downloadId === undefined) {
					reject((window as any).runtime.lastError);
				}
				else {
					chrome.downloads.search({ id: downloadId }, (items: DownloadItem[]) => {
						if (items.length === 0){
							reject("download started but file not found. this may be a problem with chrome.");
						}
						else {
							if (items.length > 1){
								console.warn("more than one file for this download found. this shoud not happen");
							}
							resolve(items[0]);
						}
					})
				}
			}
		);
	});
};

const startPollingDownloadItemProgress = (
	item: DownloadItem, notificationInterval: number,
	progressCallback: DownloadProgressCallback): Promise<void> => {
	
	return new Promise((resolve, reject) => {
		let loopCount: number = 0;
		const loop = () => {
			if (loopCount % notificationInterval === 0) {
				if (item.state === "complete") {
					resolve();
					return;
				}
				if (item.state === "interrupted") {
					reject(item.error);
					return;
				}
				progressCallback({
					bytesReceived: item.bytesReceived,
					totalBytes: item.totalBytes,
					progress: (item.bytesReceived / item.totalBytes)
				});
			}
			loopCount++;
			window.requestAnimationFrame(loop);
		};
		loop();
	});
};

const downloadByChrome = async (
	options: DownloadOptions, 
	progressCallback: DownloadProgressCallback): Promise<void> => {

	const item = await startDownloadAndGetItem(options);
	await startPollingDownloadItemProgress(item, 5, progressCallback);
};


chrome.runtime.onConnect.addListener(function (port) {
	if (port.name !== "disk-downloader") return;
	port.onMessage.addListener(async (msg: DownloadRequest, sender) => {
		try {
			await downloadByChrome(
				{
					url: msg.url,
					filename: msg.filePath,
					conflictAction: "overwrite"
				},
				(progressData: DownloadProgress) => {
					port.postMessage({
						type: "progress",
						progress: progressData
					} as DownloadProgressResponse);
				}
			);
			port.postMessage({
				type: "success"
			} as DownloadSuccessResponse);
		}
		catch (e){
			port.postMessage({
				type: "error",
				error: e
			} as DownloadErrorResponse);
		}
	});
});