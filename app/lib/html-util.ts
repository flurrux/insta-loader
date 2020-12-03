export const createElementByHTML = (html: string): HTMLElement => {
	const wrapper = document.createElement("div") as HTMLDivElement;
	wrapper.innerHTML = html;
	return wrapper.firstElementChild as HTMLElement;
};

export function querySelectorAncestor(query: string, el: HTMLElement): HTMLElement {
	let curParent = el;
	for (let i = 0; i < 1000; i++){
		if (curParent.matches(query)){
			return curParent;
		}
		curParent = curParent.parentElement;
	}
	return null;
}