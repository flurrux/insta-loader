
function findMainFeedPostsContainer() {
	return document.querySelector("article")?.parentElement;
}

export function findMainFeedPosts(): HTMLElement[] {
	const mainPostContainer = findMainFeedPostsContainer();
	if (!mainPostContainer) return [];
	return Array.from(mainPostContainer.children) as HTMLElement[]
}