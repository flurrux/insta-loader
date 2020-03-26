
interface DiskDownloadArgs {
	link: string,
	folderPath: string,
	fileName: string
};

type DiskDownloadCallback = (arg: any) => void;

export const download = (data: DiskDownloadArgs, callback: DiskDownloadCallback) => {
	const messageData = {
		requests: [
			{
				action: "write media by link",
				data
			}
		],
		time: window.performance.now()
	};

	//long lived connection
	const port = chrome.runtime.connect({ 
		name: "disk-downloader" 
	});
	port.onMessage.addListener((msg, sender) => {
		const responseType = msg.data[0].type;
		if (responseType === "success"){
			port.disconnect();
		}
		callback(msg);
	});
	port.postMessage(messageData);
};
