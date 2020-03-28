/**
 * Created by Christian on 15.08.2017.
 */

interface NativeProgressResponse {
	type: "progress",
	data: {
		progress: number
	}
};
interface NativeHostErrorResponse {
	type: "error",
	data: "wrong action-key" |
	"wrong data-key" |
	"wrong link-key" |
	"wrong folderPath-key" |
	"wrong fileName-key" |
	string;
};
interface NativeDownloadSuccessResponse {
	type: "success",
	data: string
};
type NativeHostResponse = NativeHostErrorResponse |
	NativeDownloadSuccessResponse |
	NativeProgressResponse;

interface ResponseToForeground {
	origin: string,
	data: string | NativeHostResponse
};


const chrome = (window as any).chrome;

const nativeHostName = "insta_loader_host";

const connectToNativeHost = (request, sender, responseFunc) => {
	console.log("connecting to native host...");
	console.log("request", request);
	const hostName = nativeHostName;
	try {
		const port = chrome.runtime.connectNative(hostName);
		port.onMessage.addListener(message => {
			console.log("received native message", message);
			responseFunc({
				origin: "native host response", 
				data: message    
			} as ResponseToForeground);
		});
		port.onDisconnect.addListener(() => {
			const errorMessage = chrome.runtime.lastError.message;
			console.log("disconnected from native host", errorMessage);
			responseFunc({
				origin: "native host disconnect", 
				data: errorMessage
			} as ResponseToForeground);
		});

		const requestString = JSON.stringify(request);
		port.postMessage(requestString);
	}
	catch(e){
		console.log(e);
		return;
	}
};

chrome.runtime.onConnect.addListener(function (port) {
	if (port.name !== "disk-downloader") return;
	port.onMessage.addListener(function (msg, sender) {
		connectToNativeHost(msg, sender, response => {
			port.postMessage(response);
		});
	});
});