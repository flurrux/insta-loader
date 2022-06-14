import { getFirstMatchOrNull } from "../../../../lib/first-regex-match-or-null";

function getGrandParent(element: HTMLElement) {
	const parent = element.parentElement;
	if (!parent) return null;
	const grandParent = parent.parentElement;
	if (!grandParent) return null;
	return grandParent;
}

export type IndexAndChild = {
	index: number,
	child: HTMLElement
}

function getCarouselIndexByItemWidthAndStyle(itemWidth: number, item: HTMLElement): number | null {
	// `list.children` does not contain all of the carousels images.  
	// only 3 images are loaded at any given time and others are loaded on demand. so we cannot use `i` as the items index!
	// but, the absolute translation of the list items indicates its actual index.
	const translationX = getFirstMatchOrNull(
		/(?<=translateX\()[\d\.]*(?=px)/.exec(
			item.style.transform
		)
	);
	if (!translationX) return null;
	return Math.round(parseFloat(translationX) / itemWidth);
}

export function getCurrentCarouselIndexAndChildByList(list: HTMLUListElement): IndexAndChild | null {
	
	const positionReferenceElement = getGrandParent(list);
	if (!positionReferenceElement) return null;
	const visibleX = positionReferenceElement.getBoundingClientRect().x;

	// the actual first item at index 0 is some kind of marker with width 1
	const startIndex = 1;

	const firstItem = list.children[startIndex];
	const listItemWidth = parseFloat(
		getComputedStyle(firstItem).getPropertyValue("width")
	);

	for (let i = startIndex; i < list.children.length; i++) {
		const listItem = list.children[i] as HTMLElement;
		const curItemX = listItem.getBoundingClientRect().x;
		// the currently visible item should be almost exactly at `visibleX`
		// to give some leeway, we check for proximity by half of the items width
		if (Math.abs(visibleX - curItemX) > listItemWidth / 2) continue;

		const index = getCarouselIndexByItemWidthAndStyle(
			listItemWidth, listItem
		);
		if (index === null) continue;

		return {
			index,
			child: listItem as HTMLElement
		}
	}
	return null;
}

export function getCurrentCarouselIndexWithListAndChild(postEl: HTMLElement) {
	const list = postEl.querySelector("ul");
	if (!list) return null;
	const indexAndChild = getCurrentCarouselIndexAndChildByList(list);
	if (!indexAndChild) return null;
	return { list, ...indexAndChild }
}