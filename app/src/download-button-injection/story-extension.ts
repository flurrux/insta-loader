import { isLeft, left, right } from "fp-ts/es6/Either";
import { createElementByHTML, querySelectorAncestor } from "../../lib/html-util";
import { createDiskDownloadButton, DiskDownloadButtonOptions } from "../download-buttons/disk-download-button";
import { downloadKey, requestDownloadByButton } from "../download-shortcut";
import { makeStoryFetcher } from "./cached-story-fetching";

const findCloseStoryElement = (storyEl: HTMLElement): HTMLElement => {
	return storyEl.querySelector(".coreSpriteCloseLight").children[0] as HTMLElement;
};

const getStoryDownloadElementStyle = (storyEl: HTMLElement): Partial<CSSStyleDeclaration> => {
	const closeSprite = findCloseStoryElement(storyEl);
	const size = closeSprite.clientHeight + "px";
	const blueprintEl = closeSprite.parentElement.parentElement;
	const margin = getComputedStyle(blueprintEl).getPropertyValue("margin");
	return {
		width: size,
		height: size,
		margin
	};
};

interface StoryPauseHandle {
	keepPaused: () => void,
	continue: () => void
};

const createStoryPauseHandle = (): StoryPauseHandle => {
	let _storyPaused = false;
	const video = document.querySelector("video");
	const keepStoryPaused = () => {
		_storyPaused = true;
		const loop = () => {
			if (!video.paused) {
				video.pause();
			}
			if (!_storyPaused) return;
			window.requestAnimationFrame(loop);
		};
		loop();
	};
	const continueStory = () => {
		_storyPaused = false;
	};
	return {
		keepPaused: keepStoryPaused,
		continue: continueStory
	}
};

function findStoryPlayButton(){
	const playButton = document.querySelector("header button") as HTMLElement;
	if (!playButton) {
		return left("could not add download-button in story. the svg for the pause/play button has not button as an ancestor");
	}
	return right(playButton);
}

export const injectDownloadButtonsIntoStory = (storyEl: HTMLElement) => {
	const container = createElementByHTML(`
		<div style="margin-right: 8px;"></div>
	`);

	const pauseHandleDownloadOptions = ((): DiskDownloadButtonOptions => {
		let pauseHandle: StoryPauseHandle | null = null;
		return {
			onDownloadStart: () => {
				if (document.querySelector("video")){
					pauseHandle = createStoryPauseHandle();
					pauseHandle.keepPaused();
				}
			},
			onDownloadEnd: () => {
				if (!pauseHandle) return;
				pauseHandle.continue();
			}
		};
	})();

	const diskDownloadButton = createDiskDownloadButton(
		makeStoryFetcher(),
		pauseHandleDownloadOptions
	);
	// Object.assign(diskDownloadButton.style, getStoryDownloadElementStyle(storyEl));
	container.appendChild(diskDownloadButton);
	
	const playButtonEither = findStoryPlayButton();
	if (isLeft(playButtonEither)){
		console.warn(playButtonEither.left);
		return;
	}
	const playButton = playButtonEither.right;

	const buttonContainer = playButton.parentElement;
	buttonContainer.insertAdjacentElement("afterbegin", container);

	document.addEventListener("keypress", e => {
		if (e.key === downloadKey){
			requestDownloadByButton(diskDownloadButton);
		}
	});
};