import { Either } from "fp-ts/es6/Either";
import { Lazy } from "fp-ts/es6/function";
import { MediaWriteInfo } from "./download-buttons/disk-download-button";

type MediaFetchFail = {
	userFriendlyMessage: string,
	consoleLoggable: any
}

// TODO: replace `any` by `MediaFetchFail`
export type MediaFetchFn = Lazy<Promise<Either<any, MediaWriteInfo>>>;