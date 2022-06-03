import { getHighestQualityFromSrcset } from "./srcset-util";
import { getFirstMatchOrNull } from '../../../lib/first-regex-match-or-null';

type SourceEl = HTMLSourceElement;

export function getSrcOfStory(storyElement: HTMLElement){
	const img = storyElement.querySelector('img[srcset]') as HTMLImageElement;
	if (img !== null) {
		return getHighestQualityFromSrcset(img.srcset);
	}
	
	const video = storyElement.querySelector("video");
	if (video !== null) {
		// there seems to be several sources that have different file sizes
		// when downloaded. i want to get the biggest file, cuz that's probably
		// where the quality is. after some research i found out the sources use different
		// video codecs for compression.
		// there are 3 "tiers": baseline, main and high and that's what
		// these 3 numbers mean (42, 4D, 64). to get the highest possible level, 
		// we just sort the sources by that tier
		const sources = Array.from(video.querySelectorAll("source"));

		const codecOrder = ["42", "4D", "64"];
		const getOrderOfCodec = (el: SourceEl) => {
			return codecOrder.findIndex(val => el.type.includes(val));
		};
		const sourceSortFunc = (a: SourceEl, b: SourceEl) => getOrderOfCodec(a) - getOrderOfCodec(b);
		sources.sort(sourceSortFunc);

		return sources[sources.length - 1].src;
	}

	return null;
};

function findUsernameOnProfilePage() {
	const metaEl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
	if (!metaEl) return null;
	const pageUrl = metaEl.content;
	const usernameMatch = pageUrl.match(/(?<=\.com\/).*(?=\/)/);
	if (!usernameMatch) return null;
	return usernameMatch[0];
}

export function getUsernameOfStory() {
	const url = window.location.href;
	if (url.startsWith("https://www.instagram.com/stories/highlights/")) {
		// return window._sharedData.entry_data.ProfilePage[0].graphql.user.username;
		return findUsernameOnProfilePage();
	}
	return getUsernameByStoryUrl(url);
}

export function getUsernameByStoryUrl(storyUrl: string){
	return getFirstMatchOrNull(
		/(?<=stories\/).*?(?=\/)/.exec(storyUrl)
	)
}

export function getUsernameByStoryElement(storyElement: HTMLElement){
	return Array.from(storyElement.querySelectorAll("span"))
		.find(span => span.children.length === 0)
		?.innerText;
}

export function findStoryElement(){
	const parent = document.body;
	const firstCanvas = parent.querySelector("button canvas");
	if (!firstCanvas) return;

	let currentChild = firstCanvas.parentElement;
	if (currentChild === null) return;
	// why is typescript not narrowing to type of `currentChild`??

	for (let a = 0; a < 10000; a++) {
		const currentParent = currentChild.parentElement;
		if (!currentParent) {
			return;
		}
		if (currentParent.offsetHeight - currentChild.offsetHeight < 0) {
			return currentParent;
		}
		currentChild = currentParent;
	}
	console.warn("either something went wrong or the dom is very large");
}