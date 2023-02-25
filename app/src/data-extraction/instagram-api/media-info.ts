import { isLeft, left, right } from "fp-ts/es6/Either";
import { stringifyRequestBody } from "../../../lib/stringify-request-body";
import { getRequestHeadersAndBody, RequestHeadersAndBody } from "./request-header-collection/foreground-collector";


async function fetchMediaInfo(headersAndBody: RequestHeadersAndBody) {
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

export async function fetchMediaInfoWithCurrentHeaders(){
	const headersAndBodyEith = getRequestHeadersAndBody();
	if (isLeft(headersAndBodyEith)) return headersAndBodyEith;

	const mediaInfoEith = await fetchMediaInfo(headersAndBodyEith.right);
	if (isLeft(mediaInfoEith)) return mediaInfoEith;

	const mediaInfo = mediaInfoEith.right;
	const mediaInfoUnpacked = (mediaInfoEith.right as any )?.data?.xdt_api__v1__media__shortcode__web_info;
	if (mediaInfoUnpacked === undefined){
		return left({
			message: "`response.data.xdt_api__v1__media__shortcode__web_info` is not defined",
			response: mediaInfo
		});
	}

	return right(mediaInfoUnpacked);
}