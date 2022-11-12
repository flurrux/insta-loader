import { Either, isLeft, left, right } from "fp-ts/es6/Either";
import { isNone, none, Option, some } from "fp-ts/es6/Option";
import { VideoOrImgInfo } from "../../from-fetch-response/types";

export function findMediaEntryByIndicatorDots(mediaArray: VideoOrImgInfo[], postElement: HTMLElement) {
	const indicatorDotIndexEith = findIndicatorDotIndex(postElement);
	if (isLeft(indicatorDotIndexEith)) return indicatorDotIndexEith;
	return right(
		mediaArray[indicatorDotIndexEith.right]
	);
}

export function findIndicatorDotIndex(postElement: HTMLElement): Either<any, number> {
	const indicatorDotContainerOpt = findIndicatorDotsContainer(postElement);
	if (isNone(indicatorDotContainerOpt)) {
		return left("attempted to find the indicator dots of a collection, but no luck. instagram might have changed the DOM and the current method of detection doesn't work anymore");
	}
	const indicatorDotContainer = indicatorDotContainerOpt.value;
	const indicatorDots = indicatorDotContainer.children;
	// how to tell if an indicator is active? currently, i see that all indicators have a common class while the active indicator has an extra class. so maybe just look whose className is the longest. 
	let activeIndicatorDotIndex = 0;
	for (let i = 1; i < indicatorDots.length; i++) {
		const indicatorDot = indicatorDots[i];
		if (indicatorDot.className.length <= indicatorDots[activeIndicatorDotIndex].className.length) {
			continue;
		}
		activeIndicatorDotIndex = i;
	}
	return right(activeIndicatorDotIndex);
}

// classNames cannot be trusted when trying to find elements in the DOM. 
// in this case, how would you find the container with multiple horizontally aligned dots?
// this solution simply looks for any element of width > 100 and height between 4 and 10.
// i cannot think of a better detection method than this right now. 
function findIndicatorDotsContainer(parent: Element): Option<Element> {
	const minWidth = 100;
	const maxHeight = 10;
	const minHeight = 4;

	if (!("clientWidth" in parent)) return none;
	const { clientWidth, clientHeight } = parent;
	if (clientWidth > minWidth && clientHeight < maxHeight && clientHeight > minHeight) {
		return some(parent);
	}
	if (!("children" in parent)) return none;
	for (const child of parent.children) {
		const subResult = findIndicatorDotsContainer(child);
		if (isNone(subResult)) continue;
		return subResult;
	}
	return none;
}