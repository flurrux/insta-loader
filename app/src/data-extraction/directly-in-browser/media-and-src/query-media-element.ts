import { pipe } from "fp-ts/es6/function";
import { VideoOrImageElement } from "../../media-types";


function queryLargestImage(parent: HTMLElement){
	return pipe(
		parent.querySelectorAll("img"),
		Array.from,
		(array: HTMLImageElement[]) => array.find( img => img.naturalWidth > 400 )
	)
};

export function queryMediaElement(parent: HTMLElement){
	const videoOrImgWithSrcSet = parent.querySelector("video, img[srcset]") as (VideoOrImageElement | null);
	if (videoOrImgWithSrcSet) return videoOrImgWithSrcSet;
	return queryLargestImage(parent);
};