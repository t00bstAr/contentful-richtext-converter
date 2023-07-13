let moduleType = 'ESM';
if (typeof require !== "undefined" && typeof __dirname !== "undefined") {
	moduleType = 'CJS'
}
import {fixTagsAndSpaces, removeDivsAndSpans} from "./src/html-manipulation";
import {nodesToContentful} from "./src/nodes-conversion-handler";
import {nodesToHtml} from "./src/richtext-to-html-handler";

export interface Settings {
    fixTagsAndSpaces: boolean,
    removeDivsAndSpan: boolean
}

export function htmlToRichText(html:string, options?:Partial<Settings>){

	let settings:Settings = {
		fixTagsAndSpaces: true,
		removeDivsAndSpan: true
	}

	if(typeof options !== 'undefined'){
		Object.entries(options).forEach( (option:[keyof Settings, boolean]) => {
			if(typeof settings[option[0]] !== 'undefined'){
				settings[option[0]] = option[1]
			}
		})
	}

	let doc;
	const content = (settings.fixTagsAndSpaces) ? fixTagsAndSpaces(html) : html

	if (moduleType === 'CJS') {
        const {JSDOM} = require("jsdom");
		const dom = new JSDOM()
		doc = new dom.window.DOMParser().parseFromString(content, 'text/html')
	}else{
		doc = new DOMParser().parseFromString(content, 'text/html')
	}

	if(settings.removeDivsAndSpan)
		doc.body = removeDivsAndSpans(doc.body)

	const nodes = Array.from(doc.body.childNodes);

	const contentfulNodes = nodes.map( (node:any) => {
		return nodesToContentful(node)
	}).filter(el => el !== false)

	const data = contentfulNodes.length > 0 ? {
		nodeType: 'document',
		data: {},
		content: contentfulNodes
	} : false

	return data

}
export function richTextToHtml(document:any){
	if(typeof document.content === 'undefined') return ''
	return nodesToHtml(document);
}
