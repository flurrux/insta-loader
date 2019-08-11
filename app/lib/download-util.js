export const promptDownload = (blob, filename) => {
	const a = document.createElement('a');
	a.download = filename;
	a.href = blob;
	a.click();
};

// Current blob size limit is around 500MB for browsers
export const downloadResource = (url, filename) => {
	
	//let startTime = window.performance.now();

	if (!filename) filename = url.split('\\').pop().split('/').pop();
	fetch(url, {
		headers: new Headers({'Origin': location.origin}),
		mode: 'cors'
	})
	.then(response => response.blob())
	.then(blob => {

		let blobUrl = window.URL.createObjectURL(blob);
		console.log(blobUrl);
		promptDownload(blobUrl, filename);
		
		//let duration = window.performance.now() - startTime;
		//console.log("duration of download prompt: " + duration);
	})
	.catch(e => console.error(e));
};