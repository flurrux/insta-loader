import { MediaWriteInfo, createDiskDownloadButton, DiskDownloadButtonOptions } from "../download-buttons/disk-download-button";
import { getSrcOfStory, getUsernameByStoryUrl } from "../insta-info-util";
import { createElementByHTML } from "../../lib/html-util";


const findCloseStoryElement = (storyEl: HTMLElement): HTMLElement => {
	return storyEl.querySelector(".coreSpriteCloseLight").children[0] as HTMLElement;
};
const getMediaSrcOfStoryElement = (storyEl: HTMLElement): Promise<MediaWriteInfo> => {
	try {
		const src = getSrcOfStory(storyEl);
		const username = getUsernameByStoryUrl(window.location.href);
		return Promise.resolve({ src, username });
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
export const injectDownloadButtonsIntoStory = (storyEl: HTMLElement) => {
	const closeEl = findCloseStoryElement(storyEl);
	if (closeEl === null) {
		console.warn("cannot find the close button. instagram may have changed it.");
		return;
	}

	const container = createElementByHTML(`
		<div style="position: absolute; right: -56px; top: 56px;"></div>
	`);

	const pauseHandleDownloadOptions = ((): DiskDownloadButtonOptions => {
		if (!document.querySelector("video")){
			return {
				onDownloadStart: () => {},
				onDownloadEnd: () => {}
			};
		}
		let pauseHandle: StoryPauseHandle = null;
		return {
			onDownloadStart: () => {
				pauseHandle = createStoryPauseHandle();
				pauseHandle.keepPaused();
			},
			onDownloadEnd: () => pauseHandle.continue()
		};
	})();
	const diskDownloadButton = createDiskDownloadButton(
		() => getMediaSrcOfStoryElement(storyEl),
		pauseHandleDownloadOptions
	);
	Object.assign(diskDownloadButton.style, getStoryDownloadElementStyle(storyEl));
	container.appendChild(diskDownloadButton);

	const closeButton = closeEl.parentElement.parentElement;
	closeButton.insertAdjacentElement("afterend", container);
};