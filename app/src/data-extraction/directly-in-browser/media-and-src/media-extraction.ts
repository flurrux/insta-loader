import { isLeft } from "fp-ts/es6/Either";
import { getCarouselMediaByPostElement } from "../carousel/carousel-media";
import { findTypeOfPost } from "../general-post-info/post-type";
import { findUsernameInPost } from "../general-post-info/post-username";
import { queryMediaElement } from "./query-media-element";
import { getMediaSrc } from "./src-from-img-or-video";
import { isNone } from "fp-ts/es6/Option";


export function getMediaSrcByPostElement(postElement: HTMLElement){
	const mediaElement = queryMediaElement(postElement);
	if (!mediaElement){
		console.log("could not find any media element in post", postElement);
		return null;
	}
	return getMediaSrc(mediaElement);
}


export function getMediaSrcByHtml(postElement: HTMLElement){
	const usernameEith = findUsernameInPost(postElement);
	if (isLeft(usernameEith)){
		console.warn(usernameEith.left);
		return null;
	}
	const username = usernameEith.right;
	
	const postTypeOpt = findTypeOfPost(postElement);
	if (isNone(postTypeOpt)){
		console.warn("could not find type of post");
		return null;
	}
	const postType = postTypeOpt.value;

	const srcData = postType === "collection" ? getCarouselMediaByPostElement(postElement) : getMediaSrcByPostElement(postElement);
	
	if (!srcData){
		console.warn("could not find media-src of post");
		return null;
	}

	return { username, ...srcData };
};