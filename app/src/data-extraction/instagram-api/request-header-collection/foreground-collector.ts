import { Either, isLeft, left, right } from "fp-ts/es6/Either";
import { Option, isNone, none, some } from "fp-ts/es6/Option";
import { runtime } from "webextension-polyfill";



// ## headers ##

type RequestHeader = Record<string, string>;


let currentHeaders: RequestHeader | null = ({
	"X-IG-App-ID": "936619743392459"
});

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

let currentBody: Option<InterceptedRequestBody> = none;

let receivedRequestHeaders = false;

runtime.onMessage.addListener(
	function (message) {
		// set the requestBody only once!
		// this is important, because there can be multiple requests to graphql
		// that have nothing to do with fetching media information.
		// (i observed requests that merely seem to verify credentials or something)
		// it looks like only the first graphql request is exactly what we need.
		if ("requestBody" in message && isNone(currentBody)) {
			currentBody = some(message.requestBody);
		}

		// set `currentHeaders` only once for the same reason as above.
		// i'm not all to familiar with requestHeaders and don't know
		// if using the same headers from two different calls is okay or not.
		// but to be on the safe side, use only the headers of the first graphql request.
		// (i believe requestHeaders and requestBodies always come in pairs, but i'm not entirely sure)
		if ("requestHeaders" in message && !receivedRequestHeaders){
			currentHeaders = message.requestHeaders;
			receivedRequestHeaders = true;
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
	if (isNone(currentBody)){
		return left("we have not received any requestBody from the background script so far. please check if everything is working in order.");
	}

	return right({
		headers: headersEith.right,
		body: currentBody.value
	})
}