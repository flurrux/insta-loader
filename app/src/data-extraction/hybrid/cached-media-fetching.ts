import { createMediaFetcherBySrcElementAndFetchFunc } from "../from-fetch-response/cached-media-fetching";
import { fetchMediaAndExtract } from "./media-of-post";

export function makeMediaSrcFetcher(postElement: HTMLElement) {
	return createMediaFetcherBySrcElementAndFetchFunc
		(() => fetchMediaAndExtract(postElement))
		(postElement)
}