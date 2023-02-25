
export type VersionItem = {
	width: number,
	height: number,
	url: string
};

export type VideoItem = {
	"carousel_media": null,
	"video_versions": VersionItem[],
	"image_versions2": {
		"candidates": VersionItem[]
	},
	"video_dash_manifest": string | null
};
export type ImageItem = {
	"carousel_media": null,
	"video_versions": null,
	"video_dash_manifest": string | null

	"image_versions2": {
		"candidates": VersionItem[]
	}
};
export type VideoOrImgItem = VideoItem | ImageItem;

export type CarouselItem = {
	"video_versions": null,
	"image_versions2": null,
	"carousel_media": VideoOrImgItem[]
};



// type SplitVideoAudioInfo = {
// 	videoSrc: string,
// 	audioSrc: string
// };
type VideoOrImgInfoBase = {
	src: string,
	previewSrc: string
};
export type VideoInfo = VideoOrImgInfoBase & { type: "video" };
export type ImgInfo = VideoOrImgInfoBase & { type: "image" };
export type VideoOrImgInfo = VideoInfo | ImgInfo;


export type PostType = "collection" | "video" | "image";

export type MediaInfo = {
	username: string,
	postType: PostType,
	mediaArray: VideoOrImgInfo[]
}

export type SingleMediaInfo = {
	username: string,
	src: string,
	type: "video" | "image"
}