
function getGrandParent(element: HTMLElement) {
	const parent = element.parentElement;
	if (!parent) return null;
	const grandParent = parent.parentElement;
	if (!grandParent) return null;
	return grandParent;
}

export function getCurrentCarouselIndexByList(list: HTMLUListElement): number | null {
	const positionReferenceElement = getGrandParent(list);
	if (!positionReferenceElement) return null;

	// the actual first item at index 0 is some kind of marker with width 1
	const firstItem = list.children[1];
	const listItemWidth = parseFloat(
		getComputedStyle(firstItem).getPropertyValue("width")
	);
	const visibleX = positionReferenceElement.getBoundingClientRect().x;

	for (let i = 1; i < list.children.length; i++) {
		const listItem = list.children[i];
		const curItemX = listItem.getBoundingClientRect().x;
		if (Math.abs(visibleX - curItemX) < listItemWidth / 2) {
			return i - 1;
		}
	}
	return -1;
}

export function getCurrentCarouselIndexAndList(postEl: HTMLElement) {
	const list = postEl.querySelector("ul");
	if (list === null) return null;
	const index = getCurrentCarouselIndexByList(list);
	if (index === null) return null;
	return { list, index }
}