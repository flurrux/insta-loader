
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
	console.log(msg);
	if (msg.type !== "notification") return;
	chrome.notifications.create(null, {
		type: "basic",
		title: msg.title,
		message: msg.message,
		iconUrl: "icons/instaloader icon 48.png"
	});
});