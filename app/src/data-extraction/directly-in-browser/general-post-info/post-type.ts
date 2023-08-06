import { Option, none, some } from "fp-ts/es6/Option";
import { queryMediaElement } from "../media-and-src/query-media-element";

type PostType = "collection" | "video" | "image";

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

export function findTypeOfPost(postElement: HTMLElement): Option<PostType> {
	const mediaElement = queryMediaElement(postElement);
	if (!mediaElement) {
		// console.warn("no media-element found");
		// console.log(postElement);
		return none;
	}

	if (postIsCarousel(postElement, mediaElement)){
		return some("collection");
	}

	return some(
		mediaElement.tagName === "VIDEO" ? "video" : "image"
	);
};