import { observeCarouselIndex } from "../../../carousel-index-observer";
import { queryMediaElement } from "../media-and-src/query-media-element";
import { waitForElementExistence } from "../../../../lib/await-element";
import { Lazy } from "fp-ts/es6/function";

// the object `SocialMediaPosting` contains videos and images of a carousel,
// but they are in seperate arrays.
// how do we get the correct video at a given carousel index?
// it appears that the order of the videos is the same as their order in the carousel.

// example:
// carousel: [ image1, image2, video1, image3, video2, video3, image4, video4 ]
// SocialMediaPosting.video: [ video1, video2 , video3, video4 ]
// SocialMediaPosting.image: [ image1, image2 , image3, image4 ]

// so if we are at index 4 in the carousel which is item `video2`, 
// how do we know that it is the second video?
// the only idea i have so far is to keep track of how many videos we have
// scrolled past in the carousel.
// this module provides an observer for the video index.
// be cautious! it may not be very robust!
// always doublecheck your downloads!


export function makeVideoIndexObserver(postElement: HTMLElement): Lazy<number> {
	
	let videoIndex = 0;
	
	(async function(){
		const carouselElement = await waitForElementExistence(100, 5, postElement, "ul");
	
		let videoIndexInitialized = false;
		let isCurrentlyVideo = false;
		let previousIndex = 0;
		
		observeCarouselIndex(
			carouselElement,
			({ child, index }) => {
				const mediaElement = queryMediaElement(child);
				if (!mediaElement) return;
	
				const isVideoElement = mediaElement.matches("video");
	
				if (!videoIndexInitialized) {
					isCurrentlyVideo = isVideoElement;
					videoIndex = isCurrentlyVideo ? 0 : -1;
					videoIndexInitialized = true;
				}
				else {
					if (index > previousIndex) {
						const isVideoNext = isVideoElement;
						videoIndex += isVideoNext ? 1 : 0;
					}
					else if (index < previousIndex) {
						const wasVideoPrevious = isCurrentlyVideo;
						videoIndex += wasVideoPrevious ? -1 : 0;
					}
					isCurrentlyVideo = isVideoElement;
				}
				previousIndex = index;
			}
		);
	})();

	return () => videoIndex;
}