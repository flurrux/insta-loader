import { Either, isLeft } from "fp-ts/es6/Either";
import { getCurrentCarouselIndexWithListAndChild } from "../directly-in-browser/carousel/carousel-index";
import { getCarouselMediaByPostElement } from "../directly-in-browser/carousel/carousel-media";
import { getMediaSrcByPostElement } from "../directly-in-browser/media-and-src/media-extraction";
import { getHrefOfPost } from "../directly-in-browser/post-href";
import { findTypeOfPost } from "../directly-in-browser/post-type";
import { findUsernameInPost } from "../directly-in-browser/post-username";
import { queryMediaAndGetSrc } from "../directly-in-browser/media-and-src/query-media-and-get-src";
import { queryMediaElement } from "../directly-in-browser/media-and-src/query-media-element";
import { getMediaSrc } from "../directly-in-browser/media-and-src/src-from-img-or-video";
import { findMediaEntryByCarousel } from "./find-carousel-item";
import { MediaInfo, PostType, SingleMediaInfo } from "./types";


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
			currentPostType = findTypeOfPost(postElement);
			if (!currentPostType){
				console.warn("could not find type of post");
				return;
			}
		}

		const imageSrcData = tryGetImageSrc(currentPostType, postElement);
		if (imageSrcData){
			const username = findUsernameInPost(postElement);
			return {
				username: username as string, 
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
		const videoOrImgInfo = currentPostType === "collection" ? findMediaEntryByCarousel(mediaArray, postElement) : mediaArray[0];
		if (!videoOrImgInfo) {
			console.error("could not find media of the current collection item!");
			return;
		}
		return { username, ...videoOrImgInfo }
	}
};

// export const createMediaFetcherBySrcElement = createMediaFetcherBySrcElementAndFetchFunc(fetchMediaInfo);
