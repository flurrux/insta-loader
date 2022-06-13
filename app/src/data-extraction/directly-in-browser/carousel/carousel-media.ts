import { queryMediaElement } from "../media-and-src/query-media-element";
import { getMediaSrc } from "../media-and-src/src-from-img-or-video";
import { getCurrentCarouselIndexWithListAndChild } from "./carousel-index";

export function getCarouselMediaByPostElement(postElement: HTMLElement) {
	const indexAndList = getCurrentCarouselIndexWithListAndChild(postElement);
	if (!indexAndList){
		console.warn("could not find the current index of carousel");
		return null;
	}
	
	const { index, child } = indexAndList;
	const listItem = child;

	const mediaEl = queryMediaElement(listItem as HTMLElement);
	if (!mediaEl){
		console.warn("could not find any media element in carousel at index " + index, listItem);
		return null;
	}

	return getMediaSrc(mediaEl);
};