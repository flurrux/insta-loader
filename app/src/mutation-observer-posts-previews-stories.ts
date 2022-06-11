
import { flow } from 'fp-ts/lib/function';
import { getElementTypesOnCurrentPage, InstaElementType } from './data-extraction/is-currently-post-story-or-preview';


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
	if (element.tagName == "ARTICLE")  return [element];
	return Array.from(element.querySelectorAll("article"));
}

function queryStoryElements(root: HTMLElement): HTMLElement[] {
	// the story element is a <section> with classes _s7gs2  _d9zua (11.04.2018)
	// it has a header, and an explicit width
	if (root.tagName == "SECTION" && Array.from(root.children).findIndex(el => el.tagName == "HEADER") > 0) {
		return [root];
	}

	return getParentElements(
		Array.from(root.querySelectorAll("header"))
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
		if (observer.matchesType(elementTypes)){
			let contained = observer.getContainedElements(node);
			let foreachFunc = added ? observer.onAdded.bind(observer) : observer.onRemoved.bind(observer);
			contained.forEach(foreachFunc);
		}
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