import { Option, none, some } from "fp-ts/es6/Option";

export function getOwnUsername(): Option<string> {
	const match = /(?<="username":")[^"]*/.exec(document.body.innerHTML);
	if (!match) return none;
	return some(match[0]);
};