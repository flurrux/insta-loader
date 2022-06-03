import { queryMediaElement } from "./query-media-element";

type PostType = "carousel" | "video" | "image";

function postIsCarousel(postElement: HTMLElement, mediaElement: HTMLElement): boolean {
	let ancestorElement = mediaElement;
	for (let i = 0; i < 1000; i++){
		if (ancestorElement.matches("li")) return true;
		if (ancestorElement === postElement) return false;
		const nextAncestorElement = ancestorElement.parentElement;
		if (!nextAncestorElement) return false;
		ancestorElement = nextAncestorElement;
	}
	return false;
}

export function findTypeOfPost(postElement: HTMLElement): PostType | null {
	const mediaElement = queryMediaElement(postElement);
	if (!mediaElement) {
		console.warn("no media-element found");
		console.log(postElement.innerHTML);
		return null;
	}
	if (postIsCarousel(postElement, mediaElement)) return "carousel";
	return mediaElement.tagName === "VIDEO" ? "video" : "image";
};