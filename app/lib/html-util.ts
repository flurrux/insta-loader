export const createElementByHTML = (html: string): HTMLElement => {
	const wrapper = document.createElement("div") as HTMLDivElement;
	wrapper.innerHTML = html;
	return wrapper.firstElementChild as HTMLElement;
};