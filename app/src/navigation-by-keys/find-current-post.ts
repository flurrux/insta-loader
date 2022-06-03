import { findMainFeedPosts } from "./find-mainfeed-posts";


function calculatePostDistanceToViewport(postEl: HTMLElement): number {
	const rect = postEl.getBoundingClientRect();
	const centerY = (rect.top + rect.bottom) / 2;
	return Math.abs(centerY - window.innerHeight / 2);
}

export function findCurrentPost() {
	const posts = findMainFeedPosts();
	if (posts.length === 0) return null;

	const closestPostData: [number, HTMLElement | null] = posts.reduce(
		(acc: [number, HTMLElement | null], postEl: HTMLElement) => {
			const dist = calculatePostDistanceToViewport(postEl);
			return dist < acc[0] ? [dist, postEl] as [number, HTMLElement] : acc
		},
		[Infinity, null]
	);
	return closestPostData[1];
}