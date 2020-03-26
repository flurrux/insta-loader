/**
 * Created by Christian on 15.08.2017.
 */

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
			});
		});
		port.onDisconnect.addListener(() => {
			const errorMessage = chrome.runtime.lastError.message;
			console.log("disconnected from native host", errorMessage);
			responseFunc({
				origin: "native host disconnect", 
				data: errorMessage
			});
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