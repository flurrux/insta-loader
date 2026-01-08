
import instaChangeDetector from '../mutation-observer-posts-previews-stories';
import { replaceReelLinksByPosts } from '../replace-reel-links-by-posts';
import { injectDownloadButtonsIntoPost } from './post-button-injection';
import { injectDownloadButtonsIntoStory } from './story-extension';


instaChangeDetector.addEventListener(
	"onPostAdded", 
	e => injectDownloadButtonsIntoPost((e as any).detail.element)
);

// Replace the "/reel/"" part in the url by "/p/" for each preview item,
// so that when one is opened, it will be able to download the video.
// I don't know exactly why, but the downloader fails for reels.
instaChangeDetector.addEventListener(
	"onPreviewAdded",
	replaceReelLinksByPosts
);

instaChangeDetector.addEventListener(
	"onStoryAdded", 
	e => injectDownloadButtonsIntoStory((e as any).detail.element)
);

instaChangeDetector.start();
