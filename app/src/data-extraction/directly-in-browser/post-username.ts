
export function findUsernameInPost(postElement: HTMLElement): string | null {
	// the following line queries for the first link element in the post,
	// and hopes that it's the username link.
	// this could break very easily!
	const profileLink = (postElement.querySelector("a") as HTMLLinkElement).href;
	const match = /(?<=\.com\/).*(?=\/)/.exec(profileLink);
	if (!match) return null;
	return match[0];
};