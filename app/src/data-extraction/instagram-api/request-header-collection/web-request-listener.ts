import { tabs, webNavigation, webRequest, WebRequest } from "webextension-polyfill";


console.log("listening for instagram API calls ...");

// ## headers ##


function objectifyRequestHeaders(headers: WebRequest.HttpHeadersItemType[]) {
	const obj: Record<string, string> = {};
	for (const { name, value } of headers) {
		if (value === undefined) continue;
		obj[name] = value;
	}
	return obj;
}


// ## listener ##


// # api #

function detectMediaID(details: WebRequest.OnSendHeadersDetailsType) {
	const { tabId, url } = details;
	const mediaIdMatch = /(?<=instagram\.com\/api\/v1\/media\/)\d*(?=\/info)/.exec(url);
	if (!mediaIdMatch) return;

	const mediaID = mediaIdMatch[0];
	console.log("detected media ID!", mediaID);
	tabs.sendMessage(
		tabId, { mediaID }
	);
}

webRequest.onSendHeaders.addListener(
	detectMediaID,
	{
		urls: [
			"*://i.instagram.com/api/*",
			"*://www.instagram.com/api/*"
		]
	},
	["requestHeaders"]
);


// # graphql #

webRequest.onSendHeaders.addListener(
	(details) => {
		tabs.sendMessage(
			details.tabId, 
			{ requestHeaders: objectifyRequestHeaders(details.requestHeaders) }
		);
	},
	{ urls: [ "*://www.instagram.com/graphql/query" ] },
	[ "requestHeaders" ]
);

webRequest.onBeforeRequest.addListener(
	(details) => {
		tabs.sendMessage(
			details.tabId,
			{ requestBody: details.requestBody?.formData }
		);
	},
	{ urls: ["*://www.instagram.com/graphql/query"] },
	[ "requestBody" ]
);



// this listener is needed to wake up the background script whenever we navigate to instagram.
// see https://stackoverflow.com/a/71431963
webNavigation.onHistoryStateUpdated.addListener(
	(details) => {
		console.log('waking up');
	}
);