import { InstaElementType, getElementTypesOnCurrentPage } from "../insta-info-util";
import { createFileNameByUrl } from "../../lib/url-to-filename";
import { downloadResource } from "../../lib/prompt-download-util";
import { createElementByHTML } from "../../lib/html-util";

const chrome = (window as any).chrome;

const getDownloadIconSrc = (iconAppendix: string): string => {
	return chrome.extension.getURL(`icons/download-icon-${iconAppendix}.png`);
};
const getPromptDownloadIcon = (type: InstaElementType): string => {
	let elementTypes = getElementTypesOnCurrentPage();
	let elementType = elementTypes[0];
	let iconAppendixMap = {
		preview: "white",
		post: "dark",
		story: "white"
	};
	let iconAppendix = iconAppendixMap[elementType];
	let src = getDownloadIconSrc(iconAppendix);
	return src;
};
const downloadFileDirectly = async (getMediaSrc: () => Promise<string>) => {
	try {
		const src = await getMediaSrc();
		const fileName = createFileNameByUrl(src);
		await downloadResource(src, fileName);
	}
	catch (e) {
		console.error(e);
	}
};
const createPromptDownloadButton = (getMediaSrc: () => Promise<string>): HTMLElement => {
	const button = createElementByHTML(`
		<a style="width: fit-content; height: fit-content; cursor: pointer;">
			<img src=${getPromptDownloadIcon(getElementTypesOnCurrentPage()[0])}></img>
		</a>
	`);
	button.addEventListener("click", () => downloadFileDirectly(getMediaSrc));

	return button;
};