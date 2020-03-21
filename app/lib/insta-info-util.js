import { pageType, getCurrentPageType } from '../src/insta-navigation-observer.js';

export const elementType = {
	preview: "preview",
	post: "post",
	story: "story"
};

export const getElementTypesOnCurrentPage = () => {
	let curPageType = getCurrentPageType();
	if (curPageType == pageType.mainFeed || curPageType == pageType.post){
		return [elementType.post];
	}
	else if (curPageType == pageType.personFeed){
		return [elementType.preview];
	}
	else if (curPageType == pageType.stories) {
		return [elementType.story];
	}
	return [];
};

const getInstaHandle = (mainElement) => {
	return mainElement.querySelector("header").querySelector("a").getAttribute("href").split("/").join("");
};

const getMediaName = (mediaSrc) => {
	var split = mediaSrc.split("/");
	return split[split.length - 1];
};

const getDownloadMode = (mainElement) => {
	let videoElement = mainElement.querySelector("._l6uaz");
	if (videoElement != null && videoElement.src.includes("blob")){ 
		return "http";
	}
	else {
		return "direct";   
	}
};

//this is my strategy when trying to figure out the location of an info:
//copy the desired info (like the name or the image url)
//make a httprequest and search the responseText for the info
//in the previous cases the info was in a json object and the page is initialized with it
//then i copy the json text and make it an object in the conse
//now i need the path to the desired info, and use this method
function searchInObjectSub(obj, curPath, str){
	
	let keys = Object.keys(obj);
	for (let key of keys){
	
		let val = obj[key];
		if (val === undefined || val == null){

			continue;
		}
		let type = typeof(val);
		if (type == "string"){
			
			if (val == str){
				
				curPath.push(key);
				return true;
			}	
		}
		else if (type == "object"){
			
			let childTreeResult = searchInObjectSub(val, curPath, str);
			if (childTreeResult){
				
				curPath.push(key);
				return true;
			}	
		}
	}
	return false;
}

function searchInObject(obj, str){

	let path = [];
	searchInObjectSub(obj, path, str);
	path.reverse();
	return path;
}



function extractImageSourcesFromText(text, fromIndex){

	let startIndex = text.indexOf("display_resources", fromIndex);
	let squareBracketOpenIndex = text.indexOf("[", startIndex);
	let squareBracketCloseIndex = text.indexOf("]", squareBracketOpenIndex);
	let imageSourceJsonString = text.substring(squareBracketOpenIndex, squareBracketCloseIndex + 1);
	let imageSourceJson = JSON.parse(imageSourceJsonString);
	return imageSourceJson;
}

function extractVideoUrl(text, fromIndex){
		
	let httpIndex = text.indexOf("http", fromIndex);
	let stringEnd = ".mp4";
	let mp4Index = text.indexOf(stringEnd, httpIndex);
	return text.substring(httpIndex, mp4Index + stringEnd.length);
}

function extractMediaFromTextOld(text){

	/*
	var videoUrlStart = "video_url";
	var imgUrlStart = "display_url";// "display_src";

	var startOffset = 4;
	var endOffset = 4;
	if (text.includes(videoUrlStart)){

		return stringUtil.extract(text, videoUrlStart, startOffset, ".mp4", endOffset);
	}
	else if (text.includes(imgUrlStart)){

		return stringUtil.extract(text, imgUrlStart, startOffset, ".jpg", endOffset);
	}
	*/
}

function extractMediaFromText(text){

	//the key of the object with relevant information
	//shortcode_media
	let baseIndex = text.indexOf("shortcode_media");

	let postType = "unknown";
	let mediaArray = [];

	let edgeChildrenCarIndex = text.indexOf("edge_sidecar_to_children", baseIndex);
	if (edgeChildrenCarIndex > 0){

		postType = "collection";

	}
	else {

		let videoUrlIndex = text.indexOf("video_url", baseIndex);
		if (videoUrlIndex > 0){

			postType = "video";
			let videoUrl = extractVideoUrl(text, videoUrlIndex);
			mediaArray.push({
				type: "video",
				src: videoUrl
			});
		}
		else {

			postType = "image";
			let imageSources = extractImageSourcesFromText(text, baseIndex);
			mediaArray.push({
				type: "image",
				srcset: imageSources
			});
		}
	}

	let mediaData = {

		postType: postType,
		mediaArray: mediaArray
	};
	return mediaData;
}

