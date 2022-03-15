import { Either, left, right } from "fp-ts/lib/Either";


/*
	this module is for extracting the filename-part of a url like this: 

	https://instagram.fscn1-1.fna.fbcdn.net/v/t51.2885-15/257985981_434541238287510_1109862919694054404_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fscn1-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=Y_4uVD77RVsAX-lX1vW&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjcwNzgwODk5OTk0MjY5MDgzMA%3D%3D.2-ccb7-4&oh=00_AT_Rgq8bvbBtjb5tzFmB3SY7RGHOtxgY490WFKAF2RvWlg&oe=62372FB5&_nc_sid=83d603

	↓

	257985981_434541238287510_1109862919694054404_n.jpg

	---
	
	currently there are only 3 supported file-extensions: .mp4, .jpg, and .webp
	i've revamped this module after discovering that instagram added .webp files and this led to downloaded images being named "undefined". 
	it would certainly be more robust to find a regex for arbitrary file-extensions but i don't know how at this point. next time instagram adds another filetype maybe. 

	---

	note that all file-extension strings in this module include the leading dot:
	NOT "jpg" -> BUT ".jpg"
*/


// example: [".mp4", ".jpg", ".webp"] -> "\.mp4|\.jpg|\.webp"
// useful for constructing lookbehinds and also regexes that check if an url contains these file-extensions. 
function makeFileExtensionRegexPart(fileExtensions: string[]): string {
	return fileExtensions.map(ext => `\\${ext}`).join("|");
}

function makeFileNameRegex(fileExtensions: string[]){
	// this regex looks for text between any forward slash "/" and some file-extension like ".jpg"
	// (?<=\/) is a positive lookbehind, so the initial "/"
	// .* matches any character except newlines
	// the last part (?=${fileExtPart}) is a positive lookahead for our fileExtensions
	const fileExtPart = makeFileExtensionRegexPart(fileExtensions);
	return new RegExp(`(?<=\/).*(?=${fileExtPart})`);
}

function urlIncludesFileExtension(fileExtensions: string[], url: string) {
	const fileExtensionRegex = new RegExp(makeFileExtensionRegexPart(fileExtensions));
	return fileExtensionRegex.exec(url) !== null;
}

const extractFileNameByRegexAndFileExtensionsAndUrl = (regex: RegExp, fileExtensions: string[]) => (url: string): Either<string, string> => {
	const fileName = regex.exec(url);
	if (fileName !== null) return right(fileName[0]);

	// at this point, we could not extract a filename for unknown reason. 
	// let's check if the url contains any of the file-extensions: 
	if (!urlIncludesFileExtension(fileExtensions, url)) {
		return left(`the url '${url}' does not contain any of the expected file-extensions: ${fileExtensions.join(", ")}`);
	}

	return left(`could not extract a filename from the url '${url}' although it appears to contain a valid file-extension.`);
};

// this functions caches the regex so it doesn't have to be recreated everytime we download a file
const makeFileNameExtractor = (fileExtensions: string[]) => {
	return extractFileNameByRegexAndFileExtensionsAndUrl(
		makeFileNameRegex(fileExtensions),
		fileExtensions
	)
};

export const createFileNameByUrl = makeFileNameExtractor([".mp4", ".jpg", ".webp"]);