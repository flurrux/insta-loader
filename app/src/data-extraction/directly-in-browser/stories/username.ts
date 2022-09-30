import { Either, fromNullable, left } from 'fp-ts/es6/Either';
import { getFirstMatchOrNull } from '../../../../lib/first-regex-match-or-null';


export function getUsernameOfStory() {
	const url = window.location.href;
	if (url.startsWith("https://www.instagram.com/stories/highlights/")) {
		return findUsernameOnProfilePage();
	}
	return getUsernameByStoryUrl(url);
}

function usernameEitherFromUrl(regex: RegExp, url: string): Either<string, string> {
	return fromNullable
		(`could not extract username from url: ${url}`)
		(getFirstMatchOrNull(regex.exec(url)));
}

function findUsernameOnProfilePage() {
	const linkEl = document.querySelector('link[href*="://www.instagram.com/"]');
	if (!linkEl){
		return left("trying to find a username on the profile page, but there seems to be no link element where we could read off the url.");
	}
	const url = (linkEl as HTMLLinkElement).href;
	return usernameEitherFromUrl(
		/(?<=:\/\/www\.instagram\.com\/).*?(?=\/)/, url
	);
}

function getUsernameByStoryUrl(storyUrl: string) {
	return usernameEitherFromUrl(
		/(?<=stories\/).*?(?=\/)/, storyUrl
	);
}