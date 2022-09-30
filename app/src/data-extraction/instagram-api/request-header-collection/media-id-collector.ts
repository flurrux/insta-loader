import { Either, left, right } from "fp-ts/es6/Either";

let currentMediaID: Either<string, string> = left('trying to find the media ID, but there was no previous request. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.');

export function getCurrentMediaID() {
	return currentMediaID;
}

chrome.runtime.onMessage.addListener(
	function (request) {
		if (!("mediaID" in request)) return;
		currentMediaID = right(request.mediaID);
	}
);