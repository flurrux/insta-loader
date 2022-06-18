import { createElementByHTML, querySelectorAncestor } from "../../lib/html-util";
import { getSrcOfStory } from "../data-extraction/directly-in-browser/stories/source";
import { getUsernameOfStory } from "../data-extraction/directly-in-browser/stories/username";
import { createDiskDownloadButton, DiskDownloadButtonOptions, MediaWriteInfo } from "../download-buttons/disk-download-button";
import { downloadKey, requestDownloadByButton } from "../download-shortcut";
import { isLeft } from "fp-ts/lib/Either";


const findCloseStoryElement = (storyEl: HTMLElement): HTMLElement => {
	return storyEl.querySelector(".coreSpriteCloseLight").children[0] as HTMLElement;
};

const getMediaSrcOfStoryElement = (storyEl: HTMLElement): Promise<MediaWriteInfo> => {
	try {
		const username = getUsernameOfStory();
		if (isLeft(username)){
			return Promise.reject(username.left);
		}
		const src = getSrcOfStory(storyEl);
		return Promise.resolve({ src, username: username.right });
	}
	catch (e) {
		return Promise.reject(e);
	}
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

function findSvgPauseOrPlayButton(){
	return document.querySelector("header svg") as HTMLElement;
}

function findStoryPlayButton(){
	const svgButton = findSvgPauseOrPlayButton();
	if (!svgButton){
		console.warn("could not add download-button in story. the svg for the pause/play button could not be found");
		return;
	}
	const playButton = querySelectorAncestor("button", svgButton);
	if (!playButton) {
		console.warn("could not add download-button in story. the svg for the pause/play button has not button as an ancestor");
		return;
	}
	return playButton;
}

export const injectDownloadButtonsIntoStory = (storyEl: HTMLElement) => {
	const container = createElementByHTML(`
		<div style="margin-right: 20px;"></div>
	`);

	const pauseHandleDownloadOptions = ((): DiskDownloadButtonOptions => {
		let pauseHandle: StoryPauseHandle = null;
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
		() => getMediaSrcOfStoryElement(storyEl),
		pauseHandleDownloadOptions
	);
	// Object.assign(diskDownloadButton.style, getStoryDownloadElementStyle(storyEl));
	container.appendChild(diskDownloadButton);
	
	const playButton = findStoryPlayButton();
	const buttonContainer = playButton.parentElement;
	buttonContainer.insertAdjacentElement("afterbegin", container);

	document.addEventListener("keypress", e => {
		if (e.key === downloadKey){
			requestDownloadByButton(diskDownloadButton);
		}
	});
};