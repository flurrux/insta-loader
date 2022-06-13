
type QualityAndSource = {
	quality: number,
	src: string
}

function parseSingleQualityAndSrc(entry: string): QualityAndSource {
	const splitted = entry.split(" ");
	return {
		src: splitted[0],
		quality: parseInt(splitted[1])
	}
}

function parseAllQualityAndSrc(srcset: string): QualityAndSource[] {
	return srcset.split(",").map(parseSingleQualityAndSrc);
}

export function getHighestQualityFromSrcset(srcset: string): string {
	const qualityAndSources = parseAllQualityAndSrc(srcset);
	let maxQualIndex = 0;
	for (let i = 1; i < qualityAndSources.length; i++) {
		const curQual = qualityAndSources[i].quality;
		if (curQual > qualityAndSources[maxQualIndex].quality) {
			maxQualIndex = i;
		}
	}
	return qualityAndSources[maxQualIndex].src;
};