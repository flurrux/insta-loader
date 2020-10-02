
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

function findPostContainer(): HTMLDivElement {
	return document.querySelector("article").parentElement as HTMLDivElement
}
function getPosts(): HTMLElement[] {
	return Array.from(findPostContainer().children) as HTMLElement[]
}

function findNextPost(): HTMLElement {
	return getPosts().find(isNextPost)
}
function findPrevPost(): HTMLElement {
	return getPosts().reverse().find(isPrevPost)
}

function scrollToPost(findFunc: () => HTMLElement){
	const postEl = findFunc();
	if (!postEl){
		console.warn("could not find post to scroll to");
		return;
	}
	const scrollDelta = -calculateWindowBottomToDownloadBottomDifference(postEl);
	console.log("target", postEl, "scroll-delta", -scrollDelta);
	const targetScrollTop = window.scrollY + scrollDelta;
	window.scrollTo({
		left: window.scrollX,
		top: targetScrollTop,
		behavior: "smooth"
	});
}

document.addEventListener("keydown", e => {
	//why not "w" and "s" for navigation?
	//pressing "s" saves the current post to your collections
	if (e.key === "e"){
		scrollToPost(findPrevPost);
	}
	else if (e.key === "d"){
		scrollToPost(findNextPost);
	}
});