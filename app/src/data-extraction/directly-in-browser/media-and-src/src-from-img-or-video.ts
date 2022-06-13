import { VideoOrImageElement } from "../../media-types";
import { getHighestQualityFromSrcset } from "./srcset-util";


type SrcData = {
	type: "video" | "image",
	src: string
}

function getImageSrc(img: HTMLImageElement): string {
	if (img.srcset.length === 0) return img.src;
	return getHighestQualityFromSrcset(img.srcset);
}

export function getMediaSrc(mediaElement: VideoOrImageElement): SrcData {
	const type = mediaElement.tagName === "VIDEO" ? "video" : "image";
	const src = type === "image" ? getImageSrc(mediaElement as HTMLImageElement) : mediaElement.src;
	return { type, src };
};