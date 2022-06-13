import { isLeft, right } from "fp-ts/lib/Either";
import { getMediaInfoFromResponseObject } from "../from-fetch-response/fetch-media-data";
import { fetchMediaInfoWithCurrentHeaders } from "../instagram-api/media-info";
import { queryOrFetchMediaId } from "./media-id-of-post";

export async function fetchMediaAndExtract(postElement: HTMLElement) {
	const mediaIdEither = await queryOrFetchMediaId(postElement);
	if (isLeft(mediaIdEither)) return mediaIdEither;
	
	const mediaInfoJsonEither = await fetchMediaInfoWithCurrentHeaders(mediaIdEither.right);
	if (isLeft(mediaInfoJsonEither)) {
		throw mediaInfoJsonEither;
	}
	const extractedInfo = getMediaInfoFromResponseObject(
		mediaInfoJsonEither.right
	);
	return right(extractedInfo);
}