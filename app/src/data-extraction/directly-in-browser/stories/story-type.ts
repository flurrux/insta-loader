
export function getCurrentStoryType(){
	const { pathname } = location;
	if (pathname.startsWith("/stories/highlights/")){
		return "highlight_reel";
	}
	return "user_reel";
}