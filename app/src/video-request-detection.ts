
console.log("listening for instagram videos ...");

// listen for video requests in the background

chrome.webRequest.onBeforeRequest.addListener(
	function (details) {
		const { url } = details;
		if (!url.includes("instagram") && !url.includes(".webm")) return;

		const { tabId } = details;
		const urlWithoutByteParams = /.*(?=&bytestart)/.exec(url);
		if (urlWithoutByteParams !== null) {
			chrome.tabs.sendMessage(
				tabId,
				{ url: urlWithoutByteParams[0] }
			);
		}
		return { cancel: false };
	},
	{ urls: ["*://*.fbcdn.net/*"] }
);