export type SocialMediaPosting = {
	"@type": "SocialMediaPosting",
	articleBody: string,
	author: Person,
	identifier: {
		propertyID: "Post Shortcode",
		value: string
	},
	image: ImageObject[],
	video: VideoObject[]
}

type Person = {
	"@type": "Person",

	name: string, // more like display name

	alternateName: string, // this seems to be the real username, but also could be an alias

	identifier: {
		propertyID: "Username",
		value: string // i suppose use this for foldernames
	} | null,

	image: string, // profile pic maybe

	url: string
}

export type ImageObject = {
	width: string,
	height: string,
	representativeOfPage: boolean,
	url: string
}

export type VideoObject = {
	width: string,
	height: string,
	thumbnailUrl: string,
	contentUrl: string
}