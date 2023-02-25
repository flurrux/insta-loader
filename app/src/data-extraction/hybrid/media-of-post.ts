import { isLeft, right } from "fp-ts/es6/Either";
import { getMediaInfoFromResponseObject } from "../from-fetch-response/fetch-media-data";
import { fetchMediaInfoWithCurrentHeaders } from "../instagram-api/media-info";

export async function fetchMediaOnCurrentPageAndExtract() {
	const mediaInfoJsonEither = await fetchMediaInfoWithCurrentHeaders();
	if (isLeft(mediaInfoJsonEither)) {
		throw mediaInfoJsonEither;
	}
	const extractedInfo = getMediaInfoFromResponseObject(
		mediaInfoJsonEither.right
	);
	return right(extractedInfo);
}