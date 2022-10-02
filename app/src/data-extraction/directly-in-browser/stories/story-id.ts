import { pipe } from "fp-ts/es6/function";
import { fromNullable } from "fp-ts/es6/Option";
import { getFirstMatchOrNull } from "../../../../lib/first-regex-match-or-null";

export function findStoryIdInUrl(){
	return pipe(
		location.pathname,
		pathName => /(?<=\/stories\/.*\/)\d*/.exec(pathName),
		getFirstMatchOrNull,
		fromNullable
	)
}