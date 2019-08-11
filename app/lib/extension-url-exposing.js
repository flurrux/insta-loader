const scriptElement = document.createElement("script");
scriptElement.innerHTML = `
	{
		const baseUrl = "${chrome.extension.getURL("")}";
		window.getInstaExtensionUrl = (localUrl) => baseUrl + localUrl;
	}
`;
document.body.appendChild(scriptElement);
