import { runtime } from 'webextension-polyfill';

export function getIconUrl(iconName: string): string {
	return runtime.getURL(`assets/icons/${iconName}.png`);
}