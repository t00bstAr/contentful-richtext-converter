"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richTextToHtml = exports.htmlToRichText = void 0;
var moduleType = 'ESM';
if (typeof require !== "undefined" && typeof __dirname !== "undefined") {
    moduleType = 'CJS';
}
var html_manipulation_1 = require("./src/html-manipulation");
var nodes_conversion_handler_1 = require("./src/nodes-conversion-handler");
function htmlToRichText(html, options) {
    var settings = {
        fixTagsAndSpaces: true,
        removeDivsAndSpan: true
    };
    if (typeof options !== 'undefined') {
        Object.entries(options).forEach(function (option) {
            if (typeof settings[option[0]] !== 'undefined') {
                settings[option[0]] = option[1];
            }
        });
    }
    var doc;
    var content = (settings.fixTagsAndSpaces) ? (0, html_manipulation_1.fixTagsAndSpaces)(html) : html;
    if (moduleType === 'CJS') {
        var JSDOM = require("jsdom").JSDOM;
        var dom = new JSDOM();
        doc = new dom.window.DOMParser().parseFromString(content, 'text/html');
    }
    else {
        doc = new DOMParser().parseFromString(content, 'text/html');
    }
    if (settings.removeDivsAndSpan)
        doc.body = (0, html_manipulation_1.removeDivsAndSpans)(doc.body);
    var nodes = Array.from(doc.body.childNodes);
    var contentfulNodes = nodes.map(function (node) {
        return (0, nodes_conversion_handler_1.nodesToContentful)(node);
    }).filter(function (el) { return el !== false; });
    var data = contentfulNodes.length > 0 ? {
        nodeType: 'document',
        data: {},
        content: contentfulNodes
    } : false;
    return data;
}
exports.htmlToRichText = htmlToRichText;
function richTextToHtml(json) {
    if (typeof json.content === 'undefined')
        return '';
    return (0, nodes_conversion_handler_1.nodesToHtml)(json);
}
exports.richTextToHtml = richTextToHtml;
//# sourceMappingURL=contentful-richtext-converter.js.map