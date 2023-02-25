import { map as mapArray } from "fp-ts/es6/Array";
import { pipe } from "fp-ts/es6/function";
import { map as mapRecord, toArray } from "fp-ts/es6/Record";

type InterceptedRequestBody = Record<string, string[]>;

export const stringifyRequestBody = (body: InterceptedRequestBody) => pipe(
	body,
	mapRecord(
		(values) => encodeURIComponent(values[0])
	),
	toArray,
	mapArray(([key, value]) => `${key}=${value}`),
	(array) => array.join("&")
);