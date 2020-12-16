import { findCurrentPost, findStoryElement } from "./insta-info-util";
import { getCurrentPageType } from "./insta-navigation-observer";


type NavigationDirection = "left" | "right";
const keyToDirection = {
	"a": "left", "d": "right"
};
const directionToNaviButtonClass = {
	"left": "LeftChevron",
	"right": "RightChevron"
};

function navigate(direction: NavigationDirection){
	const pageType = getCurrentPageType();
	console.log(pageType);
	const parentElement = pageType === "stories" ? document.body : findCurrentPost();
	if (!parentElement){
		console.warn("could not find current-element");
		return;
	}
	const naviClass = directionToNaviButtonClass[direction];
	const naviEl1 = parentElement.querySelector(`[class*="${naviClass}"]`);
	if (!naviEl1){
		console.warn("could not find navigation-element");
		return;
	}
	const naviButton = naviEl1.parentElement;
	naviButton.click();
}

document.addEventListener("keydown", e => {
	const direction = keyToDirection[e.key];
	if (!direction) return;
	navigate(direction);
});