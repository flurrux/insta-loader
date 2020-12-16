import { getCurrentPageType } from './insta-navigation-observer';

export type InstaElementType = "preview" | "post" | "story";

export type VideoOrImageElement = HTMLVideoElement | HTMLImageElement;

export const getElementTypesOnCurrentPage = (): InstaElementType[] => {
	const curPageType = getCurrentPageType();
	if (curPageType === "mainFeed" || curPageType === "post"){
		return ["post"];
	}
	else if (curPageType === "personFeed"){
		return ["preview"];
	}
	else if (curPageType === "stories") {
		return ["story"];
	}
	return [];
};

export const getHighestQualityFromSrcset = (srcset: string): string => {
	const split = srcset.split(",");
	let highestQualiString = split[split.length - 1];
	const endIndex = highestQualiString.indexOf(" ") + 1;
	highestQualiString = highestQualiString.substring(0, endIndex);
	return highestQualiString.trim();
};

interface SrcSetEntry {
	src: string,
	config_width: number,
	config_height: number
};
const getHighestQualityFromSrcsetArray = (srcsetArray: SrcSetEntry[]): string => {
	let maxWidthIndex = 0;
	let maxWidth = srcsetArray[0].config_width;
	for (let i = 1; i < srcsetArray.length; i++){
		const curWidth = srcsetArray[i].config_width;
		if (curWidth > maxWidth){
			maxWidthIndex = i;
			maxWidth = curWidth;
		}
	}
	return srcsetArray[maxWidthIndex].src;
};

export const getOwnUsername = (): string => {
	return /(?<="username":")[^"]*/.exec(document.body.innerHTML)[0];
};

const queryVideoOrImg = (parent: HTMLElement) => parent.querySelector("video, img[srcset]") as VideoOrImageElement;


//fetching ###

export interface VideoInfo {
	type: "video",
	src: string,
	previewSrc: string
};
export interface ImgInfo {
	type: "image", 
	srcset: SrcSetEntry[],
	src: string,
	previewSrc: string
};
export type VideoOrImgInfo = VideoInfo | ImgInfo;
type PostType = "collection" | "video" | "image";
export interface MediaInfo {
	username: string,
	postType: PostType,
	mediaArray: VideoOrImgInfo[]
}
export interface SingleMediaInfo { 
	username: string, 
	src: string, 
	type: "video" | "image"
}

const getMediaInfoFromResponseText = (responseText: string): MediaInfo => {
	const dataText = /(?<=window\.__additionalDataLoaded\(.*',).*(?=\);<)/.exec(responseText);
	if (!dataText) throw '__additionalDataLoaded not found on window';

	const dataObject = JSON.parse(dataText[0]);

	if (!dataObject.graphql) throw 'graphql not found';
	if (!dataObject.graphql.shortcode_media) throw 'shortcode_media not found';

	const postInfo = dataObject.graphql.shortcode_media;
	const username: string = postInfo.owner.username;
	
	const [postType, subMedia] = postInfo.edge_sidecar_to_children !== undefined ? 
		[ "collection", (postInfo.edge_sidecar_to_children.edges).map(el => el.node) ] : 
		[ postInfo.video_url !== undefined ? "video" : "image", [postInfo] ];

	const mediaArray: VideoOrImgInfo[] = [];
	for (let a = 0; a < subMedia.length; a++) {
		let subMed = subMedia[a];
		let subObj: Partial<VideoOrImgInfo> = {
			previewSrc: subMed.display_url
		};

		if (subMed.video_url !== undefined) {
			Object.assign(subObj, {
				type: "video",
				src: subMed.video_url
			} as Partial<VideoInfo>)
		}
		else {
			const srcset = subMed.display_resources as SrcSetEntry[];
			const highQualitySrc = getHighestQualityFromSrcsetArray(srcset);
			Object.assign(subObj, {
				type: "image",
				srcset, 
				src: highQualitySrc
			} as Partial<ImgInfo>)
		}

		mediaArray.push(subObj as VideoOrImgInfo);
	}

	if (mediaArray.length === 0) {
		throw 'no media found';
	}
	
	return {
		postType,
		mediaArray,
		username
	} as MediaInfo;
};
export const fetchMediaInfo = (url: string): Promise<MediaInfo> => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
	
		function transferComplete(){
			try {
				const data = getMediaInfoFromResponseText(this.responseText);
				resolve(data);
			}
			catch (e){
				reject(e);
			}
		}
	
		request.addEventListener("load", transferComplete);
		request.addEventListener("error", reject);
		request.addEventListener("abort", reject);
	
		request.open("GET", url);
		request.send();
	});
};


//main-feed ###

