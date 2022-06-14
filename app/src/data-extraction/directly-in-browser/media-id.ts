import { left, right } from "fp-ts/lib/Either";

// this is not working anymore, since instagram removed the media id completely from the dom
export function findMediaIdOnPostPage(){
	const metaElement = document.querySelector("meta[content*='instagram://media?id=']");
	if (!metaElement){
		return left("could not find media-id on this page. are you sure this is a page with a single post?")
	}
	const content = metaElement.getAttribute("content") as string;
	const mediaID = content.replace("instagram://media?id=", "");
	return right(mediaID);
}