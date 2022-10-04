import { runtime } from "webextension-polyfill";
import { DownloadRequest, DownloadResponse, DownloadErrorResponse, DownloadStateRequest } from "./chrome-download-types";

type ProgressCallback = (progress: number) => void;

export const download = (
	data: { filePath: string, url: string },
	progressCallback: ProgressCallback): Promise<void> => {

	return new Promise((resolve, reject) => {
		const port = runtime.connect({
			name: "chrome-downloader"
		});

		let downloadId = null;
		const requestState = () => {
			port.postMessage({
				type: "request-state",
				id: downloadId
			} as DownloadStateRequest);
		};
		port.onMessage.addListener((answer: DownloadResponse) => {
			if (answer.type === "download-id"){
				downloadId = answer.id;
				requestState();
				return;
			}
			if (answer.type === "error"){
				reject(answer.error);
				port.disconnect();
				return;
			}
			if (answer.type === "success") {
				resolve();
				port.disconnect();
				return;
			}
			if (answer.type === "progress"){
				progressCallback(answer.progress.progress);
				requestState();
				return;
			}
		});
		port.postMessage({
			type: "request-download",
			filePath: data.filePath,
			url: data.url
		} as DownloadRequest);
	});
};