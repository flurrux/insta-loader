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