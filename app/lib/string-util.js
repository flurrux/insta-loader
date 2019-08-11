export const extract = (originalString, startString, startIndexOffset, endString, endStringOffset) => {
	
	var startIndex = originalString.search(startString) + startString.length + startIndexOffset;
	var substring1 = originalString.substring(startIndex, originalString.length);
	var endIndex = substring1.search(endString) + endStringOffset;
	var substring2 = substring1.substring(0, endIndex);
	return substring2;
}