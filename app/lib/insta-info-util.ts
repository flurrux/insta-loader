import { getCurrentPageType } from '../src/insta-navigation-observer';

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
export interface MediaInfo {
	username: string,
	postType: "collection" | "video" | "image",
	mediaArray: VideoOrImgInfo[]
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
	const linkElement = postElement.querySelector('a[href*="/p/"') as HTMLLinkElement;
	const href = linkElement[0].href;
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
const findTypeOfPost = (postElement: HTMLElement): ("video" | "image" | "collection") => {
	if (postElement.querySelector("ul img[srcset], ul video") !== null) return "collection";
	const mediaElement = findMediaElementInPost(postElement);
	return mediaElement.tagName === "VIDEO" ? "video" : "image";
};
const extractMediaFromElement = (mediaElement: VideoOrImageElement): { type: "video" | "image", src: string } => {
	const type = mediaElement.tagName === "VIDEO" ? "video" : "image";
	const src = type === "video" ? mediaElement.src : getHighestQualityFromSrcset((mediaElement as HTMLImageElement).srcset);
	return { type, src };
};
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
export const getMediaInfoByHtml = (postElement: HTMLElement) => {
	const username = findUsernameInPost(postElement);
	const postType = findTypeOfPost(postElement);
	const media = postType === "collection" ? getCollectionMediaByPostElement(postElement) : getSingleMediaInfoByPostElement(postElement);
	return {
		username, postType, media
	};
};



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
	return /(?<=stories\/).*(?=\/)/.exec(storyUrl)[0];
};



