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

const graphqlUrls: string[] = [
	// "*://www.instagram.com/graphql/query",
	"*://www.instagram.com/api/graphql"
];

webRequest.onSendHeaders.addListener(
	(details) => {
		const { requestHeaders } = details;
		if (!requestHeaders) return;
		console.log("graphql request headers", details);
		tabs.sendMessage(
			details.tabId, 
			{ requestHeaders: objectifyRequestHeaders(requestHeaders) }
		);
	},
	{ urls: graphqlUrls },
	[ "requestHeaders" ]
);

webRequest.onBeforeRequest.addListener(
	(details) => {
		console.log("graphql request body", details);
		tabs.sendMessage(
			details.tabId,
			{ requestBody: details.requestBody?.formData }
		);
	},
	{ urls: graphqlUrls },
	[ "requestBody" ]
);



// this listener is needed to wake up the background script whenever we navigate to instagram.
// see https://stackoverflow.com/a/71431963
webNavigation.onHistoryStateUpdated.addListener(
	(details) => {
		console.log('waking up');
	}
);