import { isLeft, left, right } from "fp-ts/es6/Either";
import { Option, isNone, none } from "fp-ts/es6/Option";
import { getCurrentPageType, isSinglePostType } from "../../../insta-navigation-observer";
import { MediaFetchFn } from "../../../media-fetch-fn";
import { PostType } from "../../from-fetch-response/types";
import { findTypeOfPost } from "../general-post-info/post-type";
import { findUsernameInPost } from "../general-post-info/post-username";
import { tryGetImageSrc } from "../try-get-image-src";
import { makeVideoIndexObserver } from "./carousel-video-index";
import { findSocialMediaPostingInDom } from "./find-in-dom";
import { SocialMediaPosting } from "./types";

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

export function makeSocialMediaPostingExtractor(postElement: HTMLElement): MediaFetchFn {

	// videoIndex is not needed if this is an image,
	// but since everything is done lazily, we need
	// to keep track of the video index if it's a carousel,
	// to have it ready when the download button is pressed.
	const getVideoIndex = makeVideoIndexObserver(postElement);

	// cached values
	let socialMediaPosting: Option<SocialMediaPosting> = none;
	let currentPostType: Option<PostType> = none;

	return async () => {

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



		// if this current post or carousel item is an image, 
		// then we can quickly find its source
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


		// case: single- or carousel-video on post-page

		if (isNone(socialMediaPosting)) {
			socialMediaPosting = findSocialMediaPostingInDom();
		}

		if (isNone(socialMediaPosting)) {
			return left("couldn't find any social-media posting in the DOM");
		}

		const mediaPost = socialMediaPosting.value;
		const videoItems = mediaPost.video;
		const { author } = mediaPost;
		const username = author.identifier?.value ?? author.alternateName;

		const videoIndex = getVideoIndex();
		if (videoIndex < 0 || videoIndex >= videoItems.length) {
			return left("video index is out of bounds. i'm as surprised as you are.");
		}

		return right({
			type: "video",
			username,
			src: videoItems[videoIndex].contentUrl
		});
	}
};