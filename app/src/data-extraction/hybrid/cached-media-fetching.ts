import { isLeft, right } from "fp-ts/es6/Either";
import { getCurrentPageType, isSinglePostType } from "../../insta-navigation-observer";
import { getHrefOfPost } from "../directly-in-browser/post-href";
import { findTypeOfPost } from "../directly-in-browser/post-type";
import { findUsernameInPost } from "../directly-in-browser/post-username";
import { findMediaEntryByIndicatorDots } from "../directly-in-browser/carousel/indicator-dots";
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
				console.error("could not find type of post", postElement);
				return;
			}
		}

		// if this current post or carousel item is an image, then we can quickly find its source
		const imageSrcData = tryGetImageSrc(currentPostType, postElement);
		if (imageSrcData) {
			const usernameEith = findUsernameInPost(postElement);
			if (isLeft(usernameEith)) {
				console.warn(usernameEith);
				return;
			}

			return {
				username: usernameEith.right,
				...imageSrcData
			}
		}

		if (!isSinglePostType(getCurrentPageType())){
			console.warn("please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported.");
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
		const videoOrImgInfo = currentPostType === "collection" ? findMediaEntryByIndicatorDots(mediaArray, postElement) : right(mediaArray[0]);
		if (isLeft(videoOrImgInfo)) {
			console.error(videoOrImgInfo.left);
			return;
		}
		return { username, ...videoOrImgInfo.right }
	}
};