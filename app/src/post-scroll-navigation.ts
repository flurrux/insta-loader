import { findMainFeedPosts } from "./insta-info-util";

const scrollTolerance = 30;

function calculateWindowBottomToDownloadBottomDifference(postEl: HTMLElement): number {
	const downloadButtonContainer = postEl.querySelector("section");
	const downloadButtonBottom = downloadButtonContainer.getBoundingClientRect().bottom;
	const windowBottom = window.innerHeight;
	return windowBottom - downloadButtonBottom;
}

function isNextPost(postEl: HTMLElement, index: number): boolean {
	return calculateWindowBottomToDownloadBottomDifference(postEl) < -scrollTolerance
}
function isPrevPost(postEl: HTMLElement, index: number): boolean {
	return calculateWindowBottomToDownloadBottomDifference(postEl) > scrollTolerance
}

function findNextPost(): HTMLElement {
	return findMainFeedPosts().find(isNextPost)
}
function findPrevPost(): HTMLElement {
	return findMainFeedPosts().reverse().find(isPrevPost)
}

function scrollToPost(findFunc: () => HTMLElement){
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

const upButton = "w";
const downKey = "s";

document.addEventListener("keydown", e => {
	if (e.key === upButton){
		scrollToPost(findPrevPost);
	}
	else if (e.key === downKey){
		scrollToPost(findNextPost);
	}
});