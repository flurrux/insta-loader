
export function tryMultiAndDelayed(tryFunc: () => void, delay: number){
	let timeoutID = -1;
	const tryDelayed = () => {
		if (timeoutID >= 0){
			window.clearTimeout(timeoutID);
		}
		window.setTimeout(
			tryFunc, delay
		);
	};
	return tryDelayed;
}