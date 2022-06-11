import { Either, isLeft } from "fp-ts/lib/Either";
import { getHrefOfPost } from "../directly-in-browser/post-href";
import { findTypeofPostWithCollectionDetails, PostTypeWithCollectionDetails } from "../directly-in-browser/post-type-with-collection-details";
import { findUsernameInPost } from "../directly-in-browser/post-username";
import { queryMediaElement } from "../directly-in-browser/query-media-element";
import { getMediaSrc } from "../directly-in-browser/src-from-img-or-video";
import { findMediaEntryByCarousel } from "./find-carousel-item";
import { MediaInfo, SingleMediaInfo } from "./types";


function isImagePostOrImageCarouselItem(postType: PostTypeWithCollectionDetails){
	if (postType.type !== "collection"){
		return postType.type === "image";
	}
	return postType.mediaElement instanceof HTMLImageElement;
}


type FetchFunc = (url: string) => Promise<Either<unknown, MediaInfo>>;

export const createMediaFetcherBySrcElementAndFetchFunc = (fetchFunc: FetchFunc) => (postElement: HTMLElement) => {
	let currentMediaInfo: (MediaInfo | null) = null;
	let currentPostType: (PostTypeWithCollectionDetails | null) = null;
	
	// the following function may be called several times, for example from carousel elements. the fetch reponse for a carousel element contains all the sources for each carousel item. we don't have to fetch again if another item from the same carousel is downloaded next.  
	
	return async (): Promise<SingleMediaInfo | undefined> => {
		if (!currentPostType) {
			const currentPostTypeEither = findTypeofPostWithCollectionDetails(postElement);
			if (isLeft(currentPostTypeEither)){
				console.warn(currentPostTypeEither);
				return;
			}
			currentPostType = currentPostTypeEither.right;
		}

		if (isImagePostOrImageCarouselItem(currentPostType)){
			const imageElement = (currentPostType.type === "collection" ? currentPostType.mediaElement : queryMediaElement(postElement)) as HTMLImageElement;
			const username = findUsernameInPost(postElement);
			return {
				username: username as string, 
				...getMediaSrc(imageElement)
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
		const videoOrImgInfo = currentPostType.type === "collection" ? findMediaEntryByCarousel(mediaArray, postElement) : mediaArray[0];
		if (!videoOrImgInfo) {
			console.error("could not find media of the current collection item!");
			return;
		}
		return { username, ...videoOrImgInfo }
	}
};

// export const createMediaFetcherBySrcElement = createMediaFetcherBySrcElementAndFetchFunc(fetchMediaInfo);
