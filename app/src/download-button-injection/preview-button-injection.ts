// import { MediaWriteInfo, createDiskDownloadButton } from "../download-buttons/disk-download-button";
// import { fetchMediaInfo } from "../data-extraction/insta-info-util";
// import { createElementByHTML } from "../../lib/html-util";

// async function getMediaSrcOfPreviewElement(previewEl: HTMLElement): Promise<MediaWriteInfo> {
// 	const linkElement = previewEl.querySelector("a");
// 	if (linkElement === null) {
// 		throw "link-element not found";
// 	}
// 	let postHref = linkElement.href;

// 	const data = await fetchMediaInfo(postHref);
// 	let src = data.mediaArray[0].src;
// 	let username = data.username;
// 	return { username, src };
// };

// export const injectDownloadButtonsIntoPreview = (previewEl: HTMLElement) => {
// 	const previewOverlay = createElementByHTML(`
// 		<div 
// 			style="
// 				width: 100%;
// 				position: absolute;
// 				left: 0px;
// 				bottom: 0px;
// 				flex-direction: row;
// 			"
// 		>
// 		</div>
// 	`);
// 	const getMediaSrc = () => getMediaSrcOfPreviewElement(previewEl);
// 	const diskDownloadButton = createDiskDownloadButton(getMediaSrc);
// 	Object.assign(diskDownloadButton.style, {
// 		width: "24px",
// 		height: "24px",
// 		padding: "5px"
// 	});
// 	previewOverlay.appendChild(diskDownloadButton);

// 	previewEl.appendChild(previewOverlay);
// };