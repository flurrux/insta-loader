

console.log("listening for instagram API calls ...");

type HeadersDetails = chrome.webRequest.WebRequestHeadersDetails;

// ## headers ##

type RequestHeader = {
	name: string,
	value: string
}

function objectifyRequestHeaders(headers: chrome.webRequest.HttpHeader[]) {
	const obj: Record<string, string> = {};
	for (const { name, value } of headers) {
		if (value === undefined) continue;
		obj[name] = value;
	}
	return obj;
}

function detectHeaders(details: HeadersDetails){
	const { tabId, requestHeaders } = details;
	if (!requestHeaders) return;

	const wwwClaimHeader = requestHeaders.find(
		(header) => header.name === "X-IG-WWW-Claim"
	);
	if (!wwwClaimHeader) return;
	const wwwClaimValue = wwwClaimHeader.value;
	if (!wwwClaimValue) return;
	// so far, i've only seen lengthy www-claim values, like more than 20 characters, and occasionally values like "0".  
	if (wwwClaimValue.length < 2) return;

	// by experimentation, i've found that the two header values X-IG-App-ID and X-IG-WWW-Claim are sufficient
	const sufficientHeaderNames = [
		"X-IG-App-ID", "X-IG-WWW-Claim"
	];
	const minimalHeaders = objectifyRequestHeaders(
		requestHeaders.filter(
			(entry) => sufficientHeaderNames.includes(entry.name)
		)
	);

	console.log("detected valid headers", minimalHeaders);

	chrome.tabs.sendMessage(
		tabId,
		{ requestHeaders: minimalHeaders }
	);
}


// ## media ID ##

function detectMediaID(details: HeadersDetails){
	const { tabId, url } = details;
	const mediaIdMatch = /(?<=i\.instagram\.com\/api\/v1\/media\/)\d*(?=\/info)/.exec(url);
	if (!mediaIdMatch) return;
	
	const mediaID = mediaIdMatch[0];
	console.log("detected media ID!");
	chrome.tabs.sendMessage(
		tabId, { mediaID }
	);
}


// ## listener ##

chrome.webRequest.onSendHeaders.addListener(
	function (details) {
		detectHeaders(details);
		detectMediaID(details);
	},
	{
		urls: [
			"*://i.instagram.com/api/*"
		]
	},
	["requestHeaders"]
);

// this listener is needed to wake up the background script whenever we navigate to instagram.
// see https://stackoverflow.com/a/71431963
chrome.webNavigation.onHistoryStateUpdated.addListener(
	(details) => {
		console.log('waking up');
	}
);