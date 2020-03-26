

export const getHighestQualityImageSrc = (media: HTMLImageElement) => {
	let srcset = media.srcset;
	let highQualSrc = srcset[srcset.length - 1].src;
	//highQualSrc = highQualSrc.substring(0, highQualSrc.indexOf(".jpg") + 4);
	return highQualSrc;
};