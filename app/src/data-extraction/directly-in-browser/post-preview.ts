
const queriesAndAttributes = [
	{
		query: "video[poster]",
		previewAttribute: "poster"
	},
	{
		query: "img[srcset]",
		previewAttribute: "src"
	}
];

export function getPreviewSrcOfPost(postElement: HTMLElement): string | null {
	for (const { query, previewAttribute } of queriesAndAttributes){
		const queryMatch = postElement.querySelector(query);
		if (!queryMatch) continue;
		const previewSrc = queryMatch.getAttribute(previewAttribute);
		if (!previewSrc) continue;
		return previewSrc;
	}
	return null;
};