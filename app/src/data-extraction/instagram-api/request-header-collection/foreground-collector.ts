import { left, right } from "fp-ts/es6/Either";
import { runtime } from "webextension-polyfill";

type RequestHeader = Record<string, string>;

let currentHeaders: RequestHeader | null = null;

export function getCurrentHeaders(): RequestHeader | null {
	return currentHeaders;
}

export function getCurrentHeadersOrThrow(){
	// maybe we can get away with static headers like this. 
	// if this doesn't work, switch back to dynamically detected headers!
	return {
		"X-IG-App-ID": "936619743392459"
	};

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

runtime.onMessage.addListener(
	function (request) {
		if (!("requestHeaders" in request)) return;
		currentHeaders = request.requestHeaders;
	}
);