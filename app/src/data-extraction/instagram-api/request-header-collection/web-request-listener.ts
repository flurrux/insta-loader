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

const polarisPostRootQuery = "PolarisPostRootQuery";

const graphqlUrls: string[] = [
	// "*://www.instagram.com/graphql/query",
	"*://www.instagram.com/api/graphql"
];

webRequest.onSendHeaders.addListener(
	(details) => {
		const { requestHeaders } = details;
		if (!requestHeaders) return;
		console.log("graphql request headers", details);

		const X_FB_Friendly_Name_entry = requestHeaders.find(
			({ name }) => name === "X-FB-Friendly-Name"
		);
		if (!X_FB_Friendly_Name_entry) return;
		if (X_FB_Friendly_Name_entry.value !== polarisPostRootQuery) return;

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

		const formData = details.requestBody?.formData;
		if (!formData) return;

		const { fb_api_req_friendly_name } = formData;
		if (!fb_api_req_friendly_name) return;
		if (fb_api_req_friendly_name[0] !== polarisPostRootQuery) return;

		tabs.sendMessage(
			details.tabId, { requestBody: formData }
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