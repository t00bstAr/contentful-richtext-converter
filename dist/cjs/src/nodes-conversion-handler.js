"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodesToHtml = exports.nodesToContentful = void 0;
var contentHandler = function (nodes, parentMarks) {
    var array = [];
    var rows = Array.from(nodes).filter(function (node) { return node.nodeName === 'TR'; });
    if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            var row = {
                "nodeType": "table-row",
                "data": {},
                "content": Array.from(rows[i].childNodes).map(function (node) { return (0, exports.nodesToContentful)(node, parentMarks); }).filter(function (el) { return el !== false; })
            };
            array.push(row);
        }
    }
    else {
        Array.from(nodes).forEach(function (node) {
            var result = (0, exports.nodesToContentful)(node, parentMarks);
            if (result !== false) {
                if (Array.isArray(result)) {
                    array = array.concat(result);
                }
                else {
                    array.push(result);
                }
            }
        });
    }
    return array;
};
var nodesToContentful = function (node, marks) {
    var nodeNameMap = {
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
    };
    var markTypeMap = {
        'STRONG': 'bold',
        'B': 'bold',
        'EM': 'italic',
        'I': 'italic',
        'U': 'underline',
        'SUP': 'superscript',
        'SUB': 'subscript',
        'CODE': 'code'
    };
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
            } : false;
        case 'THEAD':
        case 'TBODY':
            return contentHandler(node.childNodes);
        case 'STRONG':
        case 'B':
        case 'EM':
        case 'I':
        case 'U':
        case 'SUP':
        case 'SUB':
        case 'CODE':
            if (typeof marks !== 'undefined')
                marks = __spreadArray([], marks, true);
            marks.push({ type: markTypeMap[node.nodeName] });
            return contentHandler(node.childNodes, marks);
        case 'A':
            var type = false;
            var value = '';
            var data = {};
            var types = {
                entry: 'entry-hyperlink',
                asset: 'asset-hyperlink',
                url: 'hyperlink'
            };
            if (typeof node.dataset.sysId !== 'undefined') {
                type = types['entry'];
                value = node.dataset.sysId;
                data = {
                    "target": {
                        "sys": {
                            "id": value,
                            "type": "Link",
                            "linkType": "Entry"
                        }
                    }
                };
            }
            else if (typeof node.href !== 'undefined' && node.href.includes('images.ctfassets.net')) {
                type = types['asset'];
                value = node.href.split("/")[4];
                data = {
                    "target": {
                        "sys": {
                            "id": value,
                            "type": "Link",
                            "linkType": "Asset"
                        }
                    }
                };
            }
            else if (typeof node.href !== 'undefined') {
                type = types['url'];
                value = node.href;
                data = {
                    "uri": value
                };
            }
            if (type) {
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
                };
            }
            else {
                return {
                    nodeType: 'text',
                    value: node.textContent,
                    marks: [],
                    data: {},
                };
            }
        case 'IMG':
            if (typeof node.src !== 'undefined' && node.src.includes('images.ctfassets.net')) {
                var value_1 = node.src.split("/")[4];
                return {
                    nodeType: 'embedded-asset-block',
                    data: {
                        "target": {
                            "sys": {
                                "id": value_1,
                                "type": "Link",
                                "linkType": "Asset"
                            }
                        }
                    },
                    content: []
                };
            }
            else {
                return false;
            }
        case 'VIDEO':
            if (typeof node.src !== 'undefined' && node.src.includes('videos.ctfassets.net')) {
                var value_2 = node.src.split("/")[4];
                return {
                    nodeType: 'embedded-asset-block',
                    data: {
                        "target": {
                            "sys": {
                                "id": value_2,
                                "type": "Link",
                                "linkType": "Asset"
                            }
                        }
                    },
                    content: []
                };
            }
            else {
                return false;
            }
        case 'HR':
            return {
                "nodeType": "hr",
                "data": {},
                "content": []
            };
        case 'DIV':
            if (typeof node.dataset.sysId !== 'undefined') {
                var value_3 = node.dataset.sysId;
                return {
                    nodeType: "embedded-entry-block",
                    data: {
                        "target": {
                            "sys": {
                                "id": value_3,
                                "type": "Link",
                                "linkType": "Entry"
                            }
                        }
                    },
                    content: []
                };
            }
            else {
                return false;
            }
        case 'SPAN':
            if (typeof node.dataset.sysId !== 'undefined') {
                var value_4 = node.getAttribute('data-sys-id');
                return {
                    nodeType: "embedded-entry-inline",
                    data: {
                        "target": {
                            "sys": {
                                "id": value_4,
                                "type": "Link",
                                "linkType": "Entry"
                            }
                        }
                    },
                    content: []
                };
            }
            else {
                return false;
            }
        default:
            if (typeof marks !== 'undefined')
                marks = __spreadArray([], marks, true);
            if (node.textContent === '\n' || node.textContent === '' || node.textContent === ' ')
                return false;
            var textNode = {
                nodeType: 'text',
                value: node.textContent,
                marks: marks,
                data: {},
            };
            return textNode;
    }
};
exports.nodesToContentful = nodesToContentful;
var nodesToHtml = function (node) {
    if (node.nodeType === 'document') {
        return node.content.map(exports.nodesToHtml).join('');
    }
    if (node.nodeType === 'text') {
        var text_1 = node.value;
        node.marks.forEach(function (mark) {
            switch (mark.type) {
                case 'bold':
                    text_1 = "<strong>".concat(text_1, "</strong>");
                    break;
                case 'italic':
                    text_1 = "<em>".concat(text_1, "</em>");
                    break;
                case 'underline':
                    text_1 = "<u>".concat(text_1, "</u>");
                    break;
                case 'superscript':
                    text_1 = "<sup>".concat(text_1, "</sup>");
                    break;
                case 'subscript':
                    text_1 = "<sub>".concat(text_1, "</sub>");
                    break;
                case 'code':
                    text_1 = "<pre><code>".concat(text_1, "</code></pre>");
                    break;
            }
        });
        return text_1;
    }
    var sub = node.content.map(exports.nodesToHtml).join('');
    var tagNameMap = {
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
        'text': 'span',
        'blockquote': 'blockquote',
        'hr': 'hr',
        'table': 'table',
        'table-row': 'tr',
        'table-header-cell': 'th',
        'table-cell': 'td'
    };
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
            return "<".concat(tagNameMap[node.nodeType], ">").concat(sub, "</").concat(tagNameMap[node.nodeType], ">");
        case 'hr':
            return "<hr/>";
        case 'hyperlink':
            return "<a href=\"".concat(node.data.uri, "\" target=\"").concat(node.data.target, "\" rel=\"").concat(node.data.rel, "\">").concat(sub, "</a>");
        default:
            return sub;
    }
};
exports.nodesToHtml = nodesToHtml;
//# sourceMappingURL=nodes-conversion-handler.js.map