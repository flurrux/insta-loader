function defer(millis){
	return new Promise((resolve, reject) => {
		window.setTimeout(resolve, millis);
	});
}

function storyNodeToData(node){
	return {
		thumbnail: node.querySelector("img").src,
		name: Array.from(node.querySelectorAll("span")).find(span => span.children.length === 0).innerText,
		relativeTime: node.querySelector("time").innerHTML,
		seen: node.querySelector("canvas").width < 55
	};
}

export function getStoryData(scrollEl){
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
}
