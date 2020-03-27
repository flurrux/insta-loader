
interface DiskDownloadArgs {
	link: string,
	folderPath: string,
	fileName: string
};

type DownloadProgressCallback = (progress: number) => void;

export const download = (
	data: DiskDownloadArgs, 
	progressCallback: DownloadProgressCallback): Promise<unknown> => {

	const messageData = {
		requests: [
			{
				action: "write media by link",
				data
			}
		],
		time: window.performance.now()
	};

	let _resolve: Function = null; 
	let _reject: Function = null;
	const downloadPromise = new Promise((res, rej) => {
		_resolve = res;
		_reject = rej;
	});

	//long lived connection
	const port = chrome.runtime.connect({ 
		name: "disk-downloader" 
	});
	port.onMessage.addListener((answer, sender) => {
		if (answer.origin === "native host disconnect") {
			_reject(answer.data);
			return;
		}
		else if (answer.origin === "native host response") {
			const resultEntry = answer.data[0];
			const resultEntryType = resultEntry.type;
			if (resultEntryType === "success") {
				_resolve();
				return;
			}
			else if (resultEntryType === "error") {
				_reject(resultEntry.data);
				return;
			}
			else if (resultEntryType === "progress"){
				progressCallback(resultEntry.data.progress);
			}
		}

		const responseType = answer.data[0].type;
		if (responseType === "success"){
			port.disconnect();
		}
	});
	port.postMessage(messageData);

	return downloadPromise;
};
