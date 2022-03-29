
type VideoVersion = {
	width: number,
	height: number,
	id: string,
	type: number,
	url: string
};

type ImageVersion2Candidate = {
	width: number,
	height: number,
	url: string
};

export type CarouselMedia = {
	id: string,
	carousel_parent_id: string,
	pk: number,
	// usertags
	commerciality_status: string,
	media_type: number,
	number_of_qualities: number,
	original_height: number,
	original_width: number,
	video_codec: string,
	is_dash_eligible: number,
	video_dash_manifest: string,
	video_duration: number,
	video_versions: VideoVersion[],
	image_versions2: {
		candidates: ImageVersion2Candidate[]
	}
};

export type AdditionalData = {
	items: [
		{
			// are these in every AdditionalData or only in carousels?
			carousel_media: CarouselMedia[],
			carousel_media_count: number
		}
	]
};