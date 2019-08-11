
//missing:
//tagFeed
//savedFeed
export const pageType = {
	mainFeed: "mainFeed",
	post: "post",
	personFeed: "personFeed",
	stories: "stories"
};
export const getCurrentPageType = () => {
	let href = window.location.href;
	if (href.endsWith("instagram.com/") || href.includes(".com/?")) {
		return pageType.mainFeed;
	}
	else if (href.includes("/p/")) {
		return pageType.post;
	}
	else if (href.includes("/stories/")) {
		return pageType.stories;
	}
	else {
		return pageType.personFeed;
	}
};


const onNavigation = [];
export const subscribeToNavigation = callback => onNavigation.push(callback);
{
	const invokeViewModeChangeListener = (data) => onNavigation.forEach(callback => callback({ ...data }));

	//main feed || stories || other
	let currentHref = window.location.href;
	let currentPageType = getCurrentPageType();
	const reactRoot = document.querySelector("#react-root");
	const onRootMutation = () => {
		const newHref = window.location.href;
		if (newHref === currentHref) {
			return;
		}
		const oldHref = currentHref;
		const oldPageType = currentPageType;
		currentHref = newHref;
		currentPageType = getCurrentPageType();
		const naviData = {
			oldHref, newHref,
			oldPageType, newPageType: currentPageType
		};
		invokeViewModeChangeListener(naviData);
	};
	(new MutationObserver(onRootMutation)).observe(reactRoot, { childList: true, subtree: true })
}