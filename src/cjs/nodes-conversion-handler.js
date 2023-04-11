// Specific content handler
const contentHandler = (nodes,parentMarks) => {
	let array = []
	let rows = Array.from(nodes).filter(node => node.nodeName === 'TR')
	if(rows.length > 0){
		for(let i=0; i < rows.length; i++){
			let row = {
				"nodeType": "table-row",
				"data": {},
				"content": Array.from(rows[i].childNodes).map(node => nodesToContentful(node,parentMarks)).filter(el => el !== false)
			}
			array.push(row)
		}
	}else{
		Array.from(nodes).forEach(node => {
			const result = nodesToContentful(node,parentMarks);
			if(result !== false) {
				if(Array.isArray(result)) {
					array = array.concat(result)
				} else {
					array.push(result);
				}
			}
		})
	}
	return array
}

// Recursive nodes to contentful richtext
const nodesToContentful = (node,marks) => {
	const nodeNameMap = {
		'H1': 'heading-1',
		'H2': 'heading-2',
		'H3': 'heading-3',
		'H4': 'heading-4',
		'H5': 'heading-5',
		'H6': 'heading-6',
		'P': 'paragraph',
		'UL': 'unordered-list',
		'OL': 'ordered-list',
		'LI': 'list-item',
		'BLOCKQUOTE': 'blockquote',
		'TABLE': 'table',
		'TH': 'table-header-cell',
		'TD': 'table-cell'
	}
	const markTypeMap = {
		'STRONG': 'bold',
		'B': 'bold',
		'EM': 'italic',
		'I': 'italic',
		'U': 'underline',
		'SUP': 'superscript',
		'SUB': 'subscript',
		'CODE': 'code'
	}
	switch (node.nodeName) {
		case 'H1':
		case 'H2':
		case 'H3':
		case 'H4':
		case 'H5':
		case 'H6':
		case 'P':
		case 'UL':
		case 'OL':
		case 'LI':
		case 'BLOCKQUOTE':
		case 'TABLE':
		case 'TH':
		case 'TD':
			return (contentHandler(node.childNodes).length > 0) ? {
				nodeType: nodeNameMap[node.nodeName],
				data: {},
				content: contentHandler(node.childNodes)
			} : false
		case 'THEAD':
		case 'TBODY':
			return contentHandler(node.childNodes)
		case 'STRONG':
		case 'B':
		case 'EM':
		case 'I':
		case 'U':
		case 'SUP':
		case 'SUB':
		case 'CODE':
			marks = typeof marks !== 'undefined' ? [...marks] : [];
			marks.push({type: markTypeMap[node.nodeName]})
			return contentHandler(node.childNodes, marks)
		case 'A':
			let type = false
			let value = ''
			let data = {}
			let types = {
				entry: 'entry-hyperlink',
				asset: 'asset-hyperlink',
				url: 'hyperlink'
			}
			if(typeof node.dataset.sysId !== 'undefined')
			{
				type = types['entry']
				value = node.dataset.sysId
				data = {
					"target": {
						"sys": {
							"id": value,
							"type": "Link",
							"linkType": "Entry"
						}
					}
				}
			}
			else if(typeof node.href !== 'undefined' && node.href.includes('images.ctfassets.net'))
			{
				type = types['asset']
				value = node.href.split("/")[4]
				data = {
					"target": {
						"sys": {
							"id": value,
							"type": "Link",
							"linkType": "Asset"
						}
					}
				}
			}
			else if(typeof node.href !== 'undefined')
			{
				type = types['url']
				value = node.href
				data = {
					"uri": value
				}
			}
			if(type) {
				return {
					nodeType: type,
					data: data,
					content: [
						{
							nodeType: 'text',
							value: node.textContent,
							marks: [],
							data: {},
						}
					]
				}
			}else{
				return {
					nodeType: 'text',
					value: node.textContent,
					marks: [],
					data: {},
				}
			}
		case 'IMG':
			if(typeof node.src !== 'undefined' && node.src.includes('images.ctfassets.net')){
				let value = node.src.split("/")[4]
				return {
					nodeType: 'embedded-asset-block',
					data: {
						"target": {
							"sys": {
								"id": value,
								"type": "Link",
								"linkType": "Asset"
							}
						}
					},
					content: []
				}
			} else {
				return false
			}
		case 'HR':
			return {
				"nodeType": "hr",
				"data": {},
				"content": []
			}
		case 'DIV':
			if(typeof node.dataset.sysId !== 'undefined'){
				let value = node.dataset.sysId
				return {
					nodeType: "embedded-entry-block",
					data: {
						"target": {
							"sys": {
								"id": value,
								"type": "Link",
								"linkType": "Entry"
							}
						}
					},
					content: []
				}
			}
			else
			{
				return false
			}
		case 'SPAN':
			if(typeof node.dataset.sysId !== 'undefined'){
				let value = node.getAttribute('data-sys-id')
				return {
					nodeType: "embedded-entry-inline",
					data: {
						"target": {
							"sys": {
								"id": value,
								"type": "Link",
								"linkType": "Entry"
							}
						}
					},
					content: []
				}
			}
			else
			{
				return false
			}
		default:
			marks = typeof marks !== 'undefined' ? marks : [];
			if(node.textContent === '\n' || node.textContent === '' || node.textContent === ' ') return false
			let textNode = {
				nodeType: 'text',
				value: node.textContent,
				marks: marks,
				data: {},
			}
			return textNode
	}
}

// Recursive nodes to html
const nodesToHtml = (node) => {
	if (node.nodeType === 'document') {
		return node.content.map(nodesToHtml).join('')
	}
	if (node.nodeType === 'text') {
		let text = node.value
		node.marks.forEach((mark) => {
			switch (mark.type) {
				case 'bold':
					text = `<strong>${text}</strong>`
					break
				case 'italic':
					text = `<em>${text}</em>`
					break
				case 'underline':
					text = `<u>${text}</u>`
					break
				case 'superscript':
					text = `<sup>${text}</sup>`
					break
				case 'subscript':
					text = `<sub>${text}</sub>`
					break
				case 'code':
					text = `<pre><code>${text}</code></pre>`
					break
			}
		})
		return text
	}
	const sub = node.content.map(nodesToHtml).join('')
	let tagNameMap = {
		'paragraph': 'p',
		'heading-1': 'h1',
		'heading-2': 'h2',
		'heading-3': 'h3',
		'heading-4': 'h4',
		'heading-5': 'h5',
		'heading-6': 'h6',
		'unordered-list': 'ul',
		'ordered-list': 'ol',
		'list-item': 'li',
		'text':'span',
		'blockquote': 'blockquote',
		'hr':'hr',
		'table': 'table',
		'table-row': 'tr',
		'table-header-cell': 'th',
		'table-cell': 'td'
	}
	switch (node.nodeType) {
		case 'paragraph':
		case 'heading-1':
		case 'heading-2':
		case 'heading-3':
		case 'heading-4':
		case 'heading-5':
		case 'heading-6':
		case 'list-item':
		case 'ordered-list':
		case 'unordered-list':
		case 'blockquote':
		case 'table':
		case 'table-row':
		case 'table-header-cell':
		case 'table-cell':
			return `<${tagNameMap[node.nodeType]}>${sub}</${tagNameMap[node.nodeType]}>`
		case 'hr':
			return `<hr/>`
		case 'hyperlink':
			return `<a href="${node.data.uri}" target="${node.data.target}" rel="${node.data.rel}">${sub}</a>`
		default:
			return sub
	}
}

module.exports = { nodesToContentful, nodesToHtml }
