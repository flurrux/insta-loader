
/**
 * on the main feed, use the `enter` key to quickly start downloading the currently visible post.
 */

import { findCurrentPost } from "./navigation-by-keys/find-current-post";

export const downloadKey = "Enter";

export function requestDownloadByButton(downloadButton: HTMLElement){
	downloadButton.dispatchEvent(new CustomEvent("download-request"));
}

function findDownloadButton(postEl: HTMLElement): HTMLElement | null {
	return postEl.querySelector(".download-button");
}

function downloadCurrentPostMedia(){
	const curPost = findCurrentPost();
	if (!curPost){
		console.warn("download by shortcut: could not find the currently visible post to download");
		return;
	}
	const downloadButton = findDownloadButton(curPost);
	if (downloadButton === null) {
		console.warn("download by shortcut: found the currently visible post, but there seems to be no download button. are you sure it's there?");
		return;
	}
	requestDownloadByButton(downloadButton);
}

document.addEventListener("keydown", e => {
	if (e.key !== downloadKey) return
	downloadCurrentPostMedia();
})