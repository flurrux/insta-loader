import { getCurrentCarouselIndexByList } from "./carousel-index";

export function getCurrentCarouselElement(postEl: HTMLElement) {
	const list = postEl.querySelector("ul");
	if (!list) return null;
	const listIndex = getCurrentCarouselIndexByList(list);
	if (listIndex === null) return null;
	return list.children[listIndex + 1] as HTMLElement;
}