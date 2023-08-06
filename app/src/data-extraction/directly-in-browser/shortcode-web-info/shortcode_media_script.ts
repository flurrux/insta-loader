import { findFirst } from "fp-ts/es6/Array";
import { Either, isLeft, left, right } from "fp-ts/es6/Either";
import { isNone } from "fp-ts/es6/Option";
import { pipe } from "fp-ts/es6/function";
import { DataItem } from "../../from-fetch-response/response-data-type";
import { tryParseScriptContents } from "./parse-script-json";
import { findDeepPropertyByKey } from "./find-deep-property";

export function tryFindWebInfoInPageScripts(): Either<any, DataItem> {
	const key = "xdt_api__v1__media__shortcode__web_info";
	const scriptWithKeyOpt = pipe(
		document.body.querySelectorAll("script"),
		(scripts) => Array.from(scripts),
		findFirst(
			(script) => script.innerText.includes(key)
		)
	);
	
	if (isNone(scriptWithKeyOpt)){
		return left(`could not find any script on this page that contains the string "${key}"`);
	}

	const scriptWithKey = scriptWithKeyOpt.value;
	const scriptObjEith = tryParseScriptContents(scriptWithKey);
	if (isLeft(scriptObjEith)) return scriptObjEith;
	const scriptObj = scriptObjEith.right;

	const webInfoOpt = findDeepPropertyByKey(key, scriptObj);
	if (isNone(webInfoOpt)){
		return left([
			`could not find any property with they key "${key}", weirdly enough`,
			scriptObj
		])
	}

	const webInfo = webInfoOpt.value;
	const items = webInfo.items;
	if (!items || !Array.isArray(items) || items.length === 0){
		return left([
			`the 'items' property on the webInfo object does not exist or is not an array with at least one item`,
			scriptObj
		])
	}

	return right(items[0]);
}