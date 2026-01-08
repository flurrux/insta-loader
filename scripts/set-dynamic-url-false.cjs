
// This node script runs after each build and modifies `manifest.json`
// in the dist folder.
// It sets all `use_dynamic_url` fields under `web_accessible_resources` to false.
// Why? If they are not false, chrome refuses to load any content scripts at runtime.
// 
// I have not written this code. All credits goes to:
// https://github.com/crxjs/chrome-extension-tools/issues/918#issuecomment-2417036333

const fs = require('node:fs')
const path = require('node:path')
const manifest = require('../dist/manifest.json')

const webAccessibleResources = manifest.web_accessible_resources;

const updatedWebAccessibleResources = webAccessibleResources.map(
	(resource) => {
		if (resource.use_dynamic_url) {
			return {
				...resource,
				use_dynamic_url: false,
			}
		}
		return resource
	}
);

manifest.web_accessible_resources = updatedWebAccessibleResources;

const json = JSON.stringify(manifest, null, 2);

fs.writeFileSync(
	path.resolve(__dirname, '../dist/manifest.json'),
	json,
	'utf8'
);
