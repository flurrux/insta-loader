import { Either, left, right } from "fp-ts/es6/Either";

export function findUsernameInPost(postElement: HTMLElement): Either<any, string> {
	// it seems that the avatar of the poster and the commenters all have
	// an alt attribute like 'mike's profile picture'.
	// moreover, the first such avatar in the DOM appears to be the authors.
	// we can obtain this alt and the first word should be the authors username.
	const profilePictureImg = postElement.querySelector('img[alt*="profile picture"]');
	if (!profilePictureImg){
		return left(["could not find the authors username in this post", postElement]);
	}

	const alt = profilePictureImg.getAttribute("alt") as string;
	const username = alt.replace("'s profile picture", "");

	return right(username);
};