import { runtime, notifications } from "webextension-polyfill";

interface NotificationArgs {
	iconUrl: string,
	title: string,
	message: string
};

runtime.onMessage.addListener(
	(request) => {
		if (request.type !== "show-notification") return;
		notifications.create(
			undefined, 
			{
				type: "basic",
				...request.notification
			}
		);
	}
);