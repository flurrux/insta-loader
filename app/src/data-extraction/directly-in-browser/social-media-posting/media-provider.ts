import { Option, fromNullable, isNone, none } from "fp-ts/es6/Option";
import { PostType } from "../../from-fetch-response/types";
import { SingleMediaInfo } from "../../media-types";
import { findTypeOfPost } from "../post-type";
import { tryGetImageSrc } from "../../hybrid/try-get-image-src";
import { findUsernameInPost } from "../post-username";
import { getCurrentPageType, isSinglePostType } from "../../../insta-navigation-observer";
import { makeVideoIndexObserver } from "./carousel-video-index";
import { SocialMediaPosting } from "./types";
import { findSocialMediaPostingInDom } from "./find-in-dom";
import { isLeft } from "fp-ts/es6/Either";

// make a function that lazily extracts media from this post.
// if it's an image, it will query the image source.
// if it's a video, it will use `SocialMediaPosting` taken
// from a certain script element in the DOM.
// for carousels, it is also necessary to keep track of the
// current video index, because videos and images are stored
// in separate arrays.

// granted, it is not very pretty! 
// i have basically copy pasted this code from another place 
// when i was still doing fetches.
// for fetches, it was necessary to cache as many values as possible.
// i should definitely rewrite this function and split it
// into multiple cases (image, single video, carousel, ...).

export function makeSocialMediaPostingExtractor(postElement: HTMLElement){
	
	// videoIndex is not needed if this is an image,
	// but since everything is done lazily, we need
	// to keep track of the video index if it's a carousel,
	// to have it ready when the download button is pressed.
	const getVideoIndex = makeVideoIndexObserver(postElement);

	// cached values
	let socialMediaPosting: Option<SocialMediaPosting> = none;
	let currentPostType: Option<PostType> = none;

	return async (): Promise<SingleMediaInfo | undefined> => {

		// <post type> ------------------------

		if (isNone(currentPostType)) {
			currentPostType = fromNullable(findTypeOfPost(postElement));
		}

		// check again if postType is some
		if (isNone(currentPostType)) {
			console.error("could not find type of post", postElement);
			return;
		}

		const postType = currentPostType.value;

		// </post type> ------------------------



		// if this current post or carousel item is an image, 
		// then we can quickly find its source
		const imageSrcData = tryGetImageSrc(postType, postElement);
		if (imageSrcData) {
			const usernameEith = findUsernameInPost(postElement);
			if (isLeft(usernameEith)){
				console.warn(usernameEith.left);
				return;
			}

			return {
				username: usernameEith.right,
				...imageSrcData
			}
		}

		// case: single video or carousel video on mainfeed
		if (!isSinglePostType(getCurrentPageType())) {
			console.warn("please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported.");
			return;
		}


		// case: single- or carousel-video on post-page
		
		// <social media posting> -----------------

		if (isNone(socialMediaPosting)) {
			socialMediaPosting = findSocialMediaPostingInDom();
		}

		if (isNone(socialMediaPosting)) {
			console.error("could not find social media posting in DOM");
			return;
		}

		const mediaPost = socialMediaPosting.value;
		const videoItems = mediaPost.video;
		const username = mediaPost.author.identifier.value;

		// </social media posting> -----------------


		const videoIndex = getVideoIndex();
		if (videoIndex < 0 || videoIndex >= videoItems.length){
			console.warn("video index is out of bounds. somethings wrong!");
			return;
		}

		return {
			type: "video",
			username,
			src: videoItems[videoIndex].contentUrl
		};
	}
};