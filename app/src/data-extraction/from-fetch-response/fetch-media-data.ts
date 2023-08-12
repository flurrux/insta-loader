import { sort } from 'fp-ts/es6/Array';
import { isLeft, left, right } from 'fp-ts/es6/Either';
import { flow } from 'fp-ts/es6/function';
import { Ord } from 'fp-ts/es6/number';
import { isSome, none, Option, some } from 'fp-ts/es6/Option';
import { contramap, reverse } from 'fp-ts/es6/Ord';
import { parseDashManifestAndExtractData } from './video-dash-manifest';
import { CarouselItem, MediaInfo, PostType, VersionItem, VideoInfo, VideoOrImgInfo, VideoOrImgItem } from './types';
import { DataItem } from './response-data-type';


const getImageArea = (item: VersionItem) => item.width * item.height;
const versionAreaOrd = contramap<number, VersionItem>(getImageArea)(reverse(Ord));

function getBestQualityVersion(versions: VersionItem[]): string {
	// todo: replace sort by `max` (or `min`)
	const versionsSorted = sort(versionAreaOrd)(versions);
	return versionsSorted[0].url;
}



function getVersions(item: VideoOrImgItem): VersionItem[] {
	if (item["video_versions"]) return item.video_versions;
	return item["image_versions2"]["candidates"];
}

const getMediaSrcFromSingleItem = flow(getVersions, getBestQualityVersion);

function extractVideoAndAudioFromDashManifest(item: VideoOrImgItem): Option<VideoOrImgInfo> {
	if (!item["video_dash_manifest"]) return none;
	const dashDataEither = parseDashManifestAndExtractData(
		item["video_dash_manifest"]
	);
	if (isLeft(dashDataEither)) {
		console.error(dashDataEither.left);
		return none;
	}
	const dashData = dashDataEither.right;
	if (dashData.warnings.length > 0) {
		console.warn(dashData.warnings);
	}
	// if (isNone(dashData.data.audio)) return none;
	return some({
		type: "video",
		src: dashData.data.video.url,
		previewSrc: item["image_versions2"]["candidates"][0]["url"]
		// videoSrc: dashData.data.video.url,
		// audioSrc: dashData.data.audio.value.url
	})
}

export function getMediaInfoFromSingleItem(item: VideoOrImgItem): VideoOrImgInfo {
	if (item["video_versions"]) {
		const manifestExtraction = extractVideoAndAudioFromDashManifest(item);
		if (isSome(manifestExtraction)) {
			return manifestExtraction.value;
		}

		return {
			type: "video",
			src: getBestQualityVersion(item["video_versions"]),
			previewSrc: item["image_versions2"]["candidates"][0].url
		};
	}

	const imgSrc = getBestQualityVersion(item["image_versions2"]["candidates"]);
	return {
		type: "image",
		src: imgSrc,
		previewSrc: imgSrc
	}
}


function getMediaInfoFromCarousel(carousel: CarouselItem): VideoOrImgInfo[] {
	return carousel["carousel_media"].map(getMediaInfoFromSingleItem)
}


export function getMediaInfoFromDataItem(item: DataItem): Either<unknown, MediaInfo> {
	const username: string = item.user.username;

	let mediaArray: VideoOrImgInfo[] = [];

	let postType: PostType = "video";

	if (item["carousel_media"]) {
		postType = "collection";
		mediaArray = getMediaInfoFromCarousel(item);
	}
	else if (item["video_versions"]) {
		postType = "video";
		mediaArray.push(
			getMediaInfoFromSingleItem(item)
		);
	}
	else {
		postType = "image";
		mediaArray.push(
			getMediaInfoFromSingleItem(item)
		);
	}

	if (mediaArray.length === 0) {
		return left('no media found');
	}

	return right({
		postType, mediaArray, username
	});
}

export function getMediaInfoFromResponseObject(responseObject: object): MediaInfo {
	if (!responseObject.items) {
		console.log(responseObject);
		throw 'items not found in dataObject (see above log)';
	}
	const items = responseObject.items;
	if (items.length === 0) {
		throw 'items are empty';
	}
	const item = items[0];
	const username: string = item.user.username;

	let mediaArray: VideoOrImgInfo[] = [];

	let postType: PostType = "video";

	if (item["video_versions"]) {
		postType = "video";
		mediaArray.push(
			getMediaInfoFromSingleItem(item)
		);
	}

	if (item["image_versions2"]) {
		postType = "image";
		mediaArray.push(
			getMediaInfoFromSingleItem(item)
		);
	}

	if (item["carousel_media"]) {
		postType = "collection";
		mediaArray = getMediaInfoFromCarousel(item);
	}

	if (mediaArray.length === 0) {
		throw 'no media found';
	}

	return {
		postType,
		mediaArray,
		username
	} as MediaInfo;
}

const getMediaInfoFromResponseText = (responseText: string): MediaInfo => {
	const dataText = /(?<=window\.__additionalDataLoaded\(.*',).*(?=\);<)/.exec(responseText);
	if (!dataText) throw '__additionalDataLoaded not found on window';
	if (!Array.isArray(dataText)) {
		console.log(dataText);
		throw 'dataText is not an array! (see above log what it actually is, i have no idea)';
	}

	let dataObject = JSON.parse(dataText[0]);
	return getMediaInfoFromResponseObject(dataObject);
};

export async function fetchMediaInfo(url: string): Promise<MediaInfo> {
	const fetchResult = await fetch(url);
	const responseText = await fetchResult.text();
	const data = getMediaInfoFromResponseText(responseText);
	return data;
};