import { Either, left, right } from "fp-ts/es6/Either";

export function tryParseScriptContents(script: HTMLScriptElement): Either<any, any> {
	try {
		return right(
			JSON.parse(script.innerText)
		);
	}
	catch (e) {
		return left(e);
	}
}