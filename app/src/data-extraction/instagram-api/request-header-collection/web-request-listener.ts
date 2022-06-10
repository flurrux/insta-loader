

console.log("listening for API call for media info ...");

type RequestHeader = {
	name: string,
	value: string
}

function objectifyRequestHeaders(headers: RequestHeader[]) {
	const obj: Record<string, string> = {};
	for (const { name, value } of headers) {
		obj[name] = value;
	}
	return obj;
}

chrome.webRequest.onSendHeaders.addListener(
	function (details) {
		const { url, tabId, requestHeaders } = details;
		console.log(details);
		chrome.tabs.sendMessage(
			tabId,
			{
				requestHeaders: objectifyRequestHeaders(
					requestHeaders as RequestHeader[]
				),
				url
			}
		);
	},
	{
		urls: [
			"https://i.instagram.com/api/v1/media/*/info/"
		]
	},
	["requestHeaders"]
)