const {JSDOM} = require("jsdom");
const {fixTagsAndSpaces, removeDivsAndSpans} = require("./src/html-manipulation");
const {nodesToContentful} = require("./src/nodes-conversion-handler");
function htmlToRichText(html, options){

	let settings = {
		fixTagsAndSpaces: true,
		removeDivsAndSpan: true
	}

	if(typeof options !== 'undefined'){
		options.entries.forEach(option => {
			if(typeof settings[option[0]] !== 'undefined'){
				settings[option[0]] = option[1]
			}
		})
	}

	const dom = new JSDOM()
	const content = (settings.fixTagsAndSpaces) ? fixTagsAndSpaces(html) : html
	let doc = new dom.window.DOMParser().parseFromString(content, 'text/html')
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
module.exports = { htmlToRichText }
