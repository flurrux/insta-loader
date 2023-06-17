import { Option, none, some } from "fp-ts/es6/Option";
import { SocialMediaPosting } from "./types";

// my previous methods of obtaining video urls is now broken,
// but Instagram has kindly provided us with the exact
// data we need in the DOM.
// i believe this works only on post pages and not on the mainfeed,
// but i haven't checked yet.

export function findSocialMediaPostingInDom(): Option<SocialMediaPosting> {
	const script = document.querySelector('script[type="application/ld+json"]');
	if (!script) return none;
	
	try {
		const scriptParsed = JSON.parse(script.innerHTML);
		if (typeof(scriptParsed) !== "object") return none;

		// i've seen instances where the parsed result is an array
		// instead of a single object.
		// let's pack the object in an array so that we won't have
		// fragmented logic
		const resultArray = (
			Array.isArray(scriptParsed) ? scriptParsed : [scriptParsed]
		);
		
		const postingItem = resultArray.find(
			(item) => {
				if (typeof(item) !== "object") return false;
				return item["@type"] === "SocialMediaPosting";
			}
		);
		if (!postingItem) return none;

		// TODO: validation of type
		return some(postingItem as SocialMediaPosting);
	}
	catch(e){
		return none;
	}
}