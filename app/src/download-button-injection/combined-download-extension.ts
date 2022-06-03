
import instaChangeDetector from '../mutation-observer-posts-previews-stories';
import { injectDownloadButtonsIntoPost } from './post-button-injection';
import { injectDownloadButtonsIntoStory } from './story-extension';


instaChangeDetector.addEventListener("onPostAdded", e => {
	injectDownloadButtonsIntoPost((e as any).detail.element);
});

// instaChangeDetector.addEventListener("onPreviewAdded", e => {
// 	injectDownloadButtonsIntoPreview((e as any).detail.element);
// });

instaChangeDetector.addEventListener("onStoryAdded", e => {
	injectDownloadButtonsIntoStory((e as any).detail.element);
});

instaChangeDetector.start();
