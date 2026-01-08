import { defineConfig } from "vite";
import { chromeExtension } from "rollup-plugin-chrome-extension";
import manifest from './manifest.json';

export default defineConfig({
	plugins: [
		chromeExtension({ 
			manifest
		}),
	],
});