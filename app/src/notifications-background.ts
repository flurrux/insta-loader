
interface NotificationArgs {
	iconUrl: string,
	title: string,
	message: string
};

const chrome = (window as any).chrome;
chrome.runtime.onMessage.addListener(
	function (request: any, sender: any, sendResponse) {
		if (request.type !== "show-notification") return;
		chrome.notifications.create(null, {
			type: "basic",
			...request.notification
		});
	}
);