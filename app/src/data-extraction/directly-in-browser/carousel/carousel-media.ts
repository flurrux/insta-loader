import { queryMediaElement } from "../query-media-element";
import { getMediaSrc } from "../src-from-img-or-video";
import { getCurrentCarouselIndexWithListAndChild } from "./carousel-index";

export function getCarouselMediaByPostElement(postElement: HTMLElement) {
	const indexAndList = getCurrentCarouselIndexWithListAndChild(postElement);
	if (!indexAndList){
		console.warn("could not find the current index of carousel");
		return null;
	}
	
	const { index, list } = indexAndList;
	const listItem = list.children[index + 1];

	const mediaEl = queryMediaElement(listItem as HTMLElement);
	if (!mediaEl){
		console.warn("could not find any media element in carousel at index " + index, listItem);
		return null;
	}

	return getMediaSrc(mediaEl);
};