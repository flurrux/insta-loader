import { Option, isNone, none, some } from "fp-ts/es6/Option";

export function findDeepPropertyByKey(key: string, root: any): Option<any> {
	if (typeof (root) !== "object") return none;

	if (Array.isArray(root)) {
		for (const item of root) {
			const subResult = findDeepPropertyByKey(key, item);
			if (isNone(subResult)) continue;
			return subResult;
		}
	}

	for (const [subKey, value] of Object.entries(root)) {
		if (subKey !== key) {
			const subResult = findDeepPropertyByKey(key, value);
			if (isNone(subResult)) continue;
			return subResult;
		}

		return some(value);
	}

	return none;
}