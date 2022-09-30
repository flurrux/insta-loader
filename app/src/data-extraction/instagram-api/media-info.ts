import { right } from "fp-ts/es6/Either";
import { getCurrentHeadersOrThrow } from "./request-header-collection/foreground-collector";

function makeMediaFetchUrl(mediaId: string): string {
	return `https://i.instagram.com/api/v1/media/${mediaId}/info/`
}

export async function fetchMediaInfo(headers: Record<string, string>, mediaID: string) {
	const response = await fetch(
		makeMediaFetchUrl(mediaID),
		{ credentials: "include", headers }
	);
	return right(await response.json() as object);
}

export async function fetchMediaInfoWithCurrentHeaders(mediaID: string){
	const headers = getCurrentHeadersOrThrow();
	return fetchMediaInfo(headers, mediaID);
}