import { isLeft } from "fp-ts/es6/Either";
import { getCurrentPageType } from "../../insta-navigation-observer";
import { getHrefOfPost } from "../directly-in-browser/post-href";
import { findTypeOfPost } from "../directly-in-browser/post-type";
import { findUsernameInPost } from "../directly-in-browser/post-username";
import { findMediaEntryByCarousel } from "../from-fetch-response/find-carousel-item";
import { MediaInfo, PostType } from "../from-fetch-response/types";
import { SingleMediaInfo } from "../media-types";
import { fetchMediaOnCurrentPageAndExtract } from "./media-of-post";
import { tryGetImageSrc } from "./try-get-image-src";

export const makeLazyMediaExtractor = (postElement: HTMLElement) => {

	let currentMediaInfo: (MediaInfo | null) = null;
	let currentPostType: (PostType | null) = null;

	// the following function may be called several times, for example from carousel elements. the fetch reponse for a carousel element contains all the sources for each carousel item. we don't have to fetch again if another item from the same carousel is downloaded next.  

	return async (): Promise<SingleMediaInfo | undefined> => {
		if (!currentPostType) {
			currentPostType = findTypeOfPost(postElement);
			if (!currentPostType) {
				console.error("could not find type of post");
				return;
			}
		}

		// if this current post or carousel item is an image, then we can quickly find its source
		const imageSrcData = tryGetImageSrc(currentPostType, postElement);
		if (imageSrcData) {
			const username = findUsernameInPost(postElement);
			return {
				username: username as string,
				...imageSrcData
			}
		}

		if (getCurrentPageType() !== "post"){
			console.warn("please open the page of this post in a new tab. downloading videos directly from the mainfeed is not working right now unfortunately. we're working on a fix!");
			return;
		}

		// the current media is either a single video or a carousel video item
		if (!currentMediaInfo) {
			const postHref = getHrefOfPost(postElement);
			if (!postHref) {
				console.error("could not find href of post");
				return;
			}

			const fetchResult = await fetchMediaOnCurrentPageAndExtract();
			if (isLeft(fetchResult)) {
				console.error(fetchResult.left);
				return;
			}
			currentMediaInfo = fetchResult.right;
		}

		const { username, mediaArray } = currentMediaInfo;
		const videoOrImgInfo = currentPostType === "collection" ? findMediaEntryByCarousel(mediaArray, postElement) : mediaArray[0];
		if (!videoOrImgInfo) {
			console.error("could not find media of the current collection item!");
			return;
		}
		return { username, ...videoOrImgInfo }
	}
};