
const urlHead = "https://www.instagram.com/api/v1/";

export function makeApiUrl(tail: string){
	return `${urlHead}${tail}`;
}