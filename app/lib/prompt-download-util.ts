

export const promptDownload = (blobUrl: string, filename: string) => {
	const a = document.createElement('a');
	a.download = filename;
	a.href = blobUrl;
	a.click();
};

// Current blob size limit is around 500MB for browsers
export const downloadResource = async (url: string, filename: string) => {
	const response = await fetch(url, {
		headers: new Headers({'Origin': location.origin}),
		mode: 'cors'
	});
	const blob = await response.blob();
	const blobUrl = window.URL.createObjectURL(blob);
	promptDownload(blobUrl, filename);
};