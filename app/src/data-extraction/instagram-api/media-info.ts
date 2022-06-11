import { right } from "fp-ts/lib/Either";

function makeMediaFetchUrl(mediaId: string): string {
	return `https://i.instagram.com/api/v1/media/${mediaId}/info/`
}

export async function fetchMediaInfo(mediaID: string) {
	const response = await fetch(
		makeMediaFetchUrl(mediaID),
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