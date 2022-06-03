import { getCarouselMediaByPostElement } from "./carousel/carousel-media";
import { findTypeOfPost } from "./post-type";
import { findUsernameInPost } from "./post-username";
import { queryMediaElement } from "./query-media-element";
import { getMediaSrc } from "./src-from-img-or-video";


function getMediaSrcByPostElement(postElement: HTMLElement){
	const mediaElement = queryMediaElement(postElement);
	if (!mediaElement){
		console.log("could not find any media element in post", postElement);
		return null;
	}
	return getMediaSrc(mediaElement);
}


export function getMediaSrcByHtml(postElement: HTMLElement){
	const username = findUsernameInPost(postElement);
	if (!username){
		console.warn("could not username from post");
		return null;
	}
	const postType = findTypeOfPost(postElement);
	if (!postType){
		console.warn("could not find type of post");
		return null;
	}

	const srcData = postType === "carousel" ? getCarouselMediaByPostElement(postElement) : getMediaSrcByPostElement(postElement);
	
	if (!srcData){
		console.warn("could not find media-src of post");
		return null;
	}

	return { username, ...srcData };
};