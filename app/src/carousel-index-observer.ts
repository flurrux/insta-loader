import { tryMultiAndDelayed } from "../lib/multi-try-delayed";
import { getCurrentCarouselIndexAndChildByList, IndexAndChild } from "./data-extraction/directly-in-browser/carousel/carousel-index";


type CarouselIndexChangeCallback = (newIndexAndChild: IndexAndChild) => void;

export function observeCarouselIndex(
	listElement: HTMLUListElement, 
	onIndexChanged: CarouselIndexChangeCallback){

	let currentIndex = -1;
	const updateCurrentIndex = tryMultiAndDelayed(
		() => {
			const indexAndChild = getCurrentCarouselIndexAndChildByList(listElement);
			if (!indexAndChild) {
				console.warn("could not find index and child of carousel!");
				return;
			}
			if (indexAndChild.index === currentIndex) return;
			currentIndex = indexAndChild.index;
			onIndexChanged(indexAndChild);
		},
		100
	);

	const observer = new MutationObserver(updateCurrentIndex);
	observer.observe(listElement, { childList: true, subtree: true });
	updateCurrentIndex();
}