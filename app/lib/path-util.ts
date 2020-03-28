
export const joinPaths = (path1: string, path2: string): string => {
	if (path1.endsWith("/")) return path1 + path2;
	return `${path1}/${path2}`;
};