
export function findStoryElement() {
	const parent = document.body;
	const firstCanvas = parent.querySelector("button canvas");
	if (!firstCanvas) return;

	let currentChild = firstCanvas.parentElement;
	if (currentChild === null) return;
	
	let currentElement = currentChild;

	for (let a = 0; a < 10000; a++) {
		const currentParent = currentElement.parentElement;
		if (!currentParent) {
			return;
		}
		if (currentParent.offsetHeight - currentElement.offsetHeight < 0) {
			return currentParent;
		}
		currentElement = currentParent;
	}
	console.warn("either something went wrong or the dom is very large");
}