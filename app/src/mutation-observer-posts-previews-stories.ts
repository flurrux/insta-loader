
import { flow, pipe } from 'fp-ts/es6/function';
import { getElementTypesOnCurrentPage, InstaElementType } from './data-extraction/is-currently-post-story-or-preview';
import { getCurrentPageType } from './insta-navigation-observer';
import { findInAncestors } from '../lib/find-dom-ancestor';
import { isSome } from 'fp-ts/es6/Option';


/**
 * this module exposes an object `instaChangeDetector` with which you can do the following:
 * ```typescript
 * instaChangeDetector.addEventListener(
 * 	"onPostAdded", 
 * 	e => injectDownloadButtonsIntoPost((e as any).detail.element)
 * );
 * 
 * instaChangeDetector.addEventListener("onStoryAdded", addDownloadButtonsToStory);
 * 
 * instaChangeDetector.addEventListener("onPreviewAdded", addDownloadButtonsToPreview);
 * ```
 */


interface InstaChangeDetector extends EventTarget {
	start: () => void,
};

const instaChangeDetector = new EventTarget() as InstaChangeDetector;



// ## queries

function getParentElements(elements: HTMLElement[]): HTMLElement[] {
	return elements
		.map(el => el.parentElement)
		.filter(el => el !== null) as HTMLElement[];
}

const queryPreviewElements = flow(
	(root: HTMLElement) => root.querySelectorAll('a[href*="/p/"]'),
	Array.from,
	getParentElements
);

function queryPostElements(element: HTMLElement): HTMLElement[] {
	// article elements seem to only appear on the main feed. 
	if ( getCurrentPageType() === "mainFeed" ){
		if (element.tagName == "ARTICLE")  return [ element ];
		const articles = Array.from( element.querySelectorAll("article") );
		if (articles.length > 0) return articles;
	}
	else {
		// on single post pages, it seems that article elements have been replaced by main elements. 
		if (element.tagName == "MAIN") return [ element ];
		const mains = Array.from( element.querySelectorAll("main") );
		return mains;
	}
	
	return [];
}

function queryStoryElements(root: HTMLElement): HTMLElement[] {

	// the story element is a <section> with classes _s7gs2  _d9zua (11.04.2018)
	// it has a header, and an explicit width
	if (
		root.matches("section") &&
		Array.from(root.children).findIndex(el => el.tagName == "HEADER") > 0
	){
	// stories on the mainfeed seem to have a header element with
	// the authors name, the play button, the mute button, etc.
		return [root];
		
	}

	// otherwise, the header element is a div.
	// we can check if it contains an element with aria-label=Menu,
	// which is a button with 3 horizontal dots.
	// checking for aria-label requires the language to
	// be fixed!
	// for example in german, the aria-label may be different
	// than in english.
	if (root.querySelector("*[aria-label=Menu]")){
		const result = findInAncestors(
			(el) => el.matches("section"),
			root
		);
		if (isSome(result)){
			return [result.value];
		}
	}

	return pipe(
		root.querySelectorAll("header"),
		Array.from,
		getParentElements,
	);
}


// ## observer entries

const invokeListener = (name: string, element: HTMLElement) => {
	instaChangeDetector.dispatchEvent(
		new CustomEvent(name, { detail: { element } })
	)
};

class ObservedElementType {
	getContainedElements: (parent: HTMLElement) => HTMLElement[];
	elementType: InstaElementType;

	constructor(
		elementType: InstaElementType, 
		queryElements: (parent: HTMLElement) => HTMLElement[]){
		
		this.getContainedElements = queryElements;
		this.elementType = elementType;
	}

	matchesType(elementTypes: InstaElementType[]): boolean {
		return elementTypes.includes(this.elementType);
	}

	buildEventName(postFix: string){
		const elType = this.elementType;
		const middle = elType[0].toUpperCase() + elType.slice(1);
		return `on${middle}${postFix}`;
	}

	onAdded(addedElement: HTMLElement){
		invokeListener(this.buildEventName("Added"), addedElement);
	}

	onRemoved(removedElement: HTMLElement) {
		invokeListener(this.buildEventName("Removed"), removedElement);
	}
}

const observedElementTypes = [
	new ObservedElementType("post", queryPostElements),
	new ObservedElementType("preview", queryPreviewElements),
	new ObservedElementType("story", queryStoryElements),
];



//mutation observer ###

function onNodeExistenceChanged(node: HTMLElement, added: boolean){
	if (node.nodeType != 1) return;

	let elementTypes = getElementTypesOnCurrentPage();
	for (let observer of observedElementTypes){
		if (!observer.matchesType(elementTypes)) continue;

		let contained = observer.getContainedElements(node);
		let foreachFunc = added ? observer.onAdded.bind(observer) : observer.onRemoved.bind(observer);
		contained.forEach(foreachFunc);
	}
}

function onNodeAdded(addedNode: Node){
	if (!(addedNode instanceof HTMLElement)) return;
	onNodeExistenceChanged(addedNode, true);
}

function onNodeRemoved(removedNode: Node){
	if (!(removedNode instanceof HTMLElement)) return;
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