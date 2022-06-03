
export function findUsernameInPost(postElement: HTMLElement): string | null {
	const profileLink = (postElement.querySelector("header a") as HTMLLinkElement).href;
	const match = /(?<=\.com\/).*(?=\/)/.exec(profileLink);
	if (!match) return null;
	return match[0];
};