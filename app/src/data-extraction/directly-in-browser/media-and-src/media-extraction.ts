import { isLeft } from "fp-ts/es6/Either";
import { getCarouselMediaByPostElement } from "../carousel/carousel-media";
import { findTypeOfPost } from "../post-type";
import { findUsernameInPost } from "../post-username";
import { queryMediaElement } from "./query-media-element";
import { getMediaSrc } from "./src-from-img-or-video";


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
	
	const postType = findTypeOfPost(postElement);
	if (!postType){
		console.warn("could not find type of post");
		return null;
	}

	const srcData = postType === "collection" ? getCarouselMediaByPostElement(postElement) : getMediaSrcByPostElement(postElement);
	
	if (!srcData){
		console.warn("could not find media-src of post");
		return null;
	}

	return { username, ...srcData };
};