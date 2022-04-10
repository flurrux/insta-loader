
/*
	this is an attempt to reconstruct the data-types from a few different fetch responses.

	how to make a fetch request: 
	- pick some instagram post of your choice. important is that the url looks like "https://www.instagram.com/p/Cbcy9-boMZ8/"
	- go to **any** instagram page, open dev-tools and execute the following command in the console: fetch("https://www.instagram.com/p/Cbcy9-boMZ8/").then(response => response.text()).then(console.log)
	this request cannot be made from any webpage, only from the instagram domain
	- copy the result
	- the relevant data occurs after the string "__additionalDataLoaded('/p/Cbcy9-boMZ8/', "
	the second argument, an object, after '/p/Cbcy9-boMZ8/' is where all the interesting data resides and is denoted by `AdditionalData` in this module

	i've saved some responses to './dev/reference-data' for convenience. 
*/


export type AdditionalData = {
	"num_results": number,
	"more_available": boolean,
	"auto_load_more_enabled": boolean,
	"items": [DataItem]
};



type OriginalSize = {
	"original_width": number,
	"original_height": number,
};


type VideoVersion = {
	"id": string,
	"type": number, // examples: 101, 102, 103
	"width": number,
	"height": number,
	"url": string
};

type ImageVersion2Candidate = {
	"width": number,
	"height": number,
	"url": string
};

type ImageVersions2 = {
	"candidates": ImageVersion2Candidate[]
};


// data items ###

type DataItem = CarouselItem | VideoItem | ImageItem;


type DataItemBase = {
	"id": string,
	"code": string,
	"is_unified_video": boolean,
	"device_timestamp": number,
	"taken_at": number,
};


// those types are split up like that because videos and images in `CarouselItem` look almost exactly like those in `VideoItem` or `ImageItem` just without a couple of properties. 

type ImageItemBase = OriginalSize & {
	"media_type": 1,
	"image_versions2": ImageVersions2,
	// "product_type": "feed"
};
type ImageItem = DataItemBase & ImageItemBase & {
	"product_type": "feed"
};



type VideoItemWithoutDashManifest = {
	"media_type": 2,
	"video_duration": number,
	"video_versions": VideoVersion[]
	"image_versions2": {
		"candidates": ImageVersion2Candidate[],
	}
};
type DashManifestAndMore = {
	"is_dash_eligible": number, // 0 for false, 1 for true?
	"video_dash_manifest": string,
	"video_codec": string,
	"number_of_qualities": number,
};
type VideoItemBase = OriginalSize & VideoItemWithoutDashManifest & ({} | DashManifestAndMore);

type VideoItem = DataItemBase & VideoItemBase & {
	"product_type": "feed" | "igtv" | "clips", 
	"has_audio": boolean,
	"image_versions2": {
		"candidates": ImageVersion2Candidate[],
		"additional_candidates": {
			"igtv_first_frame": ImageVersion2Candidate,
			"first_frame": ImageVersion2Candidate
		}
	}
};



type CarouselItem = DataItemBase & {
	"media_type": 8,
	// "product_type": "carousel_container"
	"carousel_media_count": number,
	"carousel_media": (VideoItemBase | ImageItemBase)[],
};
