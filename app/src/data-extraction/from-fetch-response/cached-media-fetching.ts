import { getHrefOfPost } from "../directly-in-browser/post-href";
import { findTypeOfPost } from "../directly-in-browser/post-type";
import { fetchMediaInfo } from "./fetch-media-data";
import { findMediaEntryByCarousel } from "./find-carousel-item";
import { MediaInfo, PostType, SingleMediaInfo } from "./types";

type FetchFunc = (url: string) => Promise<MediaInfo>;

export const createMediaFetcherBySrcElementAndFetchFunc = (fetchFunc: FetchFunc) => (postElement: HTMLElement) => {
	let currentMediaInfo: (MediaInfo | null) = null;
	let currentPostType: (PostType | null) = null;
	
	// the following function may be called several times, for example from carousel elements. the fetch reponse for a carousel element contains all the sources for each carousel item. we don't have to fetch again if another item from the same carousel is downloaded next.  
	
	return async (): Promise<SingleMediaInfo | undefined> => {
		if (!currentPostType) {
			currentPostType = findTypeOfPost(postElement);
			console.log("currnet post type", currentPostType);
		}
		if (!currentMediaInfo) {
			const postHref = getHrefOfPost(postElement);
			if (!postHref) return;
			currentMediaInfo = await fetchFunc(postHref);
		}
		console.log("fetched!", currentPostType);
		const username = currentMediaInfo.username;
		const mediaArray = currentMediaInfo.mediaArray;
		const videoOrImgInfo = currentPostType === "collection" ? findMediaEntryByCarousel(mediaArray, postElement) : mediaArray[0];
		if (!videoOrImgInfo) {
			console.error("could not find media of the current collection item!");
			return;
		}
		return { username, ...videoOrImgInfo }
	}
};

export const createMediaFetcherBySrcElement = createMediaFetcherBySrcElementAndFetchFunc(fetchMediaInfo);
