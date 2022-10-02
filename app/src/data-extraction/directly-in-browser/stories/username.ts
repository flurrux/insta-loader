import { findFirstMap } from 'fp-ts/es6/Array';
import { Either, left, fromNullable as fromNullableEith, right } from 'fp-ts/es6/Either';
import { flow, pipe } from 'fp-ts/es6/function';
import { fromNullable, isNone } from 'fp-ts/es6/Option';
import { getFirstMatchOrNull } from '../../../../lib/first-regex-match-or-null';


export function getUsernameOfStory() {
	const url = window.location.href;
	if (location.pathname.startsWith("/stories/highlights/")) {
		return findUsernameOnProfilePage();
	}
	return getUsernameByStoryUrl(url);
}

function usernameEitherFromUrl(regex: RegExp, url: string): Either<string, string> {
	return fromNullableEith
		(`could not extract username from url: ${url}`)
		(getFirstMatchOrNull(regex.exec(url)));
}

function findUsernameOnProfilePage() {
	const usernameRegex = /(?<=:\/\/www\.instagram\.com\/).*?(?=\/)/;
	const usernameMatchOpt = pipe(
		'link[href*="://www.instagram.com/"]', 
		query => document.querySelectorAll(query),
		Array.from,
		findFirstMap<HTMLLinkElement, RegExpExecArray>(
			flow(
				(linkEl) => linkEl.href,
				(href) => usernameRegex.exec(href),
				fromNullable
			)
		)
	);
	
	if (isNone(usernameMatchOpt)){
		return left("trying to find a username on the profile page, but there seems to be no link element where we could read off the url.");
	}
	const username = usernameMatchOpt.value[0];
	return right(username);
}

function getUsernameByStoryUrl(storyUrl: string) {
	return usernameEitherFromUrl(
		/(?<=stories\/).*?(?=\/)/, storyUrl
	);
}