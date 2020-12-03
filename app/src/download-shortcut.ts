import { findMainFeedPosts } from "./insta-info-util";

export const downloadKey = "f";

export function requestDownloadByButton(downloadButton: HTMLElement){
	downloadButton.dispatchEvent(new CustomEvent("download-request"));
}


function calculatePostDistanceToViewport(postEl: HTMLElement): number {
	const rect = postEl.getBoundingClientRect();
	const centerY = (rect.top + rect.bottom) / 2;
	return Math.abs(centerY - window.innerHeight / 2);
}

function findCurrentPost(): HTMLElement {
	const posts = findMainFeedPosts();
	const closestPostData: [number, HTMLElement] = posts.reduce(
		(acc: [number, HTMLElement], postEl: HTMLElement) => {
			const dist = calculatePostDistanceToViewport(postEl);
			return dist < acc[0] ? [dist, postEl] : acc
		},
		[Infinity, null]
	);
	return closestPostData[1];
}

function findDownloadButton(postEl: HTMLElement): HTMLElement {
	return postEl.querySelector(".download-button");
}
function downloadCurrentPostMedia(){
	const curPost = findCurrentPost();
	if (!curPost){
		console.warn("could not find current post");
		return;
	}
	const downloadButton = findDownloadButton(curPost);
	if (!downloadButton) {
		console.warn("could not find download-button");
		return;
	}
	requestDownloadByButton(downloadButton);
}

document.addEventListener("keydown", e => {
	if (e.key === downloadKey){
		downloadCurrentPostMedia();
	}
})