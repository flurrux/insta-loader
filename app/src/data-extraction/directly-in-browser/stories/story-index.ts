import { findIndex } from "fp-ts/es6/Array";
import { Either, fromNullable, isLeft, Left, left, right } from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function"
import { isNone, Option } from "fp-ts/es6/Option";


const findStorySection = () => pipe(
	document.querySelector("section section") as (HTMLElement | null),
	fromNullable(
		"expected to find the story-element in a section inside another section, but this query returned null. are you sure you are currently watching a story? if yes, instagram might have changed things up in the DOM. i'm deeply sorry and ashamed."
	)
);

function validateProgressBar(progressBar: HTMLElement): Either<string, void> {
	for (const child of progressBar.children){
		const { width } = (child as HTMLElement).style;
		if (width.length === 0) continue;
		return right(undefined);
	}
	return left(
		`each progress-bar in a story is expected to have one child that looks like: <div style="width: 76%;"></div>, but there is no child with a width-property in its styles`
	)
}

function findStoryProgressBarsContainer(sectionEl: HTMLElement): Either<string | [string, HTMLElement], HTMLElement>{
	const headerEl = sectionEl.querySelector("header");
	if (!headerEl){
		return left([
			"trying to find the progress-bars in this story but could not find the header-element that was expected to be there. look for yourself:", 
			sectionEl
		])
	}
	// the first child of `headerEl` should contain all progress-bars. 
	const progressBarsContainer = headerEl.firstChild;

	/*
		each child in `progressBarsContainer` is supposed to look like this: 
		```html
		<div class="_ac3n">
			<div class="_ac3o"></div>
			<div class="_ac3p" style="width: 100%;"></div>
		</div>
		```

		the current story-item has a width between 0% and 100%
	*/

	// check if the first child of `progressBarsContainer` matches the described pattern:
	const firstProgressItem = progressBarsContainer?.firstChild;
	if (!firstProgressItem){
		return left([
			"there appears to be not a single progress-bar in this story. it is more likely that the DOM has another shape than expected. the following element was expected to contain all progress-bars of this story", 
			progressBarsContainer as HTMLElement
		])
	}

	// const progressBarValidation = validateProgressBar(firstProgressItem as HTMLElement);
	// if (isLeft(progressBarValidation)) return progressBarValidation;

	return right(progressBarsContainer as HTMLElement);
}

function findProgressBarPercentage(progressBar: HTMLElement): number {
	for (const child of progressBar.children) {
		const { width } = (child as HTMLElement).style;
		if (width.length === 0) continue;
		return parseFloat(width);
	}
	return 0;
}

function isProgressBarUnfinished(progressBar: HTMLElement): boolean {
	return findProgressBarPercentage(progressBar) < 100;
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