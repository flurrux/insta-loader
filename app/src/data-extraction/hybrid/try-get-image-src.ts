import { getCurrentCarouselIndexWithListAndChild } from "../directly-in-browser/carousel/carousel-index";
import { queryMediaAndGetSrc } from "../directly-in-browser/media-and-src/query-media-and-get-src";
import { queryMediaElement } from "../directly-in-browser/media-and-src/query-media-element";
import { getMediaSrc } from "../directly-in-browser/media-and-src/src-from-img-or-video";
import { PostType } from "../from-fetch-response/types";

export function tryGetImageSrc(postType: PostType, postElement: HTMLElement) {
	if (postType === "video") return null;
	if (postType === "image") return queryMediaAndGetSrc(postElement);

	const indexAndList = getCurrentCarouselIndexWithListAndChild(postElement);
	if (!indexAndList) {
		return null;
	}
	const mediaElement = queryMediaElement(indexAndList.child);
	if (!mediaElement) return null;
	if (!(mediaElement instanceof HTMLImageElement)) return null;
	return getMediaSrc(mediaElement);
}