import { fromNullable, Option } from 'fp-ts/es6/Option';
import { attemptRepeatedly } from './attempt-repeatedly';


function querySelect(root: HTMLElement, query: string): Option<Element> {
	return fromNullable(root.querySelector(query));
}

export async function waitForElementExistence(millisDelta: number, maxAttempt: number, root: HTMLElement, query: string): Promise<Element> {
	return attemptRepeatedly(
		millisDelta, maxAttempt,
		() => querySelect(root, query)
	);
}