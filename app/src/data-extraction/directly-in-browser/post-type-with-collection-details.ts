import { Either, left, right } from "fp-ts/es6/Either";
import { CollectionDetails, getCollectionDetails } from "./carousel/collection-details";
import { findTypeOfPost } from "./post-type";


export type PostTypeWithCollectionDetails = { type: "video" | "image" } | CollectionDetails;

export function findTypeofPostWithCollectionDetails(postElement: HTMLElement): Either<unknown, PostTypeWithCollectionDetails> {
	const postType = findTypeOfPost(postElement);
	if (!postType){
		return left({
			message: "could not find type of post",
			post: postElement
		})
	}
	
	if (postType !== "collection"){
		return right({ type: postType })
	}

	return getCollectionDetails(postElement);
}