import { Lazy } from 'fp-ts/es6/function';
import { isSome, Option } from 'fp-ts/es6/Option';
import { waitMillis } from './delay';

export async function attemptRepeatedly<R>(millisDelta: number, maxAttempt: number, attemptFunc: Lazy<Option<R>>): Promise<R> {
	for (let i = 0; i < maxAttempt; i++) {
		const result = attemptFunc();
		if (isSome(result)) return result.value;
		await waitMillis(millisDelta);
	}
	throw 'attempt was unsuccessful';
}