function extractMediaFromXml(xml){

	let metaElement = null;
	let mediaType = "unknown";

	let mediaTypes = ["video", "image"];
	let selectors = ['meta[property="og:video"]', 'meta[property="og:image"]'];
	for (let a = 0; a < selectors.length; a++){

		metaElement = xml.querySelector(selectors[a]);
		if (metaElement != null){

			mediaType = mediaTypes[a];
			break;
		}
	}

	if (metaElement == null){

		return null;
	}

	let mediaSrc = metaElement.getAttribute("content");
	return {
		src: mediaSrc,
		type: mediaType
	};
}

function extractInstaHandleFromXml(xml){

	let handle = "unknown";

	//return xml.querySelector("._2g7d5").title;

	let handleEl = xml.querySelector('meta[content*="(@"]');
	if (handleEl != null){

		var handleContent = handleEl.content;
		var startIndex = handleContent.indexOf("@") + 1;
		handle = "";
		for (var a = 0; a < 1000; a++){

			var index = startIndex + a;
			var char = handleContent.charAt(index);
			if (char == ")"){

				break;
			}
			
			handle += char;
		}
	}
	
	return handle;

	
	/*
	let handleEl = xml.querySelector("._iadoq");
	if (handleEl != null){

		handle = handleEl.href;
	}

	return handle;
	*/
}

// interface MediaInfo {
// 	username: string,
// 	postType: "collection" | "video" | "image",
// 	mediaArray: { type: "video", src: string, previewSrc: string }[] | 
	// { type: "image", srcset: string, previewSrc: string }[]
// }
export const getMediaInfo = (url) => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
	
		function transferComplete(){
	
			let responseText = this.responseText;
	
			const graphQlRegex = /(?<=window\.__additionalDataLoaded\(.*',).*(?=\);<)/;
			const dataText = graphQlRegex.exec(responseText);
			if (!dataText){
				reject('could not find instagram data in response.');
			};
			
			let dataObject = null;
			try {
				dataObject = JSON.parse(dataText[0]);
			}
			catch(e){
				reject(e);
			}
			
			let postType = "unknown";
			let mediaArray = [];
			let username = "unknown";
			{
				if (!dataObject.graphql) reject("graphql not found");
				if (!dataObject.graphql.shortcode_media) reject("shortcode_media not found");
				let postInfo = dataObject.graphql.shortcode_media;
				let subMedia;
	
				if (postInfo.edge_sidecar_to_children !== undefined){
	
					postType = "collection";
					subMedia = (postInfo.edge_sidecar_to_children.edges).map(el => el.node);
				}
				else { 
					
					subMedia = [postInfo];
					if (postInfo.video_url !== undefined){
	
						postType = "video";
					}
					else {
	
						postType = "image";
					}
				}
	
				mediaArray = new Array(subMedia.length);
				for (let a = 0; a < subMedia.length; a++){
	
					let subMed = subMedia[a];
					let subObj = {};
					if (subMed.video_url !== undefined){
	
						subObj.type = "video";
						subObj.src = subMed.video_url;
					}
					else {
	
						subObj.type = "image";
						subObj.srcset = subMed.display_resources;
					}
					subObj.previewSrc = subMed.display_url;
					mediaArray[a] = subObj;
				}
	
				username = postInfo.owner.username;
			}
	
			if (mediaArray.length === 0){
				reject("no media found");
			}

			let data = {
				postType: postType,
				mediaArray: mediaArray,
				username: username
			};
			
			resolve(data);
		}
	
		request.addEventListener("load", transferComplete);
		request.addEventListener("error", reject);
		request.addEventListener("abort", reject);
	
		request.open("GET", url);
		request.send();
	});
};

export const getPreviewSrcOfPost = (postElement) => {
	const queries = ["video[poster]", "img[srcset]"];
	const previewAttr = ["poster", "src"];
	for (let a = 0; a < previewAttr.length; a++){
		const found = postElement.querySelector(queries[a]);
		if (found !== null){
			const previewSrc = found.getAttribute(previewAttr[a]);
			return previewSrc;
		}
	}

	return null;
};

