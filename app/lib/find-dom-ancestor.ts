import { Option, none, some } from "fp-ts/es6/Option";
import { Predicate } from "fp-ts/es6/Predicate";

export function findInAncestors(predicate: Predicate<HTMLElement>, element: HTMLElement): Option<HTMLElement> {
	let curElement = element;
	for (let i = 0; i < 1000; i++) {
		if (predicate(curElement)) {
			return some(curElement);
		}
		const nextElement = curElement.parentElement;
		if (!nextElement) return none;
		curElement = nextElement;
	}
	return none;
}