
export function replaceReelLinksByPosts(e: unknown){
	const element = (e as any).detail.element;
	const linkElement = element.querySelector("a");
	if (!linkElement){
		console.warn(
			"Attempted to replace /reel/ by /p/, but could not find a link element. Here is the supposed parent:",
			element
		);
	}
	
	const url = linkElement.href;
	if (!url || !url.includes("/reel/")){
		return;
	}
	
	linkElement.href = url.replace("/reel/", "/p/");
}

