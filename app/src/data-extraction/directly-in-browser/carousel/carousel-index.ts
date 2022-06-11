
function getGrandParent(element: HTMLElement) {
	const parent = element.parentElement;
	if (!parent) return null;
	const grandParent = parent.parentElement;
	if (!grandParent) return null;
	return grandParent;
}

type IndexAndChild = {
	index: number,
	child: HTMLElement
}

export function getCurrentCarouselIndexAndChildByList(list: HTMLUListElement): IndexAndChild | null {
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
			return {
				index: i - 1,
				child: listItem as HTMLElement
			}
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