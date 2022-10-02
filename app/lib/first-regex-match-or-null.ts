import { flow } from "fp-ts/es6/function";
import { none, some } from "fp-ts/es6/Option";

export function getFirstMatchOrNull(result: RegExpExecArray | null){
	if (!result) return null;
	return result[0];
}

export function firstRegexResult(result: RegExpExecArray | null){
	if (!result) return none;
	return some(result[0]);
}

export const makeRegexFn = (regex: RegExp) => flow(
	(str: string) => regex.exec(str),
	firstRegexResult
)