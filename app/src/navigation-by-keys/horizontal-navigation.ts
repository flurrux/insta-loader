import { getCurrentPageType } from "../insta-navigation-observer";
import { findCurrentPost } from "./find-current-post";


type NavigationDirection = "left" | "right";

const keyToDirection: Record<string, NavigationDirection> = {
	"a": "left", "d": "right"
};

const directionToNaviButtonClass: Record<NavigationDirection, string> = {
	"left": "LeftChevron",
	"right": "RightChevron"
};

function logNavigationFailWarning(){
	console.warn("you've tried to navigate to the next or previous image/video but we couldn't find the button to click on");
}

function navigate(direction: NavigationDirection){
	const pageType = getCurrentPageType();
	const parentElement = pageType === "stories" ? document.body : findCurrentPost();
	if (!parentElement){
		logNavigationFailWarning();
		return;
	}
	const naviClass = directionToNaviButtonClass[direction];
	const naviEl1 = parentElement.querySelector(`[class*="${naviClass}"]`);
	if (!naviEl1){
		logNavigationFailWarning();
		return;
	}
	const naviButton = naviEl1.parentElement;
	if (!naviButton){
		logNavigationFailWarning();
		return;
	}
	naviButton.click();
}

document.addEventListener("keydown", e => {
	const { key } = e;
	if (!(key in keyToDirection)) return;
	navigate(keyToDirection[key]);
});