import { isLeft, right } from "fp-ts/es6/Either";
import { getMediaInfoFromResponseObject } from "../from-fetch-response/fetch-media-data";
import { fetchMediaInfoWithCurrentHeaders } from "../instagram-api/media-info";
import { getCurrentMediaID } from "../instagram-api/request-header-collection/media-id-collector";

export async function fetchMediaOnCurrentPageAndExtract() {
	const mediaIdEither = getCurrentMediaID();
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