import { createFileNameByUrl } from "./url-to-filename";
import { right } from "fp-ts/es6/Either";

test(
	"extract the filename from a media-url",
	() => {
		expect(
			createFileNameByUrl(
				"https://instagram.fscn1-1.fna.fbcdn.net/v/t51.2885-15/257985981_434541238287510_1109862919694054404_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fscn1-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=Y_4uVD77RVsAX-lX1vW&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjcwNzgwODk5OTk0MjY5MDgzMA%3D%3D.2-ccb7-4&oh=00_AT_Rgq8bvbBtjb5tzFmB3SY7RGHOtxgY490WFKAF2RvWlg&oe=62372FB5&_nc_sid=83d603"
			)
		).toStrictEqual(
			right("257985981_434541238287510_1109862919694054404_n.jpg")
		)
	}
);