
import getStoryElement from './get-story-element.js';
import { pageType, subscribeToNavigation } from './insta-navigation-observer.js';


subscribeToNavigation(data => {
	if (data.oldPageType === pageType.mainFeed && data.newPageType === pageType.stories){
		onStoryStarted();
	}
	else if (data.oldPageType === pageType.stories && data.newPageType === pageType.mainFeed){
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

//init
let scrollElement = getStoryElement();
let currentScrollTop = scrollElement.scrollTop;
let scrollListener = e => currentScrollTop = scrollElement.scrollTop;
scrollElement.addEventListener("scroll", scrollListener);


let waitingForStories = false;
const onRootMutation = () => {
	if (!waitingForStories){
		return;
	}
	scrollElement = getStoryElement();
	if (!scrollElement){
		return;
	}
	waitingForStories = false;
	scrollElement.scrollTop = currentScrollTop;
	scrollListener = e => currentScrollTop = scrollElement.scrollTop;
	scrollElement.addEventListener("scroll", scrollListener);
};
(new MutationObserver(onRootMutation)).observe(document.querySelector("#react-root"), { childList: true, subtree: true })