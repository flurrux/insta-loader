import { isNone, none, Option, some } from "fp-ts/es6/Option";
import { findMainFeedPosts } from "./find-mainfeed-posts";

const scrollTolerance = 30;

function calculateWindowBottomToDownloadBottomDifference(postEl: HTMLElement): Option<number> {
	const downloadButtonContainer = postEl.querySelector("section");
	if (downloadButtonContainer === null){
		console.warn(`trying to calculate distance to bottom, cannot find a 'section' element in post`);
		return none;
	}
	const downloadButtonBottom = downloadButtonContainer.getBoundingClientRect().bottom;
	const windowBottom = window.innerHeight;
	return some(windowBottom - downloadButtonBottom);
}

function isNextPost(postEl: HTMLElement): boolean {
	const diffOpt = calculateWindowBottomToDownloadBottomDifference(postEl);
	if (isNone(diffOpt)) return false;
	return diffOpt.value < -scrollTolerance
}
function isPrevPost(postEl: HTMLElement): boolean {
	const diffOpt = calculateWindowBottomToDownloadBottomDifference(postEl);
	if (isNone(diffOpt)) return false;
	return diffOpt.value > scrollTolerance
}

function findNextPost(): HTMLElement | undefined {
	return findMainFeedPosts().find(isNextPost)
}
function findPrevPost(): HTMLElement | undefined {
	return findMainFeedPosts().reverse().find(isPrevPost)
}

type PostFindFunc = () => HTMLElement | undefined;

function scrollToPost(findFunc: PostFindFunc){
	const postEl = findFunc();
	if (!postEl){
		console.warn("could not find post to scroll to");
		return;
	}
	const scrollDelta = -calculateWindowBottomToDownloadBottomDifference(postEl);
	const targetScrollTop = window.scrollY + scrollDelta;
	window.scrollTo({
		left: window.scrollX,
		top: targetScrollTop,
		behavior: "smooth"
	});
}

function initNavigation(){
	
	const navigationKeys = {
		"scroll-up": "w",
		"scroll-down": "s"
	}
	
	document.addEventListener("keydown", e => {
		if (e.key === navigationKeys["scroll-up"]){
			scrollToPost(findPrevPost);
		}
		else if (e.key === navigationKeys["scroll-down"]){
			scrollToPost(findNextPost);
		}
	});
}

initNavigation();