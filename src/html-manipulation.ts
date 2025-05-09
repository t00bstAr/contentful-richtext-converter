let moduleType:string = 'ESM';
let cjsDocument:any;
if (typeof require !== "undefined" && typeof __dirname !== "undefined") {
	const {JSDOM} = require("jsdom");
	const dom = new JSDOM()
	cjsDocument = dom.window.document;
	moduleType = 'CJS'
}

// Allowed html
const nodesToAllow:string[] = ['H1','H2','H3','H4','H5','H6','P','UL','OL','LI','BLOCKQUOTE','TABLE','THEAD','TBODY','TFOOT','TR','TH','TD','STRONG','B','EM','I','U','SUP','SUB','CODE','A','IMG','VIDEO','HR','DIV','SPAN']

const Node = {
	ELEMENT_NODE: 1,
	TEXT_NODE: 3
}

// Regex to fix invalid html spaces and tags not suitable for conversion
export function fixTagsAndSpaces(html:string) {
	const regex = /<img([^>]*)>/gi;
	html = html.replace(regex, function(match, p1) {
		if (/\/\s*>$/.test(p1)) {
			return match;
		} else {
			return '<img ' + p1.trim() + ' />';
		}
	}); // Escape Img tags not closed
	html = html.replace(/\\r/g, ''); // Remove backslash R
	html = html.replace(/\\n/g, ''); // Remove backslash N
	html = html.replace(/\n/g, ''); // Remove backslash N
	html = html.replace(/&(?!\w+;)/g, '&amp;'); // Escape AMP
	html = html.replace(/&nbsp;/g, ' '); // Remove none-breaking-space
	html = html.replace(/<br>/g, '<br/>'); // Close breaks
	html = html.replace(/<hr>/g, '<hr/>'); // Close hr
    html = html.replace(/<br\/>/g, '\n'); // Replace BR with new line
	return html;
}

function parentNodeRemover(node:any){
	let parentNode = node.parentNode;
	while (node.firstChild) {
		const child = node.removeChild(node.firstChild);
		if (child.nodeType === Node.ELEMENT_NODE) {
			child.classList.remove(...child.classList);
			parentNode.insertBefore(child, node);
		} else if (child.nodeType === Node.TEXT_NODE) {
			if (child.textContent.trim() !== '') {
				if (parentNode.lastChild === node) {
					parentNode.appendChild(child);
				} else {
					parentNode.insertBefore(child, node);
				}
			}
		}
	}
	parentNode.removeChild(node);
}

// Remove divs and span that doesn't serve a purpose
export function removeDivsAndSpans(node:any) {

	// Remove classes from the current node
	node.classList.remove(...node.classList);

	// Recursively remove divs and spans from child nodes
	if (node.hasChildNodes()) {
		const children = node.childNodes;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.nodeType === Node.ELEMENT_NODE) {
				removeDivsAndSpans(child);
			}
		}
	}

	if(node.nodeType === Node.ELEMENT_NODE && !nodesToAllow.includes(node.nodeName)){
		if(node.nodeName !== 'BODY')
			parentNodeRemover(node)
	}

	if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === "DIV" || node.nodeName === "SPAN")) {

		const dataSysId = node.getAttribute("data-sys-id");
		if (!dataSysId) {
			parentNodeRemover(node)
		}

	} else if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === "LI" || node.nodeName === "TD" || node.nodeName === "TH" || node.nodeName === "BODY")) {

		// Wrap plaintext nodes and non-heading, non-paragraph elements with a p element
		const childNodes = node.childNodes;
		for (let i = 0; i < childNodes.length; i++) {
			const child = childNodes[i];
			if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
				const wrapper = (moduleType === 'CJS') ? cjsDocument : document
				const p = wrapper.createElement("p");
				p.textContent = child.textContent;
				node.replaceChild(p, child);
				i--;
			} else if (child.nodeType === Node.ELEMENT_NODE && !["H1", "H2", "H3", "H4", "H5", "H6", "P", "UL", "OL", "TABLE", "BLOCKQUOTE", "HR", "A", "DIV", "SPAN", "IMG", "VIDEO"].includes(child.nodeName)) {
				const wrapper = (moduleType === 'CJS') ? cjsDocument : document
				const p = wrapper.createElement("p");
				p.appendChild(child.cloneNode(true));
				node.replaceChild(p, child);
				i--;
			}
		}

	}
	return node;
}
