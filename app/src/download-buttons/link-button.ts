import { createElementByHTML } from "../../lib/html-util";
import { getIconUrl } from "./icon-url";

export function makeLinkButton(href: string){
	return createElementByHTML(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		>
			<a 
				href="${href}"
				style="width: fit-content; height: fit-content; cursor: pointer;"
			>
				<img 
					style="width: inherit; height: inherit;"
					src="${getIconUrl("external-link-white")}"
				/>
			</a>
		</div>
	`);
}