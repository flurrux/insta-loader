const defer = (millis: number) => {
	return new Promise((resolve, reject) => {
		window.setTimeout(resolve, millis);
	});
};

const findUsernameOfStory = (node: HTMLElement) => {
	return Array.from(
		node.querySelectorAll("span")
	).find(span => span.children.length === 0).innerText;
};

export const storyNodeToData = (node: HTMLElement) => {
	return {
		thumbnail: node.querySelector("img").src,
		name: findUsernameOfStory(node),
		relativeTime: node.querySelector("time").innerHTML,
		seen: node.querySelector("canvas").width < 55
	};
};

export const getStoryData = (scrollEl: HTMLElement) => {
	return new Promise((resolve, reject) => {
		//const scrollEl = null;
		const storyContainer = scrollEl.children[0];
		const stories = [];
		const storyElementHeight = 52;
		const scrollDeltaCount = 5;
	
		const childrenChangeObserver = new MutationObserver(async (mutations) => {
			const addedNodes = mutations.map(mutation => Array.from(mutation.addedNodes)).flat();
			stories.push(...addedNodes.map(storyNodeToData));
			const scrollBottom = scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.offsetHeight);
			if (Math.abs(scrollBottom) < storyElementHeight / 2){
				childrenChangeObserver.disconnect();
				resolve(stories);
				return;
			}
			scrollEl.scrollBy(0, addedNodes.length * storyElementHeight);
		});
		childrenChangeObserver.observe(storyContainer, { childList: true });
	
		//start at top
		scrollEl.scrollTop = 0;
		stories.push(...Array.from(storyContainer.children).map(storyNodeToData));
		scrollEl.scrollBy(0, scrollDeltaCount * storyElementHeight);
	});
};

export const findStoryElement = (): HTMLElement => {
	const parent = document.body;
	const firstCanvas = parent.querySelector("button canvas");
	if (!firstCanvas) {
		return;
	}
	let currentChild = firstCanvas.parentElement;
	for (let a = 0; a < 10000; a++) {
		const currentParent = currentChild.parentElement;
		if (!currentParent) {
			return;
		}
		if (currentParent.offsetHeight - currentChild.offsetHeight < 0) {
			return currentParent;
		}
		currentChild = currentParent;
	}
	console.warn("either something went wrong or the dom is very large");
};