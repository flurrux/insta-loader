

type InstaPageType = "mainFeed" | "post" | "personFeed" | "stories" | "reel";

//missing:
//tagFeed
//savedFeed
export const pageType: { [key: string]: InstaPageType } = {
	mainFeed: "mainFeed",
	post: "post",
	personFeed: "personFeed",
	stories: "stories"
};
export const getCurrentPageType = (): InstaPageType => {
	let href = window.location.href;
	if (href.endsWith("instagram.com/") || href.includes(".com/?")) {
		return pageType.mainFeed;
	}
	else if (href.includes("/p/")) {
		return pageType.post;
	}
	else if (href.includes("/reel/")){
		return "reel";
	}
	else if (href.includes("/stories/")) {
		return pageType.stories;
	}
	else {
		return pageType.personFeed;
	}
};

interface InstaNavigationChangeData {
	oldHref: string,
	newHref: string,
	oldPageType: InstaPageType,
	newPageType: InstaPageType
};
type InstaNavigationCallback = (data: InstaNavigationChangeData) => void;

const onNavigation: InstaNavigationCallback[] = [];
export const subscribeToNavigation = (callback: InstaNavigationCallback) => {
	onNavigation.push(callback);
};
const invokeViewModeChangeListener = (data: InstaNavigationChangeData) => {
	onNavigation.forEach(callback => callback(data));
};

//main feed || stories || other
let currentHref: string = window.location.href;
let currentPageType: InstaPageType = getCurrentPageType();
const reactRoot: Element = document.querySelector("#react-root");
const onRootMutation = () => {
	const newHref = window.location.href;
	if (newHref === currentHref) {
		return;
	}
	const oldHref = currentHref;
	const oldPageType = currentPageType;
	currentHref = newHref;
	currentPageType = getCurrentPageType();
	const naviData: InstaNavigationChangeData = {
		oldHref, newHref,
		oldPageType, 
		newPageType: currentPageType
	};
	invokeViewModeChangeListener(naviData);
};
(new MutationObserver(onRootMutation)).observe(reactRoot, { childList: true, subtree: true })