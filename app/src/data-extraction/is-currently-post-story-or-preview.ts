import { getCurrentPageType } from "../insta-navigation-observer";

export type InstaElementType = "preview" | "post" | "story";

export const getElementTypesOnCurrentPage = (): InstaElementType[] => {
	const curPageType = getCurrentPageType();
	if (curPageType === "personFeed") {
		return ["preview"];
	}
	else if (curPageType === "stories") {
		return ["story"];
	}
	return ["post"];
};