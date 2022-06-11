import { getCurrentCarouselIndexWithListAndChild } from "./carousel-index";

export function getCurrentCarouselElement(postEl: HTMLElement) {
	return getCurrentCarouselIndexWithListAndChild(postEl)?.child;
}