import { getHighestQualityFromSrcset } from "../directly-in-browser/srcset-util";
import { getCurrentCarouselElement } from '../directly-in-browser/carousel/carousel-item';
import { ImgInfo, VideoInfo, VideoOrImgInfo } from "./types";
import { queryMediaElement } from "../directly-in-browser/query-media-element";
import { getFirstMatchOrNull } from "../../../lib/first-regex-match-or-null";


/**
 * when fetching media of a carousel-post, we are getting all of the carousel-items at once. but we actually want to get a specific item where the download button was pressed.  
 * the fetched media is an array of items, so the straightforward thing would be to look at the index of the carousel element and then access the array at that index. but there is no guarantee that the array is ordered the same as the carousel items in browser.  
 * therefore, i've resolved to more robust methods like comparing sources of preview images.  
 */


function findMediaEntryByVideo(mediaArray: VideoOrImgInfo[], videoEl: HTMLVideoElement) {
	const poster = videoEl.poster;
	if (poster === "") {
		console.warn("cannot find the position for this collection-element!");
		return null;
	}
	const trimmedPoster = getFirstMatchOrNull(
		/^https:\/\/.*\.jpg/.exec(poster)
	);
	if (!trimmedPoster) return null;

	const mediaIndex = mediaArray.findIndex(
		val => val.previewSrc.includes(trimmedPoster)
	);
	if (mediaIndex < 0) {
		console.warn("poster does not match any previews, therefore cannot find the index for this item");
		console.log(poster, trimmedPoster, mediaArray);
		return null;
	}

	return mediaArray[mediaIndex] as VideoInfo;
}

export function findMediaEntryByImage(imgEl: HTMLImageElement): ImgInfo {
	let highQualiSrc = "";
	const srcset = imgEl.srcset;
	if (srcset) {
		highQualiSrc = getHighestQualityFromSrcset(srcset);
	}
	else {
		highQualiSrc = imgEl.src;
	}
	return {
		type: "image",
		src: highQualiSrc,
		previewSrc: "",
	}
}

export function findMediaEntryByCarousel(mediaArray: VideoOrImgInfo[], postElement: HTMLElement) {
	const collectionElement = getCurrentCarouselElement(postElement);
	if (!collectionElement){
		console.warn("couldn't find carousel element");
		return null;
	}
	const mediaElement = queryMediaElement(collectionElement);
	if (!mediaElement){
		console.warn("couldn't find image or video");
		return null;
	}
	if (mediaElement.matches("video")) {
		return findMediaEntryByVideo(mediaArray, mediaElement as HTMLVideoElement);
	}
	if (mediaElement.matches("img")) {
		return findMediaEntryByImage(mediaElement as HTMLImageElement);
	}
	console.warn("mediaElement does not match video or img");
	return null;
}