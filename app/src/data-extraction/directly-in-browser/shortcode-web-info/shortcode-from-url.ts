import { none, some } from "fp-ts/es6/Option";

function getShortCodeByCurrentUrl() {
	const pathname = location.pathname;
	if (!pathname.startsWith("/p/")) return none;
	const pathnameTail = pathname.substring(3);
	return some(
		pathnameTail.substring(
			0, pathnameTail.indexOf("/")
		)
	);
}