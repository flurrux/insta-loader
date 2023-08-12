import { isLeft, left, right } from "fp-ts/es6/Either";
import { getCurrentPageType, isSinglePostType } from "../../insta-navigation-observer";
import { findTypeOfPost } from "../directly-in-browser/general-post-info/post-type";
import { findUsernameInPost } from "../directly-in-browser/general-post-info/post-username";
import { findMediaEntryByIndicatorDots } from "../directly-in-browser/carousel/indicator-dots";
import { MediaInfo, PostType } from "../from-fetch-response/types";
import { tryGetImageSrc } from "../directly-in-browser/try-get-image-src";
import { Option, isNone, none, some, toNullable } from "fp-ts/es6/Option";
import { MediaFetchFn } from "../../media-fetch-fn";
import { tryFindWebInfoInPageScripts } from "../directly-in-browser/shortcode-web-info/shortcode_media_script";
import { getMediaInfoFromDataItem } from "../from-fetch-response/fetch-media-data";

export const makeWebInfoMediaExtractor = (postElement: HTMLElement): MediaFetchFn => {

	let currentMediaInfo: Option<MediaInfo> = none;
	let currentPostType: Option<PostType> = none;

	// the following function may be called several times, for example from carousel elements. the fetch reponse for a carousel element contains all the sources for each carousel item. we don't have to fetch again if another item from the same carousel is downloaded next.  

	return async function(){

		// <post type> ------------------------

		if (isNone(currentPostType)) {
			currentPostType = findTypeOfPost(postElement);
		}

		// check again if postType is some
		if (isNone(currentPostType)) {
			return left([
				"could not find type of post", postElement
			])
		}

		const postType = currentPostType.value;

		// </post type> ------------------------


		// if this current post or carousel item is an image, then we can quickly find its source
		const imageSrcData = tryGetImageSrc(postType, postElement);
		if (imageSrcData) {
			const usernameEith = findUsernameInPost(postElement);
			if (isLeft(usernameEith)) {
				return usernameEith;
			}

			return right({
				username: usernameEith.right,
				...imageSrcData
			})
		}


		// case: single video or carousel video on mainfeed
		if (!isSinglePostType(getCurrentPageType())) {
			return left(
				"please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported."
			)
		}


		// the current media is either a single video or a carousel video item
		if (isNone(currentMediaInfo)) {
			const webInfoEith = tryFindWebInfoInPageScripts();
			if (isLeft(webInfoEith)) {
				return webInfoEith;
			}
			const webInfo = webInfoEith.right;
			const mediaInfoEith = getMediaInfoFromDataItem(webInfo);
			if (isLeft(mediaInfoEith)){
				return mediaInfoEith;
			}

			currentMediaInfo = some(mediaInfoEith.right);
		}

		if (isNone(currentMediaInfo)){
			return left("this fail case should never occur");
		}

		const mediaInfo = currentMediaInfo.value;
		const { mediaArray } = mediaInfo;

		const videoOrImgInfo = (
			postType === "collection"
			? findMediaEntryByIndicatorDots(mediaArray, postElement)
			: right(mediaArray[0])
		);
		
		if (isLeft(videoOrImgInfo)) {
			return videoOrImgInfo.left;
		}

		return right({
			username: mediaInfo.username,
			...videoOrImgInfo.right
		});
	}
};