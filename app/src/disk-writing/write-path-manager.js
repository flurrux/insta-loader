
const getFolderPath = (mediaSrc, username, ownUsername) => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(
			{
				baseDownloadDirectory: "",
				directoryRules: []
			},
			(items) => {
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
						(usernamesToMatch.length === 0 || usernamesToMatch.includes(username)) &&
						(ownUsernamesToMatch.length === 0 || ownUsernamesToMatch.includes(ownUsername));
					if (!ruleApplies) {
						continue;
					}

					let writePath = null;
					if (baseDirectory !== "") {
						writePath = baseDirectory + "/" + username;
					}
					if (folderPath !== "") {
						writePath = folderPath;
					}
					if (writePath !== null) {
						resolve(writePath);
						return;
					}
				}

				reject("no rules for directly found");
			}
		);
	});
};

//by request
window.addEventListener("message", async event => {
	if (event.data && event.data.type && event.data.type === "request write path"){
		const args = event.data.args;
		const writePath = await getFolderPath(args.mediaSrc, args.username, args.ownUsername);
		window.postMessage({ type: "write path response", writePath });
	}
}, false);