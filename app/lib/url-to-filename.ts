export const createFileNameByUrl = (url: string): string => {
	const endings = [".mp4", ".jpg"];
	for (let ending of endings) {
		const index = url.indexOf(ending);
		if (index >= 0) {
			let filename = url.substring(0, index + ending.length);
			filename = filename.substring(filename.lastIndexOf("/") + 1);
			return filename;
		}
	}
};