export const getHrefOfPost = (postElement) => {
	const linkElements = postElement.querySelectorAll('a[href*="/p/"');
	const href = linkElements[0].href;
	const startIndex = href.indexOf("/p/") + 3;
	const endIndex = href.indexOf("/", startIndex);
	return href.substring(0, endIndex + 1);
};

const getHighestQualityFromSrcset = (srcset) => {
	const split = srcset.split(",");
	let highestQualiString = split[split.length - 1];
	const endIndex = highestQualiString.indexOf(" ") + 1;
	highestQualiString = highestQualiString.substring(0, endIndex);
	return highestQualiString.trim();
};

export const getSrcOfStory = (storyElement) => {
	const video = storyElement.querySelector("video");
	if (video != null){

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
		const img = storyElement.querySelector('img[srcset]');
		if (img != null){
			return getHighestQualityFromSrcset(img.srcset);
		}
	}

	return null;
};

export const getUsernameOfStory = () => {
	const url = window.location.href;
	const startString = "stories/";
	const startIndex = url.indexOf(startString) + startString.length;
	return url.substring(startIndex).replace("/", "");
};

export const getPostMediaElement = (postElement) => {
	return postElement.querySelector("video, img[srcset]");
};

const getUsernameByPostElement = (postElement) => {
	const profileLink = postElement.querySelector("header a").href;
	const usernameRegex = /(?<=\.com\/).*(?=\/)/;
	const regexResult = usernameRegex.exec(profileLink);
	return regexResult.length === 0 ? undefined : regexResult[0];
};
const getPostTypeByPostElement = (postElement) => {
	//first test for collection
	if (postElement.querySelector("ul img[srcset], ul video") !== null){
		return "collection";
	}
	const mediaElement = getPostMediaElement(postElement);
	return mediaElement.tagName === "VIDEO" ? "video" : "image";
};
const extractMediaFromElement = (mediaElement) => {
	const type = mediaElement.tagName === "VIDEO" ? "video" : "image";
	return {
		type,
		...(type === "video" ? { src: mediaElement.src } : { src: getHighestQualityFromSrcset(mediaElement.srcset) })
	}
};
const getCollectionMediaByPostElement = (postElement) => {
	const list = postElement.querySelector("ul");
	//the actual first item at index 0 is some kind of marker with width 1
	const firstItem = list.children[1];
	const listItemWidth = parseFloat(getComputedStyle(firstItem).getPropertyValue("width"));
	const positionReferenceElement = list.parentElement.parentElement;
	const visibleX = positionReferenceElement.getBoundingClientRect().x;

	for (let i = 1; i < list.children.length; i++){
		const listItem = list.children[i];
		const curItemX = listItem.getBoundingClientRect().x;
		if (Math.abs(visibleX - curItemX) < listItemWidth / 2){
			const mediaEl = listItem.querySelector("img[srcset], video");
			return extractMediaFromElement(mediaEl);
		}
	}

	return;
};
const getSingleMediaInfoByPostElement = (postElement) => extractMediaFromElement(postElement.querySelector("img[srcset], video"))
export const getMediaInfoByHtml = (postElement) => {
	const username = getUsernameByPostElement(postElement);
	const postType = getPostTypeByPostElement(postElement);
	const media = postType === "collection" ? getCollectionMediaByPostElement(postElement) : getSingleMediaInfoByPostElement(postElement);
	return {
		username, postType, media
	};
};

function getStoryItemsByNavigationElement(navigationElement){
	//$0.__reactInternalInstance$o18wyingh6h.return.return.return.stateNode.props.items
	const keys = Reflect.ownKeys(navigationElement);
	const reactInstanceKey = keys.find(val => val.includes("Instance"));
	let currentReturn = navigationElement[reactInstanceKey];
	for (let a = 0; a < 1000; a++){
		if (currentReturn.stateNode.nodeName !== undefined){
			currentReturn = currentReturn.return;
		}
		else {
			break;
		}
	}
	return currentReturn.stateNode.props.items;
}

export const getOwnUsername = () => {
	const usernameMatches = document.body.innerHTML.match(new RegExp('(?<="username":")[^"]*'));
	if (usernameMatches.length > 0){
		return usernameMatches[0];
	}
	else {
		return null;
	}
};
