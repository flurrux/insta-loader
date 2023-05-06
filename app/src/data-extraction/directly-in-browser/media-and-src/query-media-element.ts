import { pipe } from "fp-ts/es6/function";


function queryLargestImage(parent: HTMLElement){
	return pipe(
		parent.querySelectorAll("img"),
		Array.from,
		(array: HTMLImageElement[]) => array.find( img => img.naturalWidth > 400 )
	)
};

export function queryMediaElement(parent: HTMLElement){
	return parent.querySelector("video") ?? queryLargestImage(parent);
};