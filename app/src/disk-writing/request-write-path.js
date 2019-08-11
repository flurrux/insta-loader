let requestPending = false;
let requestResolve = null;
window.addEventListener("message", e => {
	if (!requestPending){
		return;
	}
	if (e.data.type !== "write path response"){
		return;
	}
	requestResolve(e.data.writePath);
	requestPending = false;
});

const requestWritePath = (data) => {
	if (requestPending){
		return;
	}
	requestPending = true;
	const writePathPromise = new Promise((resolve) => requestResolve = resolve);
	window.postMessage({ type: "request write path", args: data });

	return writePathPromise;
};
export default requestWritePath;