const {JSDOM} = require("jsdom");
const {fixTagsAndSpaces, removeDivsAndSpans} = require("./src/cjs/html-manipulation");
const {nodesToContentful, nodesToHtml} = require("./src/cjs/nodes-conversion-handler");
function htmlToRichText(html, options){

	let settings = {
		fixTagsAndSpaces: true,
		removeDivsAndSpan: true
	}

	if(typeof options !== 'undefined'){
		Object.entries(options).forEach(option => {
			if(typeof settings[option[0]] !== 'undefined'){
				settings[option[0]] = option[1]
			}
		})
	}

	let doc;
	const content = (settings.fixTagsAndSpaces) ? fixTagsAndSpaces(html) : html
	const dom = new JSDOM()
	doc = new dom.window.DOMParser().parseFromString(content, 'text/html')

	if(settings.removeDivsAndSpan)
		doc.body = removeDivsAndSpans(doc.body)

	const nodes = Array.from(doc.body.childNodes);

	const contentfulNodes = nodes.map(node => {
		return nodesToContentful(node)
	}).filter(el => el !== false)

	const data = contentfulNodes.length > 0 ? {
		nodeType: 'document',
		data: {},
		content: contentfulNodes
	} : false

	return data

}
function richTextToHtml(json,options){
	if(typeof json.content === 'undefined') return ''
	return nodesToHtml(json);
}
module.exports = { htmlToRichText, richTextToHtml }
