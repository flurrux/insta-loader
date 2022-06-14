import { isRight, left } from "fp-ts/lib/Either";
import { findMediaIdOnPostPage } from "../directly-in-browser/media-id";
import { getHrefOfPost } from "../directly-in-browser/post-href";
import { fetchMediaID } from "../from-fetch-response/media-id";

// this method doesn't work anymore!
// instagram removed the media ID from the DOM entirely!

export async function queryOrFetchMediaId(postElement: HTMLElement) {
	// first try to find the media-ID in the DOM
	const queriedMediaID = findMediaIdOnPostPage();
	if (isRight(queriedMediaID)) return queriedMediaID;

	// media-ID was not found in the DOM. 
	// this could have several reasons, maybe the post is an overlay or we're on the mainfeed.  
	// now try to get a response of the post page and extract it from there.  
	const postHref = getHrefOfPost(postElement);
	if (!postHref) {
		return left("could not find url of post");
	}
	return await fetchMediaID(postHref);
}