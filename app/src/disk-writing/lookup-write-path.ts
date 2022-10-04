import { storage } from "webextension-polyfill";

interface FolderPathLookupArgs {
	mediaSrc: string,
	userName: string,
	ownUserName: string
};

const getFolderPathByItems = (userName: string, ownUserName: string, items: any): string | null => {
	const directoryRules = items.directoryRules || [];
	directoryRules.reverse();

	const baseDownloadDirectory = items.baseDownloadDirectory || "";

	const unifiedRules = [
		...directoryRules,
		{ baseDirectory: baseDownloadDirectory }
	];

	for (let rule of unifiedRules) {
		const usernamesToMatch = rule.username || [];
		const ownUsernamesToMatch = rule.downloadAs || [];
		const baseDirectory = rule.baseDirectory || "";
		const folderPath = rule.folderPath || "";
		const ruleApplies =
			(usernamesToMatch.length === 0 || usernamesToMatch.includes(userName)) &&
			(ownUsernamesToMatch.length === 0 || ownUsernamesToMatch.includes(ownUserName));
		if (!ruleApplies) {
			continue;
		}

		let writePath = null;
		if (baseDirectory !== "") {
			writePath = `${baseDirectory}/${userName}`;
		}
		if (folderPath !== "") {
			writePath = folderPath;
		}
		if (writePath !== null) {
			return writePath;
		}
	}
	return null;
};

export async function getFolderPath(args: FolderPathLookupArgs) {
	const items = await storage.sync.get({
		baseDownloadDirectory: "",
		directoryRules: []
	});

	const path = getFolderPathByItems(args.userName, args.ownUserName, items);
	if (!path) throw "no path found. have you set a path in the extension-options?";

	return path;
};