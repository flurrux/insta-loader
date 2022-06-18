
export function findStoryElement() {
	const parent = document.body;
	const firstCanvas = parent.querySelector("button canvas");
	if (!firstCanvas) return;

	let currentChild = firstCanvas.parentElement;
	if (currentChild === null) return;
	// why is typescript not narrowing to type of `currentChild`??

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
}