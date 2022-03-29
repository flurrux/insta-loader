import { Either, tryCatch, left, right, isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { max, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { Ord } from "fp-ts/lib/number";
import { fromNullable, none, Option } from "fp-ts/lib/Option";
import { contramap } from "fp-ts/lib/Ord";


/*
	reference xml, taken from https://www.instagram.com/p/Cbcy9-boMZ8/

	<MPD 
		xmlns="urn:mpeg:dash:schema:mpd:2011" 
		minBufferTime="PT1.500S" 
		type="static" mediaPresentationDuration="PT0H0M5.941S" maxSegmentDuration="PT0H0M2.000S"
		profiles="urn:mpeg:dash:profile:isoff-on-demand:2011,http://dashif.org/guidelines/dash264"
	>
		<Period duration="PT0H0M5.941S">
			<AdaptationSet 
				segmentAlignment="true" 
				maxWidth="720" 
				maxHeight="900" 
				maxFrameRate="30" 
				par="720:900" 
				lang="und" 
				subsegmentAlignment="true" 
				subsegmentStartsWithSAP="1"
			>
				<Representation 
					id="17898453098552651vd" 
					mimeType="video/mp4" 
					codecs="avc1.64001F" 
					width="720" height="900" 
					frameRate="30" sar="1:1" startWithSAP="1" 
					bandwidth="1533725" FBQualityClass="hd" 
					FBQualityLabel="720w" FBPlaybackResolutionMos="0:100.00,360:94.62,480:90.41,720:76.48"
				>
					<BaseURL urlExpiration="1648676636">
						https://instagram.fscn1-1.fna.fbcdn.net/v/t50.2886-16/276162967_374809297836639_2514563914106085205_n.mp4?_nc_ht=instagram.fscn1-1.fna.fbcdn.net&amp;_nc_cat=103&amp;_nc_ohc=qPMUR5YBGU4AX-2gbpT&amp;edm=AABBvjUBAAAA&amp;ccb=7-4&amp;oh=00_AT-L240eeUnsj2wHyP1Tk2oxog0P9XwRNMZMLrCyRkheTw&amp;oe=6244CF1C&amp;_nc_sid=83d603
					</BaseURL>
					<SegmentBase 
						indexRangeExact="true" indexRange="916-983" 
						FBFirstSegmentRange="984-332809" 
						FBSecondSegmentRange="332810-671279" 
						FBPrefetchSegmentRange="984-671279"
					>
						<Initialization range="0-915"/>
					</SegmentBase>
				</Representation>

				<Representation 
					id="18012636037378673v" mimeType="video/mp4" codecs="avc1.64001F" width="240" height="300" frameRate="30" sar="1:1" startWithSAP="1" bandwidth="139411" FBQualityClass="sd" FBQualityLabel="240w" FBPlaybackResolutionMos="0:100.00,360:33.86,480:22.37,720:13.21"
				>
					<BaseURL urlExpiration="1648671609">
						https://instagram.fscn1-1.fna.fbcdn.net/v/t50.2886-16/277022730_1120918275396595_6748984593543812159_n.mp4?_nc_ht=instagram.fscn1-1.fna.fbcdn.net&amp;_nc_cat=107&amp;_nc_ohc=QcZqs5sdi00AX8DIqZ1&amp;tn=FEu1wceyrb341Q34&amp;edm=AABBvjUBAAAA&amp;ccb=7-4&amp;oh=00_AT9ANE0Fs23Fr1X4ic3FRBKkti4rfyLhwFF7UY95VGJlZg&amp;oe=6244BB79&amp;_nc_sid=83d603
					</BaseURL>
					<SegmentBase 
						indexRangeExact="true" indexRange="915-982" FBFirstSegmentRange="983-31941" FBSecondSegmentRange="31942-65626" FBPrefetchSegmentRange="983-65626"
					>
						<Initialization range="0-914"/>
					</SegmentBase>
				</Representation>

				<Representation 
					id="17956259353658424v" mimeType="video/mp4" codecs="avc1.64001F" width="352" height="440" frameRate="30" sar="1:1" startWithSAP="1" bandwidth="215861" FBQualityClass="sd" FBQualityLabel="352w" FBPlaybackResolutionMos="0:100.00,360:52.35,480:37.58,720:20.69"
				>
					<BaseURL urlExpiration="1648647553">
						https://instagram.fscn1-1.fna.fbcdn.net/v/t50.2886-16/277159045_360091492657151_8777244556821270025_n.mp4?_nc_ht=instagram.fscn1-1.fna.fbcdn.net&amp;_nc_cat=111&amp;_nc_ohc=jSpCg0FC6uMAX9Ddpc0&amp;edm=AABBvjUBAAAA&amp;ccb=7-4&amp;oh=00_AT9m2iQRs2TH1mDDHwb5w3ez5q9_sPFZPT-fftzTZJzi2Q&amp;oe=62445D81&amp;_nc_sid=83d603
					</BaseURL>
					<SegmentBase 
						indexRangeExact="true" indexRange="915-982" FBFirstSegmentRange="983-42367" FBSecondSegmentRange="42368-91083" FBPrefetchSegmentRange="983-91083"
					>
						<Initialization range="0-914"/>
					</SegmentBase>
				</Representation>

				<Representation 
					id="18153795148219262v" mimeType="video/mp4" codecs="avc1.64001F" width="496" height="620" frameRate="30" sar="1:1" startWithSAP="1" bandwidth="339974" FBQualityClass="sd" FBQualityLabel="496w" FBPlaybackResolutionMos="0:100.00,360:68.24,480:55.92,720:33.91"
				>
					<BaseURL urlExpiration="1648639380">
						https://instagram.fscn1-1.fna.fbcdn.net/v/t50.2886-16/277259501_392604682698100_2526476330089834038_n.mp4?_nc_ht=instagram.fscn1-1.fna.fbcdn.net&amp;_nc_cat=104&amp;_nc_ohc=38Cfn0LGcUcAX8OkQaH&amp;tn=FEu1wceyrb341Q34&amp;edm=AABBvjUBAAAA&amp;ccb=7-4&amp;oh=00_AT_cYRd9JcaXNxK6BKwJ97AKarPqQcDMf_njgiV3ZoH7KA&amp;oe=62443D94&amp;_nc_sid=83d603
					</BaseURL>
					<SegmentBase 
						indexRangeExact="true" indexRange="915-982" FBFirstSegmentRange="983-65347" FBSecondSegmentRange="65348-139814" FBPrefetchSegmentRange="983-139814"
					>
						<Initialization range="0-914"/>
					</SegmentBase>
				</Representation>

				<Representation 
					id="17952805828735912v" mimeType="video/mp4" codecs="avc1.64001F" width="688" height="860" frameRate="30" sar="1:1" startWithSAP="1" bandwidth="544221" FBQualityClass="sd" FBQualityLabel="688w" FBPlaybackResolutionMos="0:100.00,360:78.11,480:69.33,720:48.39"
				>
					<BaseURL urlExpiration="1648663712">
						https://instagram.fscn1-1.fna.fbcdn.net/v/t50.2886-16/277020302_311938444191052_3706711486853156796_n.mp4?_nc_ht=instagram.fscn1-1.fna.fbcdn.net&amp;_nc_cat=104&amp;_nc_ohc=CuyNPMSEh8MAX_U5QLa&amp;edm=AABBvjUBAAAA&amp;ccb=7-4&amp;oh=00_AT-vnOgyuK-Gp9KblZJDSULZcWmHNWApxxHm3Ze9Brx2QQ&amp;oe=62449CA0&amp;_nc_sid=83d603
					</BaseURL>
					<SegmentBase 
						indexRangeExact="true" indexRange="916-983" FBFirstSegmentRange="984-108019" FBSecondSegmentRange="108020-224199" FBPrefetchSegmentRange="984-224199"
					>
						<Initialization range="0-915"/>
					</SegmentBase>
				</Representation>

				<Representation 
					id="18105421609304913v" mimeType="video/mp4" codecs="avc1.64001F" width="720" height="900" frameRate="30" sar="1:1" startWithSAP="1" bandwidth="909245" FBQualityClass="hd" FBQualityLabel="720w" FBPlaybackResolutionMos="0:100.00,360:88.94,480:81.79,720:65.30"
				>
					<BaseURL urlExpiration="1648669531">
						https://instagram.fscn1-1.fna.fbcdn.net/v/t50.2886-16/277056353_496554871975308_6901825775329868646_n.mp4?_nc_ht=instagram.fscn1-1.fna.fbcdn.net&amp;_nc_cat=100&amp;_nc_ohc=il6NX06R31EAX8-ZMQc&amp;edm=AABBvjUBAAAA&amp;ccb=7-4&amp;oh=00_AT8ftsemC1Yu_NMnJg_VhxM2kh2LEXBsR3J1GDIUvEwUYA&amp;oe=6244B35B&amp;_nc_sid=83d603
					</BaseURL>
					<SegmentBase 
						indexRangeExact="true" indexRange="916-983" FBFirstSegmentRange="984-187731" FBSecondSegmentRange="187732-381300" FBPrefetchSegmentRange="984-381300"
					>
						<Initialization range="0-915"/>
					</SegmentBase>
				</Representation>
			</AdaptationSet>
			
			<AdaptationSet 
				segmentAlignment="true" lang="und" subsegmentAlignment="true" subsegmentStartsWithSAP="1"
			>
				<Representation 
					id="17911232087329464ad" mimeType="audio/mp4" codecs="mp4a.40.5" audioSamplingRate="44100" startWithSAP="1" bandwidth="79574"
				>
					<AudioChannelConfiguration
						schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="2"
					/>
					<BaseURL urlExpiration="1648653127">
						https://instagram.fscn1-1.fna.fbcdn.net/v/t50.2886-16/277196416_1031375327470700_1980110613022566934_n.mp4?_nc_ht=instagram.fscn1-1.fna.fbcdn.net&amp;_nc_cat=108&amp;_nc_ohc=Uz6l-3DtO-wAX_m7mN0&amp;edm=AABBvjUBAAAA&amp;ccb=7-4&amp;oh=00_AT-o0jmazVwc9Yxv5db-hq_okjWXvMWdEswWoDlUPfDMwA&amp;oe=62447347&amp;_nc_sid=83d603
					</BaseURL>
					<SegmentBase 
						indexRangeExact="true" indexRange="868-947" FBFirstSegmentRange="948-21526" FBSecondSegmentRange="21527-39459" FBPrefetchSegmentRange="948-39459"
					>
						<Initialization range="0-867"/>
					</SegmentBase>
				</Representation>
			</AdaptationSet>
		</Period>
	</MPD>

*/


type MediaData = {
	url: string,
	bandwidth: number
};

type VideoData = MediaData & {
	// dimensions: [number, number]
};

type AudioData = MediaData;

type DashManifestData = {
	video: VideoData,
	audio: AudioData
};



type ElementWithBandwidth = Element;
function getBandwidthOfDocument(element: ElementWithBandwidth): number {
	return parseInt(element.getAttribute("bandwidth") as string);
}
const elementBandwidthOrd = contramap(getBandwidthOfDocument)(Ord);
const maxBandwidthElement = max(elementBandwidthOrd);


/*
	<Representation>
		...
		<BaseURL>
			[url]
		</BaseURL>
		...
	</Representation>

	`BaseURL` does not need to be the first child!
*/
function findBaseUrlContent(element: Element): Either<string, string> {
	const baseUrlNode = element.querySelector("BaseURL");
	if (!baseUrlNode){
		return left("element does not have a child of type BaseURL from which the url could be extracted.");
	}
	const textContent = baseUrlNode.textContent;
	if (textContent === null){
		return left("found a BaseURL-node but its textContent is null");
	}
	return right(textContent);
}


// function getDimensionsOfVideoNode(element: Element): Option<[number, number]>{}

function extractMediaDataFromApationSet(mediaSet: Element): Either<string, MediaData> {
	if (mediaSet.children.length === 0) {
		return left("AdaptionSet has zero child nodes");
	}
	const maxQualityNode = pipe(
		Array.from(mediaSet.children) as NonEmptyArray<Element>,
		// todo: verify that all childnodes have the attribute "bandwidth"
		maxBandwidthElement
	);
	const maxQualityUrlEither = findBaseUrlContent(maxQualityNode);
	if (isLeft(maxQualityUrlEither)) return maxQualityUrlEither;

	return right({
		url: maxQualityUrlEither.right,
		bandwidth: getBandwidthOfDocument(maxQualityNode)
	});
}


function extractMediaData(doc: XMLDocument): Either<string, DashManifestData> {
	const MDPRoot = doc.querySelector("MDP");
	if (MDPRoot === null){
		return left("XMLDocument doc does not have a MDP-node");
	}
	const periodNodes = Array.from(MDPRoot.querySelectorAll("Period"));
	if (periodNodes.length === 0){
		return left("could not find any nodes with the 'Period' tag");
	}
	if (periodNodes.length > 1) {
		// todo: unexpected number of periodNodes
	}
	const periodNode = periodNodes[0];
	const adaptionSets = Array.from(
		periodNode.querySelectorAll("AdaptionSet")
	);

	if (adaptionSets.length === 0){
		return left("found zero AdaptionSets");
	}
	if (adaptionSets.length === 0) {
		// todo: unexpected number of AdaptionSets
	}

	const videoSetIndex = adaptionSets.findIndex(
		(set) => set.hasAttribute("maxFrameRate")
	);
	if (videoSetIndex < 0){
		return left("could not find any AdaptionSets that contain videos, or maybe the attribute 'maxFrameRate' is not indicative of AdaptionSets with videos anymore");
	}
	const videoSet = adaptionSets[videoSetIndex];
	// todo: verify that audioSet really contains audio
	const audioSet = adaptionSets[videoSetIndex === 0 ? 1 : 0];

	const videoDataEither = extractMediaDataFromApationSet(videoSet);
	if (isLeft(videoDataEither)) return videoDataEither;
	
	const audioDataEither = extractMediaDataFromApationSet(audioSet);
	if (isLeft(audioDataEither)) return audioDataEither;

	return right({
		video: videoDataEither.right,
		audio: audioDataEither.right
	});
}

function parseDashManifestString(manifestString: string): Either<Error, XMLDocument> {
	const parser = new DOMParser();
	return tryCatch(
		() => parser.parseFromString(manifestString, "text/xml"),
		e => (e instanceof Error ? e : new Error('unknown error'))
	);
}