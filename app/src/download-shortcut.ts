import { findCurrentPost } from "./insta-info-util";

export const downloadKey = "Enter";

export function requestDownloadByButton(downloadButton: HTMLElement){
	downloadButton.dispatchEvent(new CustomEvent("download-request"));
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