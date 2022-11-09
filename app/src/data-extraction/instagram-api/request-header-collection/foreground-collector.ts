import { left, right } from "fp-ts/es6/Either";
import { runtime } from "webextension-polyfill";

type RequestHeader = Record<string, string>;

// maybe we can get away with static headers like this.
// if this doesn't work, switch back to dynamically detected headers!
let useStaticHeader = true;
let currentHeaders: RequestHeader | null = ({
	"X-IG-App-ID": "936619743392459"
});



export function getCurrentHeaders(): RequestHeader | null {
	return currentHeaders;
}


const errorMessage = 'trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.';

export function getCurrentHeadersOrThrow(){
	if (!currentHeaders) throw errorMessage;
	return currentHeaders;
}

export function getCurrentHeadersAsEither() {
	if (!currentHeaders) return left(errorMessage);
	return right(currentHeaders);
}

runtime.onMessage.addListener(
	function (request) {
		if (!("requestHeaders" in request)) return;
		if (useStaticHeader) return;
		currentHeaders = request.requestHeaders;
	}
);