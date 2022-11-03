import { isLeft, right } from "fp-ts/es6/Either";
import { getCurrentHeadersOrThrow } from "../request-header-collection/foreground-collector";
import { makeApiUrl } from "../url-maker";

function makeStoriesFetchUrl(userID: string): string {
	return makeApiUrl(`feed/reels_media/?reel_ids=${userID}`);
}

export async function fetchUserStoryData(headers: Record<string, string>, mediaID: string) {
	const response = await fetch(
		makeStoriesFetchUrl(mediaID),
		{ credentials: "include", headers }
	);
	return right(await response.json() as object);
}

export async function fetchUserStoryDataWithCurrentHeaders(userID: string) {
	const headers = getCurrentHeadersOrThrow();
	return fetchUserStoryData(headers, userID);
}