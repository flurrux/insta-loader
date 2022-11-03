import { Either, right } from "fp-ts/es6/Either";
import { getCurrentHeadersOrThrow } from "./request-header-collection/foreground-collector";
import { makeApiUrl } from "./url-maker";

function makeUserFetchUrl(userName: string): string {
	// this url takes about half a second to fetch. this api-call is actually for retrieving the users feed, but i found that setting the number of feed-items to 1 is reasonably fast (~600 milliseconds). why not set it to 0? i've tried setting it to 0, but then it fetches like 17 feed items. so the lowest number that works is 1. 
	// i hope to find a faster way of fetching user-data in the future. 
	return makeApiUrl(`feed/user/${userName}/username/?count=1`);
}

export type UserInfo = {
	full_name: string,
	is_private: boolean,
	pk: number,
	username: string,
	profile_pic_url: string
}

export async function fetchUserInfo(headers: Record<string, string>, userName: string): Promise<Either<string, UserInfo>> {
	const response = await fetch(
		makeUserFetchUrl(userName),
		{ credentials: "include", headers }
	);
	const responseObj = await response.json() as object;
	console.log("fetched user-info", responseObj);
	const userObj = responseObj.user as UserInfo;
	return right(userObj);
}

export async function fetchUserInfoWithCurrentHeaders(userName: string) {
	const headers = getCurrentHeadersOrThrow();
	return fetchUserInfo(headers, userName);
}