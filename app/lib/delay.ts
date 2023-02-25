export function waitMillis(millis: number) {
	return new Promise((resolve) => setTimeout(resolve, millis));
}