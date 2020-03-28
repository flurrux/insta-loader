
import instaChangeDetector from '../insta-change-detection';
import { injectDownloadButtonsIntoPost } from './post-extension';
import { injectDownloadButtonsIntoPreview } from './preview-extension';
import { injectDownloadButtonsIntoStory } from './story-extension';


instaChangeDetector.addEventListener("onPostAdded", e => {
	injectDownloadButtonsIntoPost((e as any).detail.element);
});

instaChangeDetector.addEventListener("onPreviewAdded", e => {
	injectDownloadButtonsIntoPreview((e as any).detail.element);
});

instaChangeDetector.addEventListener("onStoryAdded", e => {
	injectDownloadButtonsIntoStory((e as any).detail.element);
});

instaChangeDetector.start();
