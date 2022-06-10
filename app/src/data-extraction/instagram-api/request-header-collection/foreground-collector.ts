
type RequestHeader = Record<string, string>;
type APIRequestData = {
	url: string,
	headers: RequestHeader
}

type RequestDataOpt = APIRequestData | null;

let currentRequest: RequestDataOpt = null;

export function getRecentMediaInfoRequest(): RequestDataOpt {
	return currentRequest;
}

chrome.runtime.onMessage.addListener(
	function (request) {
		if (!("requestHeaders" in request)) return;
		currentRequest = request as APIRequestData;
	}
);