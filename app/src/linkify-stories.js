
const onStoryElementAdded = storyNode => {
	const nameSpans = Array.from(storyNode.querySelectorAll("span")).filter(span => !span.hasAttribute("role"));
	if (nameSpans.length > 0){
		const nameSpan = nameSpans[0];
		const name = nameSpan.innerText;
		nameSpan.insertAdjacentHTML("afterend", `
			<a 
				class="${nameSpan.getAttribute("class")}" 
				href="https://www.instagram.com/stories/${name}/"
			>
				${name}
			</a>`
		);
		nameSpan.remove();
	}
};

const getStoryElementFromCanvas = canvas => {
	let parent = canvas;
	for (let a = 0; a < 1000; a++){
		if (parent.matches("button")){
			return parent.parentElement;
		}
		parent = parent.parentElement;
	}
};
const observer = new MutationObserver(mutations => {
	for (const mutation of mutations){
		for (const addedNode of mutation.addedNodes){
			if (!addedNode.querySelector){
				continue;
			}
			const storyCanvas = addedNode.querySelector("button canvas");
			if (storyCanvas){
				onStoryElementAdded(getStoryElementFromCanvas(storyCanvas));
			}
		}
	}
});
observer.observe(document, { childList: true, subtree: true });
Array.from(document.querySelectorAll("button canvas")).map(getStoryElementFromCanvas).forEach(onStoryElementAdded);