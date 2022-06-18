
/*
	this module persists the scroll-position of the story-scrollbar.
	normally, when a story is closed, you return to the main-feed and 
	need to scroll down again.
*/


import { findStoryElement } from '../data-extraction/directly-in-browser/stories/main-element';
import { pageType, subscribeToNavigation, getCurrentPageType } from '../insta-navigation-observer';


let scrollElement: Element = null;
let currentScrollTop: number = 0;
let scrollListener = null;

if (getCurrentPageType() === "mainFeed"){
	scrollElement = findStoryElement();
	currentScrollTop = scrollElement.scrollTop;
	scrollListener = e => currentScrollTop = scrollElement.scrollTop;
	scrollElement.addEventListener("scroll", scrollListener);
}


subscribeToNavigation(data => {
	if (data.oldPageType === pageType.mainFeed && data.newPageType === pageType.stories) {
		onStoryStarted();
	}
	else if (data.oldPageType === pageType.stories && data.newPageType === pageType.mainFeed) {
		onMainFeedResumed();
	}
});

const onStoryStarted = () => {
	scrollElement.removeEventListener("scroll", scrollListener);
	scrollElement = null;
};
const onMainFeedResumed = () => {
	waitingForStories = true;
};


let waitingForStories = false;
const onRootMutation = () => {
	if (!waitingForStories) return;

	scrollElement = findStoryElement();
	if (!scrollElement){
		return;
	}
	waitingForStories = false;
	scrollElement.scrollTop = currentScrollTop;
	scrollListener = e => currentScrollTop = scrollElement.scrollTop;
	scrollElement.addEventListener("scroll", scrollListener);
};
const mutationObserver = new MutationObserver(onRootMutation);
mutationObserver.observe(
	document.querySelector("#react-root"),
	{ childList: true, subtree: true }
);