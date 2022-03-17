
export function getIconUrl(iconName: string): string {
	return chrome.runtime.getURL(`assets/icons/${iconName}.png`);
}