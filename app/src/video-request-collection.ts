
const urlCollection: string[] = [];

export function getFirstCollectedVideoUrl(): string | null {
	if (urlCollection.length === 0) return null;
	return urlCollection[0];
}

chrome.runtime.onMessage.addListener(
	function (request) {
		const { url } = request;
		if (!url) return;
		if (urlCollection.includes(url)) return;
		urlCollection.push(url);
	}
);