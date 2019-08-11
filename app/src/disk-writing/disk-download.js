const download = (mediaSrc, folderPath, fileName, callback) => {

	const data = {
		folderPath: folderPath,
		fileName: fileName,
		link: mediaSrc
	};

	const messageData = {
		requests: [
			{
				action: "write media by link",
				data: data
			}
		],
		time: window.performance.now()
	};

	//long lived connection
	const uniqueSenderName = "insta-loader";
	const port = chrome.runtime.connect({ name: uniqueSenderName });
	port.onMessage.addListener((msg, sender) => {
		const responseType = msg.data[0].type;
		if (responseType === "success"){
			port.disconnect();
		}
		callback(msg);
	});
	port.postMessage(messageData);

	//connection gets closed after one response
	//chrome.runtime.sendMessage(messageData, onResponse);
};


//by request
window.addEventListener("message", event => {
	if (!event.data || !event.data.type || event.data.type !== "request download to disk") {
		return;
	}
	const id = event.data.id;
	const callback = answer => {
		//patch progress response
		
		window.postMessage({ 
			type: "download to disk response", 
			id, answer 
		});
	};
	const args = event.data.args;
	download(args.mediaSrc, args.folderPath, args.fileName, callback);

}, false);