export function findMainFeedPostsContainer(): HTMLDivElement {
	return document.querySelector("article").parentElement as HTMLDivElement
}
export function findMainFeedPosts(): HTMLElement[] {
	return Array.from(findMainFeedPostsContainer().children) as HTMLElement[]
}


//post ###

export const getPreviewSrcOfPost = (postElement: HTMLElement): string => {
	const queries = ["video[poster]", "img[srcset]"];
	const previewAttr = ["poster", "src"];
	for (let a = 0; a < previewAttr.length; a++){
		const found = postElement.querySelector(queries[a]);
		if (found !== null){
			const previewSrc = found.getAttribute(previewAttr[a]);
			return previewSrc;
		}
	}
};
export const getHrefOfPost = (postElement: HTMLElement): string => {
	const linkElements = postElement.querySelectorAll('a[href*="/p/"') as NodeListOf<HTMLLinkElement>;
	const href = linkElements[linkElements.length - 1].href;
	const startIndex = href.indexOf("/p/") + 3;
	const endIndex = href.indexOf("/", startIndex);
	return href.substring(0, endIndex + 1);
};
export const findMediaElementInPost = (postElement: HTMLElement): VideoOrImageElement => {
	return queryVideoOrImg(postElement);
};
const findUsernameInPost = (postElement: HTMLElement): string => {
	const profileLink = (postElement.querySelector("header a") as HTMLLinkElement).href;
	return /(?<=\.com\/).*(?=\/)/.exec(profileLink)[0];
};
const findTypeOfPost = (postElement: HTMLElement): PostType => {
	// if (postElement.querySelector("ul img[srcset], ul video") !== null) return "collection";
	if (postElement.querySelector('[class*="Chevron"]')) return "collection";
	const mediaElement = findMediaElementInPost(postElement);
	if (!mediaElement){
		console.warn("no media-element found");
		console.log(postElement.innerHTML);
	}
	return mediaElement.tagName === "VIDEO" ? "video" : "image";
};
const extractMediaFromElement = (mediaElement: VideoOrImageElement): Omit<SingleMediaInfo, "username"> => {
	const type = mediaElement.tagName === "VIDEO" ? "video" : "image";
	const src = type === "video" ? mediaElement.src : getHighestQualityFromSrcset((mediaElement as HTMLImageElement).srcset);
	return { type, src };
};
function getCurrentCollectionIndex(postEl: HTMLElement): number {
	const list = postEl.querySelector("ul");
	//the actual first item at index 0 is some kind of marker with width 1
	const firstItem = list.children[1];
	const listItemWidth = parseFloat(getComputedStyle(firstItem).getPropertyValue("width"));
	const positionReferenceElement = list.parentElement.parentElement;
	const visibleX = positionReferenceElement.getBoundingClientRect().x;
	
	for (let i = 1; i < list.children.length; i++) {
		const listItem = list.children[i];
		const curItemX = listItem.getBoundingClientRect().x;
		if (Math.abs(visibleX - curItemX) < listItemWidth / 2) {
			return i - 1;
		}
	}
	return -1;
}
const getCollectionMediaByPostElement = (postElement: HTMLElement) => {
	const list = postElement.querySelector("ul");
	//the actual first item at index 0 is some kind of marker with width 1
	const firstItem = list.children[1];
	const listItemWidth = parseFloat(getComputedStyle(firstItem).getPropertyValue("width"));
	const positionReferenceElement = list.parentElement.parentElement;
	const visibleX = positionReferenceElement.getBoundingClientRect().x;

	for (let i = 1; i < list.children.length; i++) {
		const listItem = list.children[i];
		const curItemX = listItem.getBoundingClientRect().x;
		if (Math.abs(visibleX - curItemX) < listItemWidth / 2) {
			const mediaEl = queryVideoOrImg(listItem as HTMLElement);
			return extractMediaFromElement(mediaEl);
		}
	}
};
const getSingleMediaInfoByPostElement = (postElement: HTMLElement) => {
	return extractMediaFromElement(findMediaElementInPost(postElement));
};
export const getMediaInfoByHtml = (postElement: HTMLElement): SingleMediaInfo => {
	const username = findUsernameInPost(postElement);
	const postType = findTypeOfPost(postElement);
	const media = postType === "collection" ? getCollectionMediaByPostElement(postElement) : getSingleMediaInfoByPostElement(postElement);
	return { username, ...media };
};


export function createMediaFetcherBySrcElement(postElement: HTMLElement) {
	let currentMediaInfo: MediaInfo = null;
	let currentPostType: PostType = null;
	return async(): Promise<SingleMediaInfo> => {
		if (!currentPostType){
			currentPostType = findTypeOfPost(postElement);
		}
		if (!currentMediaInfo){
			const postHref = getHrefOfPost(postElement);
			currentMediaInfo = await fetchMediaInfo(postHref);
		}
		const username = currentMediaInfo.username;
		const collectionIndex = currentPostType === "collection" ? getCurrentCollectionIndex(postElement) : 0;
		return { username, ...currentMediaInfo.mediaArray[collectionIndex] }
	}
}


