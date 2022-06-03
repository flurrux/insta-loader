
export function getOwnUsername() {
	const match = /(?<="username":")[^"]*/.exec(document.body.innerHTML);
	if (!match) return null;
	return match[0];
};