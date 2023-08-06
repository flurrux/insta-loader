
export function getHrefOfPost(postElement: HTMLElement): string | null {
	const linkElements = postElement.querySelectorAll('a[href*="/p/"') as NodeListOf<HTMLLinkElement>;
	if (linkElements.length === 0) return null;
	const href = linkElements[linkElements.length - 1].href;
	const index1 = href.indexOf("/p/");
	if (index1 < 0) return null;
	const startIndex = index1 + 3;
	const endIndex = href.indexOf("/", startIndex);
	if (endIndex < 0) return null;
	return href.substring(0, endIndex + 1);
};