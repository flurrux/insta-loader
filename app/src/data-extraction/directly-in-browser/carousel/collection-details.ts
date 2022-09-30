import { Either, left, right } from "fp-ts/es6/Either";
import { getCurrentCarouselIndexWithListAndChild } from "./carousel-index";
import { queryMediaElement } from "../media-and-src/query-media-element";


export type CollectionDetails = {
	type: "collection",
	currentIndex: number,
	mediaElement: HTMLVideoElement | HTMLImageElement
}

export function getCollectionDetails(postElement: HTMLElement): Either<unknown, CollectionDetails> {
	const indexAndList = getCurrentCarouselIndexWithListAndChild(postElement);
	if (!indexAndList) {
		return left({
			message: "could not find index and list of carousel",
			post: postElement
		})
	}
	const { index, child } = indexAndList;
	const mediaElement = queryMediaElement(child);
	if (!mediaElement) {
		return left({
			message: "could not find a media element in carousel child",
			carouselChild: child
		})
	}

	return right({
		type: "collection",
		currentIndex: index,
		mediaElement: mediaElement
	})
}