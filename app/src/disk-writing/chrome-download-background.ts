
import { DownloadRequest, DownloadProgressResponse, DownloadSuccessResponse, DownloadErrorResponse, DownloadStateRequest, DownloadIdResponse } from "./chrome-download-types";


// type InterruptReason = "FILE_FAILED" | "FILE_ACCESS_DENIED" | "FILE_NO_SPACE" | "FILE_NAME_TOO_LONG" | "FILE_TOO_LARGE" | "FILE_VIRUS_INFECTED" | "FILE_TRANSIENT_ERROR" | "FILE_BLOCKED" | "FILE_SECURITY_CHECK_FAILED" | "FILE_TOO_SHORT" | "FILE_HASH_MISMATCH" | "FILE_SAME_AS_SOURCE" | "NETWORK_FAILED" | "NETWORK_TIMEOUT" | "NETWORK_DISCONNECTED" | "NETWORK_SERVER_DOWN" | "NETWORK_INVALID_REQUEST" | "SERVER_FAILED" | "SERVER_NO_RANGE" | "SERVER_BAD_CONTENT" | "SERVER_UNAUTHORIZED" | "SERVER_CERT_PROBLEM" | "SERVER_FORBIDDEN" | "SERVER_UNREACHABLE" | "SERVER_CONTENT_LENGTH_MISMATCH" | "SERVER_CROSS_ORIGIN_REDIRECT" | "USER_CANCELED" | "USER_SHUTDOWN" | "CRASH";
type DownloadItem = chrome.downloads.DownloadItem;
type DownloadOptions = chrome.downloads.DownloadOptions;

function getLastErrorMessageOrFallback(fallback: string): string {
	const lastError = chrome.runtime.lastError;
	if (lastError === undefined) return fallback;
	return lastError.message || fallback;
}

const startDownloadAndGetId = (options: DownloadOptions): Promise<number> => {
	return new Promise((resolve, reject) => {
		chrome.downloads.download(
			options,
			(downloadId: number) => {
				if (downloadId !== undefined){
					resolve(downloadId);
					return;
				}

				reject(
					getLastErrorMessageOrFallback(
						"chrome.runtime.lastError is undefined. no idea what the issue is, sorry"
					)
				)
			}
		);
	});
};


async function handleDownloadRequest(port: chrome.runtime.Port, msg: DownloadRequest){
	try {
		const id = await startDownloadAndGetId({
			url: msg.url,
			filename: msg.filePath,
			conflictAction: "prompt"
		});
		port.postMessage({
			type: "download-id", id
		} as DownloadIdResponse);
	}
	catch (e) {
		port.postMessage({
			type: "error",
			error: e
		} as DownloadErrorResponse);
	}
}

function handleStateRequest(port: chrome.runtime.Port, msg: DownloadStateRequest){
	chrome.downloads.search(
		{ id: msg.id }, 
		(items: DownloadItem[]) => {
			if (items.length === 0) {
				port.postMessage({
					type: "error",
					error: "download started but file not found. this may be a problem with chrome."
				} as DownloadErrorResponse);
				return;
			}
			else {
				if (items.length > 1) {
					console.warn("more than one file for this download found. this shoud not happen");
				}
				const item = items[0];
				const state = item.state;
				if (state === "interrupted") {
					port.postMessage({
						type: "error",
						error: item.error
					} as DownloadErrorResponse);
					return;
				}
				if (state === "complete") {
					port.postMessage({
						type: "success"
					} as DownloadSuccessResponse);
					return;
				}
				if (state === "in_progress") {
					port.postMessage({
						type: "progress",
						progress: {
							bytesReceived: item.bytesReceived,
							totalBytes: item.totalBytes,
							progress: (item.bytesReceived / item.totalBytes)
						}
					} as DownloadProgressResponse);
					return;
				}
			}
		}
	)
}

chrome.runtime.onConnect.addListener(
	(port) => {
		if (port.name !== "chrome-downloader") return;
	
		port.onDisconnect.addListener(
			() => console.log("port disconnected")
		);
		port.onMessage.addListener(
			async (msg: DownloadRequest | DownloadStateRequest, sender) => {
				console.log(msg);			
				if (msg.type === "request-download"){
					handleDownloadRequest(port, msg);
					return;
				}
	
				if (msg.type === "request-state"){
					handleStateRequest(port, msg);
				}
			}
		);
	}
);