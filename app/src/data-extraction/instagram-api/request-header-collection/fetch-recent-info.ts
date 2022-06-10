import { getRecentMediaInfoRequest } from "./foreground-collector"

export async function fetchMostRecentMediaInfo() {
	const requestData = getRecentMediaInfoRequest();
	console.log(JSON.stringify(requestData));
	if (!requestData){
		throw 'trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.'
	}
	const response = await fetch(
		requestData.url,
		{
			credentials: "include",
			headers: {
				"X-IG-App-ID": "936619743392459",
				"X-IG-WWW-Claim": "hmac.AR2QBIaghoDoJL618hB9QmcT_5fX13SscXD38AD - RuRv9kiJ"
			}
		}
	);
	const responseJson = await response.json();
	console.log(responseJson);
	return responseJson;
}