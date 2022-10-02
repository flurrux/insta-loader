import { isLeft, left, right } from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function";
import { isNone } from "fp-ts/es6/Option";
import { makeRegexFn } from "../../../../lib/first-regex-match-or-null";
import { getCurrentHeadersAsEither } from "../request-header-collection/foreground-collector";

function makeStoriesFetchUrl(reelID: string): string {
	return `https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=highlight%3A${reelID}`
}

export const getCurrentStoryHighlightID = () => pipe(
	location.pathname,
	makeRegexFn(/(?<=\/stories\/highlights\/)\d*/)
)

export async function fetchCurrentStoryHighlight(headers: Record<string, string>, storyHighlightID: string) {
	const response = await fetch(
		makeStoriesFetchUrl(storyHighlightID),
		{ credentials: "include", headers }
	);
	return right(await response.json() as object);
}

export async function fetchCurrentUserStoryHighlightWithCurrentHeaders() {
	const headersEith = getCurrentHeadersAsEither();
	if (isLeft(headersEith)) return headersEith;
	const storyHighlightIdOpt = getCurrentStoryHighlightID();
	if (isNone(storyHighlightIdOpt)){
		return left("could not find the ID of the highlights-story");
	}
	return fetchCurrentStoryHighlight(
		headersEith.right, storyHighlightIdOpt.value
	);
}