function calculatePostDistanceToViewport(postEl: HTMLElement): number {
	const rect = postEl.getBoundingClientRect();
	const centerY = (rect.top + rect.bottom) / 2;
	return Math.abs(centerY - window.innerHeight / 2);
}
export function findCurrentPost(): HTMLElement {
	const posts = findMainFeedPosts();
	const closestPostData: [number, HTMLElement] = posts.reduce(
		(acc: [number, HTMLElement], postEl: HTMLElement) => {
			const dist = calculatePostDistanceToViewport(postEl);
			return dist < acc[0] ? [dist, postEl] as [number, HTMLElement] : acc
		},
		[Infinity, null]
	);
	return closestPostData[1];
}


//story ###

export const getSrcOfStory = (storyElement: HTMLElement): string => {
	const video = storyElement.querySelector("video");
	if (video !== null){
		//there seems to be several sources that have different file sizes
		//when downloaded. i want to get the biggest file, cuz that's probably
		//where the quality is. after some research i found out the sources use different
		//video codecs for compression.
		//there are 3 "tiers": baseline, main and high and that's what
		//these 3 numbers mean (42, 4D, 64). to get the highest possible level, 
		//we just sort the sources by that tier
		const sources = Array.from(video.querySelectorAll("source"));
		const codecOrder = ["42", "4D", "64"];
		const getOrderOfCodec = (codec) => {
			return codecOrder.findIndex(val => codec.type.includes(val));
		};
		const sourceSortFunc = (a, b) => getOrderOfCodec(a) - getOrderOfCodec(b);
		sources.sort(sourceSortFunc);
		return sources[sources.length - 1].src;
	}
	else {
		const img = storyElement.querySelector('img[srcset]') as HTMLImageElement;
		if (img !== null){
			return getHighestQualityFromSrcset(img.srcset);
		}
	}
	return null;
};
export const getUsernameByStoryUrl = (storyUrl: string): string => {
	return /(?<=stories\/).*?(?=\/)/.exec(storyUrl)[0];
};
export const getUsernameByStoryElement = (storyElement: HTMLElement) => {
	return Array.from(
		storyElement.querySelectorAll("span")
	).find(span => span.children.length === 0).innerText;
};
export const findStoryElement = (): HTMLElement => {
	const parent = document.body;
	const firstCanvas = parent.querySelector("button canvas");
	if (!firstCanvas) {
		return;
	}
	let currentChild = firstCanvas.parentElement;
	for (let a = 0; a < 10000; a++) {
		const currentParent = currentChild.parentElement;
		if (!currentParent) {
			return;
		}
		if (currentParent.offsetHeight - currentChild.offsetHeight < 0) {
			return currentParent;
		}
		currentChild = currentParent;
	}
	console.warn("either something went wrong or the dom is very large");
};
// export const storyNodeToData = (node: HTMLElement) => {
// 	return {
// 		thumbnail: node.querySelector("img").src,
// 		name: getUsernameByStoryElement(node),
// 		relativeTime: node.querySelector("time").innerHTML,
// 		seen: node.querySelector("canvas").width < 55
// 	};
// };
// export const getStoryData = (scrollEl: HTMLElement) => {
// 	return new Promise((resolve, reject) => {
// 		//const scrollEl = null;
// 		const storyContainer = scrollEl.children[0];
// 		const stories = [];
// 		const storyElementHeight = 52;
// 		const scrollDeltaCount = 5;

// 		const childrenChangeObserver = new MutationObserver(async (mutations) => {
// 			const addedNodes = (mutations.map(
// 				mutation => Array.from(mutation.addedNodes)
// 			) as any).flat();
// 			stories.push(...addedNodes.map(storyNodeToData));
// 			const scrollBottom = scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.offsetHeight);
// 			if (Math.abs(scrollBottom) < storyElementHeight / 2) {
// 				childrenChangeObserver.disconnect();
// 				resolve(stories);
// 				return;
// 			}
// 			scrollEl.scrollBy(0, addedNodes.length * storyElementHeight);
// 		});
// 		childrenChangeObserver.observe(storyContainer, { childList: true });

// 		//start at top
// 		scrollEl.scrollTop = 0;
// 		stories.push(...Array.from(storyContainer.children).map(storyNodeToData));
// 		scrollEl.scrollBy(0, scrollDeltaCount * storyElementHeight);
// 	});
// };
