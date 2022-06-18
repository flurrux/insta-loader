import { getHighestQualityFromSrcset } from "../media-and-src/srcset-util";

type SourceEl = HTMLSourceElement;

function getVideoSrc(storyElement: HTMLElement) {
	const video = storyElement.querySelector("video");
	if (video === null) return;

	// there seems to be several sources that have different file sizes
	// when downloaded. i want to get the biggest file, cuz that's probably
	// where the quality is. after some research i found out the sources use different
	// video codecs for compression.
	// there are 3 "tiers": baseline, main and high and that's what
	// these 3 numbers mean (42, 4D, 64). to get the highest possible level, 
	// we just sort the sources by that tier
	const sources = Array.from(video.querySelectorAll("source"));

	const codecOrder = ["42", "4D", "64"];
	const getOrderOfCodec = (el: SourceEl) => {
		return codecOrder.findIndex(val => el.type.includes(val));
	};
	const sourceSortFunc = (a: SourceEl, b: SourceEl) => getOrderOfCodec(a) - getOrderOfCodec(b);
	sources.sort(sourceSortFunc);

	return sources[sources.length - 1].src;
}

export function getSrcOfStory(storyElement: HTMLElement) {

	// don't change the order here!
	// the order is important, first query a video THEN if no video was found, query an image.  
	// a video-story will also have an image for preview, so there is an image element in either case!

	const videoSrc = getVideoSrc(storyElement);
	if (videoSrc) return videoSrc;

	const img = storyElement.querySelector('img[srcset]') as HTMLImageElement;
	if (img !== null) {
		return getHighestQualityFromSrcset(img.srcset);
	}

	return null;
};