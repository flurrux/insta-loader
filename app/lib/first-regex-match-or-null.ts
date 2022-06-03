
export function getFirstMatchOrNull(result: RegExpExecArray | null){
	if (!result) return null;
	return result[0];
}