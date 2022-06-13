import { VideoOrImageElement } from "../../media-types";


function queryLargestImage(parent: HTMLElement){
	return Array.from(parent.querySelectorAll("img"))
		.find(img => img.offsetHeight > 400);
};

export function queryMediaElement(parent: HTMLElement){
	const videoOrImgWithSrcSet = parent.querySelector("video, img[srcset]") as (VideoOrImageElement | null);
	if (videoOrImgWithSrcSet) return videoOrImgWithSrcSet;
	return queryLargestImage(parent);
};