import { isLeft, left, right } from "fp-ts/es6/Either";
import { createElementByHTML } from "../../lib/html-util";
import { createDiskDownloadButton } from "../download-buttons/disk-download-button";
import { downloadKey, requestDownloadByButton } from "../download-shortcut";
import { makeStoryFetcher } from "./cached-story-fetching";


// # story pausing (to prevent the story from finishing before the download started)

interface StoryPauseHandle {
	keepPaused: () => void,
	continue: () => void
};

function createStoryPauseHandle(): StoryPauseHandle {
	let _storyPaused = false;
	const video = document.querySelector("video");
	const keepStoryPaused = () => {
		_storyPaused = true;
		const loop = () => {
			if (video && !video.paused) {
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



function findStoryPlayButton(parent: HTMLElement){
	// here we're relying on the language being set to english.
	// aria-label depends on language!
	const playButton = (
		parent.querySelector('*[aria-label=Play]') ??
		parent.querySelector('*[aria-label=Pause]')
	);

	if (!playButton) {
		return left("could not add download-button in story. the svg for the pause/play button has no button as an ancestor");
	}

	return right(playButton.parentElement);
}

export const injectDownloadButtonsIntoStory = (storyEl: HTMLElement) => {

	const container = createElementByHTML(`
		<div style="margin-right: 8px;"></div>
	`);

	const pauseHandleDownloadOptions = (function(){
		let pauseHandle: StoryPauseHandle | null = null;
		return {
			onDownloadStart: () => {
				if (document.querySelector("video")){
					pauseHandle = createStoryPauseHandle();
					pauseHandle.keepPaused();
				}
			},
			onDownloadEnd: (successful: boolean) => {
				if (!pauseHandle) return;
				pauseHandle.continue();
			}
		};
	})();

	const diskDownloadButton = createDiskDownloadButton({
		fetchMediaInfo: makeStoryFetcher(),
		...pauseHandleDownloadOptions
	});

	const targetSize = 24;
	// make the button a little smaller to better fit in with its siblings:
	Object.assign(
		diskDownloadButton.style,
		{ width: `${targetSize}px` }
	);

	// Object.assign(diskDownloadButton.style, getStoryDownloadElementStyle(storyEl));
	container.appendChild(diskDownloadButton);
	
	const playButtonEither = findStoryPlayButton(storyEl);
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