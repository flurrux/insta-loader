import { isLeft, right } from "fp-ts/lib/Either";
import { findMediaIdOnPostPage } from "../directly-in-browser/media-id";

function makeMediaFetchUrl(mediaId: string): string {
	return `https://i.instagram.com/api/v1/media/${mediaId}/info/`
}

export async function fetchMediaInfo() {
	const mediaIdEither = findMediaIdOnPostPage();
	if (isLeft(mediaIdEither)) return mediaIdEither;
	const mediaId = mediaIdEither.right;
	const response = await fetch(
		makeMediaFetchUrl(mediaId),
		{
			credentials: "include",
			headers: { // hopefully these header values are always valid and do not depend on the user or on time
				"X-IG-App-ID": "936619743392459",
				"X-IG-WWW-Claim": "hmac.AR2QBIaghoDoJL618hB9QmcT_5fX13SscXD38AD - RuRv9kiJ"
			}
		}
	);
	const responseJson = await response.json();
	return right(responseJson as object);
}