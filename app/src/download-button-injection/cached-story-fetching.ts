import { Either, isLeft, left, right } from "fp-ts/es6/Either";
import { isNone, none, Option, Some, some } from "fp-ts/es6/Option";
import { findStoryIdInUrl } from "../data-extraction/directly-in-browser/stories/story-id";
import { findCurrentStoryIndex } from "../data-extraction/directly-in-browser/stories/story-index";
import { getCurrentStoryType } from "../data-extraction/directly-in-browser/stories/story-type";
import { getUsernameOfStory } from "../data-extraction/directly-in-browser/stories/username";
import { getMediaInfoFromSingleItem } from "../data-extraction/from-fetch-response/fetch-media-data";
import { VideoOrImgItem } from "../data-extraction/from-fetch-response/types";
import { fetchCurrentUserStoryHighlightWithCurrentHeaders } from "../data-extraction/instagram-api/stories/user-stories-highlights";
import { fetchUserStoryDataWithCurrentHeaders } from '../data-extraction/instagram-api/stories/user-stories-main';
import { fetchUserInfoWithCurrentHeaders, UserInfo } from "../data-extraction/instagram-api/user-info";
import { MediaWriteInfo } from "../download-buttons/disk-download-button";


// ## types ##

type StoryItem = VideoOrImgItem & { pk: string, id: string };

type StoryDataShared = {
	id: string,
	user: UserInfo,
	items: StoryItem[]
}

type HighlightsStoryData = (
	StoryDataShared &
	{ reel_type: "highlight_reel" }
)

type MainStoryData = (
	StoryDataShared & 
	{ reel_type: "user_reel" }
)

type StoryData = (HighlightsStoryData | MainStoryData);

type ReelType = "user_reel" | "highlight_reel";

function getHighlightID(item: HighlightsStoryData): string {
	return item.id.replace("highlight:", "");
}


// ######################


async function fetchMainStoryData(){
	const userNameEith = getUsernameOfStory();
	if (isLeft(userNameEith)) return userNameEith;
	const userName = userNameEith.right;
	const userDataEith = await fetchUserInfoWithCurrentHeaders(userName);
	if (isLeft(userDataEith)) return userDataEith;
	const userData = userDataEith.right;
	const userID = userData.pk.toString();
	const storyData = await fetchUserStoryDataWithCurrentHeaders(userID);
	if (isLeft(storyData)) return storyData;
	return right(
		storyData.right.reels_media[0] as MainStoryData
	);
}

async function fetchHighlightStoryData() {
	const storyData = await fetchCurrentUserStoryHighlightWithCurrentHeaders();
	if (isLeft(storyData)) return storyData;
	return right(
		storyData.right.reels_media[0] as HighlightsStoryData
	);
}

async function fetchCurrentStoryData(): Promise<Either<string, StoryData>> {
	const storyType = getCurrentStoryType();
	if (storyType === "highlight_reel") {
		return fetchHighlightStoryData();
	}
	else {
		return fetchMainStoryData();
	}
	// console.log(`got the story-data! it took ${performance.now() - startTime} milliseconds.`, storyData);
	// return right(storyData);
}

function findMainStoryItem(storyData: MainStoryData): Either<string, StoryItem> {
	// find the story-item by its id:
	const storyIdOpt = findStoryIdInUrl();
	if (isNone(storyIdOpt)) return left(`could not story-id in url ${location.href}`);
	const storyID = storyIdOpt.value;
	const currentStoryItem = storyData.items.find(item => item.pk === storyID);
	if (!currentStoryItem) {
		console.log(storyData.items, storyID);
		return left(`could not find story-ID ${storyID} in any of the fetched story-items`);
	}
	return right(currentStoryItem);
}

function findHighlightStoryItem(storyData: HighlightsStoryData) {
	const itemIndex = findCurrentStoryIndex();
	if (isLeft(itemIndex)) return itemIndex;
	return right(
		storyData.items[itemIndex.right]
	);
}

function findCurrentStoryItem(storyData: StoryData) {
	if (storyData.reel_type === "user_reel"){
		return findMainStoryItem(storyData);
	}
	else {
		return findHighlightStoryItem(storyData);
	}
}

function isStoryCacheStale(cachedData: StoryData): boolean {
	const currentStoryType = getCurrentStoryType();
	if (currentStoryType !== cachedData.reel_type) return true;
	
	// compare the url-id with each cached story-item. if none matches, the cache is stale
	const storyIdOpt = findStoryIdInUrl();
	if (isNone(storyIdOpt)){
		console.warn("trying to check if the current story-cache is stale by searching for the current story item, given the urls id, but could not find an id in the url. are you sure you are watching a story?");
		return true;
	}
	const storyID = storyIdOpt.value;
	return !cachedData.items.some(item => item.pk === storyID);
}

export function makeStoryFetcher() {
	let cachedStoryData: Option<StoryData> = none;

	return async () => {

		if (isNone(cachedStoryData) || isStoryCacheStale(cachedStoryData.value)) {
			console.log("refreshing story cache");
			const storyDataEith = await fetchCurrentStoryData();
			if (isLeft(storyDataEith)) throw storyDataEith.left;
			cachedStoryData = some(storyDataEith.right);
		}

		const storyData = (cachedStoryData as Some<StoryData>).value;
		const storyItemEith = findCurrentStoryItem(storyData);
		if (isLeft(storyItemEith)) return storyItemEith;
		const storyItem = storyItemEith.right;

		const mediaInfo = getMediaInfoFromSingleItem(storyItem);
		const { username } = storyData.user;
		const writeInfo: MediaWriteInfo = {
			src: mediaInfo.src,
			username
		};

		return writeInfo;
	}
}