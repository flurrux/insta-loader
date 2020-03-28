//object for detecting when a certain element has been added, 
//like post, preview, story

import { 
	InstaElementType,
	findMediaElementInPost, 
	getElementTypesOnCurrentPage,
} from './insta-info-util';



interface InstaChangeDetector extends EventTarget {
	start: () => void,
};
const instaChangeDetector = new EventTarget() as InstaChangeDetector;



const getContainedPreviewElements = (element: HTMLElement): HTMLElement[] => {
	return (Array.from(element.querySelectorAll('a[href*="/p/"]')) as HTMLLinkElement[])
		.filter(el => el.querySelector("img") != null)
		.map(el => el.parentElement);
};
const getContainedPostElements = (element: HTMLElement): HTMLElement[] => {
	if (element.tagName == "ARTICLE")  return [element];
	return Array.from(element.querySelectorAll("article"));
};
const getContainedStoryElements = (element: HTMLElement): HTMLElement[] => {
	//the story element is a <section> with classes _s7gs2  _d9zua (11.04.2018)
	//it has a header, and an explicit width
	if (element.tagName == "SECTION" && Array.from(element.children).findIndex(el => el.tagName == "HEADER") > 0) {
		return [element];
	}
	else {
		return Array.from(element.querySelectorAll("header")).map(el => el.parentElement);
	}
};

class ObservedElementType {
	onAdded: (element: HTMLElement) => void = null;
	onRemoved: (element: HTMLElement) => void = null;
	getContainedElements: (parent: HTMLElement) => HTMLElement[] = null;
	elementType: InstaElementType = null;

	constructor(
		elementType: InstaElementType, 
		getContainedElements: (parent: HTMLElement) => HTMLElement[], 
		onAdded: (element: HTMLElement) => void, 
		onRemoved: (element: HTMLElement) => void ){
		
		this.onAdded = onAdded;
		this.onRemoved = onRemoved;
		this.getContainedElements = getContainedElements;
		this.elementType = elementType;
	}

	matchesType(elementTypes: InstaElementType[]): boolean {
		return elementTypes.includes(this.elementType);
	}
}
const observedElementTypes = [
	new ObservedElementType("post", getContainedPostElements, onPostAdded, onPostRemoved),
	new ObservedElementType("preview", getContainedPreviewElements, onPreviewAdded, onPreviewRemoved),
	new ObservedElementType("story", getContainedStoryElements, onStoryAdded, onStoryRemoved),
];
function invokeListener(name: string, element: HTMLElement){
	instaChangeDetector.dispatchEvent(new CustomEvent(name, { detail: { element } }))
}

//preview ###
function onPreviewAdded(previewElement: HTMLElement){
	invokeListener("onPreviewAdded", previewElement);
}
function onPreviewRemoved(previewElement: HTMLElement){
	invokeListener("onPreviewRemoved", previewElement);
}   

//post ###
function onPostAdded(postElement: HTMLElement){
	// setupPostSrcChangeObserver(postElement);
	invokeListener("onPostAdded", postElement);
}
function onPostRemoved(postElement: HTMLElement){
	invokeListener("onPostRemoved", postElement);
}


//post change observation. when a post is opened by clicking a preview element,
//the post-source can change, either when clicking the next or previous button, 
//or when it's a collection

// let postChangeCallbackData = new WeakMap();
// function addOnPostSrcChanged(postElement, callback){
// 	return;
// 	if (!postChangeCallbackData.has(postElement)){
// 		let mediaElement = findMediaElementInPost(postElement);
// 		let data = {
// 			callbacks: [],
// 			currentMediaElement: mediaElement
// 		};
// 		postChangeCallbackData.set(postElement, data);
// 	}
// 	postChangeCallbackData.get(postElement).callbacks.push(callback);
// }
// instaChangeDetector.addOnPostSrcChanged = addOnPostSrcChanged;
// function onPostMutation(mutations){
	
// 	return;
// 	let postData = postChangeCallbackData.get(this);
// 	let oldMediaElement = postData.currentMediaElement;
// 	let newMediaElement = findMediaElementInPost(this);
// 	if (newMediaElement.src != oldMediaElement.src){

// 		postData.callbacks.forEach(callback => callback());
// 		postData.currentMediaElement = newMediaElement;
// 	}
// }
// function setupPostSrcChangeObserver(postElement){
// 	//let observer = new MutationObserver(onPostMutation.bind(postElement));
// 	//observer.observe(postElement, { childList: true, subtree: true });
// }


//story ###
function onStoryAdded(storyElement: HTMLElement){
	invokeListener("onStoryAdded", storyElement);
}
function onStoryRemoved(storyElement: HTMLElement){
	invokeListener("onStoryRemoved", storyElement);
}



//mutation observer ###

function onNodeExistenceChanged(node: HTMLElement, added: boolean){
	if (node.nodeType != 1)return;

	let elementTypes = getElementTypesOnCurrentPage();
	for (let observer of observedElementTypes){
		if (observer.matchesType(elementTypes)){
			let contained = observer.getContainedElements(node);
			let foreachFunc = added ? observer.onAdded : observer.onRemoved;
			contained.forEach(foreachFunc);
		}
	}
}
function onNodeAdded(addedNode: HTMLElement){
	onNodeExistenceChanged(addedNode, true);
}
function onNodeRemoved(removedNode: HTMLElement){
	onNodeExistenceChanged(removedNode, false);
}

function onMutation(mutation: MutationRecord){
	mutation.addedNodes.forEach(onNodeAdded);
	mutation.removedNodes.forEach(onNodeRemoved);
}

function onMutations(mutationArray: MutationRecord[]){
	mutationArray.forEach(onMutation);
}

function startObservation(){
	var observer = new MutationObserver(onMutations);
	observer.observe(document, { childList: true, subtree: true });
}

function initCurrentElements(){
	onNodeAdded(document.body);
}



function start(){
	initCurrentElements();
	startObservation();
}
instaChangeDetector.start = start;

export default instaChangeDetector;