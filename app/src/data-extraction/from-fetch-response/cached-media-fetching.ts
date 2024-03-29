import { Either, isLeft, right } from "fp-ts/es6/Either";
import { getCurrentCarouselIndexWithListAndChild } from "../directly-in-browser/carousel/carousel-index";
import { findMediaEntryByIndicatorDots } from "../directly-in-browser/carousel/indicator-dots";
import { queryMediaAndGetSrc } from "../directly-in-browser/media-and-src/query-media-and-get-src";
import { queryMediaElement } from "../directly-in-browser/media-and-src/query-media-element";
import { getMediaSrc } from "../directly-in-browser/media-and-src/src-from-img-or-video";
import { getHrefOfPost } from "../directly-in-browser/general-post-info/post-href";
import { findTypeOfPost } from "../directly-in-browser/general-post-info/post-type";
import { findUsernameInPost } from "../directly-in-browser/general-post-info/post-username";
import { MediaInfo, PostType, SingleMediaInfo } from "./types";
import { toNullable } from "fp-ts/es6/Option";


function tryGetImageSrc(postType: PostType, postElement: HTMLElement){
	if (postType === "video") return null;
	if (postType === "image") return queryMediaAndGetSrc(postElement);
	
	const indexAndList = getCurrentCarouselIndexWithListAndChild(postElement);
	if (!indexAndList) {
		console.warn("could not find the current index of carousel");
		return null;
	}
	const mediaElement = queryMediaElement(indexAndList.child);
	if (!mediaElement) return null;
	if (!(mediaElement instanceof HTMLImageElement)) return null;
	return getMediaSrc(mediaElement);
}


type FetchFunc = (url: string) => Promise<Either<unknown, MediaInfo>>;

export const createMediaFetcherBySrcElementAndFetchFunc = (fetchFunc: FetchFunc) => (postElement: HTMLElement) => {
	let currentMediaInfo: (MediaInfo | null) = null;
	let currentPostType: (PostType | null) = null;
	
	// the following function may be called several times, for example from carousel elements. the fetch reponse for a carousel element contains all the sources for each carousel item. we don't have to fetch again if another item from the same carousel is downloaded next.  
	
	return async (): Promise<SingleMediaInfo | undefined> => {
		if (!currentPostType) {
			currentPostType = toNullable(findTypeOfPost(postElement));
			if (!currentPostType){
				console.warn("could not find type of post");
				return;
			}
		}

		const imageSrcData = tryGetImageSrc(currentPostType, postElement);
		if (imageSrcData){
			const usernameEith = findUsernameInPost(postElement);
			if (isLeft(usernameEith)){
				console.warn(usernameEith);
				return;
			}
			return {
				username: usernameEith.right, 
				...imageSrcData
			}
		}

		if (!currentMediaInfo) {
			const postHref = getHrefOfPost(postElement);
			if (!postHref){
				console.warn("could not find href of post");
				return;
			}

			const fetchResult = await fetchFunc(postHref);
			if (isLeft(fetchResult)){
				console.warn(fetchResult.left);
				return;
			}
			currentMediaInfo = fetchResult.right;
		}
		const { username, mediaArray } = currentMediaInfo;
		const videoOrImgInfo = currentPostType === "collection" ? findMediaEntryByIndicatorDots(mediaArray, postElement) : right(mediaArray[0]);
		if (isLeft(videoOrImgInfo)){
			console.error(videoOrImgInfo.left);
			return;
		}
		return { username, ...videoOrImgInfo.right }
	}
};

// export const createMediaFetcherBySrcElement = createMediaFetcherBySrcElementAndFetchFunc(fetchMediaInfo);
