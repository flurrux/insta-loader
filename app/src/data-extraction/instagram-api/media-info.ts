import { isLeft, isRight, left, right } from "fp-ts/es6/Either";
import { stringifyRequestBody } from "../../../lib/stringify-request-body";
import { getRequestHeadersAndBody, RequestHeadersAndBody } from "./request-header-collection/foreground-collector";
import { getCurrentMediaID } from "./request-header-collection/media-id-collector";
import { makeApiUrl } from "./url-maker";


// # graphl #

async function fetchMediaInfoByGraphql(headersAndBody: RequestHeadersAndBody) {
	const { headers, body } = headersAndBody;
	const bodyStringified = stringifyRequestBody(body);
	try {
		const response = await fetch(
			"https://www.instagram.com/graphql/query",
			{
				method: 'POST',
				credentials: "include", 
				headers,
				body: bodyStringified
			}
		);
		const responseJson = await response.json() as object;
		return right(responseJson);
	}
	catch(e){
		return left(e);
	}
}

// # api #

function makeMediaFetchUrl(mediaId: string): string {
	return makeApiUrl(`media/${mediaId}/info/`);
}

export async function fetchMediaInfoByApi(headersAndBody: RequestHeadersAndBody) {
	const mediaIdEith = getCurrentMediaID();
	if (isLeft(mediaIdEith)) return mediaIdEith;
	const mediaID = mediaIdEith.right;
	const { headers } = headersAndBody;

	const response = await fetch(
		makeMediaFetchUrl(mediaID),
		{ credentials: "include", headers }
	);
	return right(await response.json() as object);
}


export async function fetchMediaInfoWithCurrentHeaders(){
	const headersAndBodyEith = getRequestHeadersAndBody();
	if (isLeft(headersAndBodyEith)) return headersAndBodyEith;
	const headersAndBody = headersAndBodyEith.right;

	let mediaInfoByApi = await fetchMediaInfoByApi(headersAndBody);
	if (isRight(mediaInfoByApi)) return mediaInfoByApi;


	// api call with media id did not work, try graphql next ...
	const mediaInfoByGraphql = await fetchMediaInfoByGraphql(headersAndBody);
	if (isLeft(mediaInfoByGraphql)) return mediaInfoByGraphql;
	const mediaInfoUnpacked = (mediaInfoByGraphql.right as any).data?.xdt_api__v1__media__shortcode__web_info;
	if (mediaInfoUnpacked === undefined){
		return left({
			message: "`response.data.xdt_api__v1__media__shortcode__web_info` is not defined",
			response: mediaInfoByGraphql.right
		});
	}

	return right(mediaInfoUnpacked);
}