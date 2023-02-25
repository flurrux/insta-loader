import { Either, isLeft, left, right } from "fp-ts/es6/Either";
import { runtime } from "webextension-polyfill";



// ## headers ##

type RequestHeader = Record<string, string>;

// maybe we can get away with static headers like this.
// if this doesn't work, switch back to dynamically detected headers!
let useStaticHeader = false;

let currentHeaders: RequestHeader | null = ({
	"X-IG-App-ID": "936619743392459"
});

export function getCurrentHeaders(): RequestHeader | null {
	return currentHeaders;
}

const errorMessage = 'trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.';

export function getCurrentHeadersOrThrow() {
	if (!currentHeaders) throw errorMessage;
	return currentHeaders;
}

export function getCurrentHeadersAsEither() {
	if (!currentHeaders) return left(errorMessage);
	return right(currentHeaders);
}



// ## body ##

type InterceptedRequestBody = Record<string, string[]>;

let currentBody: InterceptedRequestBody = {};

export function getCurrentBody(): InterceptedRequestBody {
	return currentBody;
}

runtime.onMessage.addListener(
	function (message) {
		if ("requestHeaders" in message && !useStaticHeader){
			currentHeaders = message.requestHeaders;
		}
		if ("requestBody" in message){
			currentBody = message.requestBody;
		}
	}
);



// ## headers and body combined ##

export type RequestHeadersAndBody = {
	headers: RequestHeader,
	body: InterceptedRequestBody
}

export function getRequestHeadersAndBody(): Either<any, RequestHeadersAndBody> {
	const headersEith = getCurrentHeadersAsEither();
	if (isLeft(headersEith)) return headersEith;

	return right({
		headers: headersEith.right,
		body: currentBody
	})
}