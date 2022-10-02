import { left, right } from "fp-ts/es6/Either";

type RequestHeader = Record<string, string>;

let currentHeaders: RequestHeader | null = null;

export function getCurrentHeaders(): RequestHeader | null {
	return currentHeaders;
}

export function getCurrentHeadersOrThrow(){
	if (!currentHeaders){
		throw 'trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.'
	}
	return currentHeaders;
}

export function getCurrentHeadersAsEither() {
	if (!currentHeaders) {
		return left(
			'trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.'
		)
	}
	return right(currentHeaders);
}

chrome.runtime.onMessage.addListener(
	function (request) {
		if (!("requestHeaders" in request)) return;
		currentHeaders = request.requestHeaders;
	}
);