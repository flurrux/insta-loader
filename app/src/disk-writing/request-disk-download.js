const requestDiskDownload = (data, callback) => {
	const id = window.performance.now();

	const messageListener = e => {
		if (!e.data || !e.data.type || e.data.type !== "download to disk response" || e.data.id !== id ){
			return;
		}
		const answer = e.data.answer;
		callback(answer);

		if (answer.origin === "native host disconnect"){
			detach();
			return;
		}
		
		const writeFeedback = answer.data[0];
		if (["success", "error"].includes(writeFeedback.type)){
			detach();
			return;
		}
	};
	window.addEventListener("message", messageListener);
	const detach = () => window.removeEventListener("message", messageListener);

	window.postMessage({ 
		type: "request download to disk", 
		id, args: data 
	});
};
export default requestDiskDownload;
