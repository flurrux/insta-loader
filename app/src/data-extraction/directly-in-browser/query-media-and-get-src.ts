import { queryMediaElement } from "./query-media-element";
import { getMediaSrc } from "./src-from-img-or-video";

export function queryMediaAndGetSrc(postElement: HTMLElement) {
	const mediaElement = queryMediaElement(postElement);
	if (!mediaElement) {
		console.log("could not find any media element in post", postElement);
		return null;
	}
	return getMediaSrc(mediaElement);
}