import { fromNullable } from "fp-ts/es6/Either";
import { getFirstMatchOrNull } from "../../../lib/first-regex-match-or-null";

export async function fetchMediaID(postUrl: string){
	const response = await (await fetch(postUrl)).text();
	return fromNullable
		("couldn't find media-id in response")
		(
			getFirstMatchOrNull(
				/(?<="instagram:\/\/media\?id=)\d*(?=")/.exec(response)
			)
		)
}