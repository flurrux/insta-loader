import { findIndex, lookup as lookupArrayItem, map as mapArray } from "fp-ts/es6/Array";
import { Either, isLeft, left, right } from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function";
import { fold, fromNullable, isNone, map as mapOption } from "fp-ts/es6/Option";


function findStorySection(): Either<string, HTMLElement> {
	return pipe(
		// query all sections on the page
		document.querySelectorAll("section") as NodeListOf<HTMLElement>,
		// convert from NodeList to array
		(arg) => Array.from(arg),
		// calculate the size of each section and bundle it with the section
		mapArray(
			(section) => ({
				section,
				size: section.offsetWidth * section.offsetHeight,
			})
		),
		// sort the sections by their size in descending order
		(items) => {
			items = items.slice();
			items.sort(
				(a, b) => b.size - a.size
			);
			return items;
		},
		// take the section of largest size
		lookupArrayItem(0),
		mapOption(
			({ section }) => section,
		),
		// if the number of sections was zero, then we return an error
		fold(
			() => left(
				"expected to find the story-element in the largest section element on this page, but this query returned null. are you sure you are currently watching a story? if yes, instagram might have changed things up in the DOM. i'm deeply sorry and ashamed."
			),
			(section) => right(section)
		)
	);
}

function findStoryProgressBarsContainer(sectionEl: HTMLElement): Either<string | [string, HTMLElement], HTMLElement> {

	// find the download button
	const downloadButton = sectionEl.querySelector(".download-button") as HTMLElement;

	// find the first ancestor wider than 200 pixels.
	// if the dom is as expected, the first sibling
	// of that element is the progress-bars container.
	const wideAncestorEith = (function(){
		let current: HTMLElement = downloadButton;
		for (let i = 0; i < 20; i++){
			if (current.offsetWidth > 200) return right(current);
			const next = fromNullable(current?.parentElement);
			if (isNone(next)){
				break;
			}
			current = next.value;
		}
		return left("starting from the download button, we attempted to find an ancestor with a width greater than 200 pixels, but had no success.");
	})();

	if (isLeft(wideAncestorEith)) return wideAncestorEith;

	return pipe(
		wideAncestorEith.right,
		(el) => el.parentElement?.firstElementChild as HTMLElement | null | undefined,
		fromNullable,
		fold(
			() => left(
				"found an ancestor of the download button with the expected width, but not the expected DOM structure"
			),
			right
		)
	);
}

function isProgressBarUnfinished(progressBar: HTMLElement): boolean {
	return progressBar.childElementCount > 0;
}

export function findCurrentStoryIndex(){
	const storySection = findStorySection();
	if (isLeft(storySection)) return storySection;
	const progressBarsContainer = findStoryProgressBarsContainer(storySection.right);
	if (isLeft(progressBarsContainer)) return progressBarsContainer;
	const storyIndex = pipe(
		progressBarsContainer.right.children,
		Array.from,
		findIndex(isProgressBarUnfinished)
	);
	if (isNone(storyIndex)){
		return left(
			`trying to find the current story-index by looking for the first progress-bar that has not finished. but it appears that every single progress-bar has completed.`
		)
	}
	return right(storyIndex.value);
}