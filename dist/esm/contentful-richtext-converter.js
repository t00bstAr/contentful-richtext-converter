var moduleType = 'ESM';
if (typeof require !== "undefined" && typeof __dirname !== "undefined") {
    moduleType = 'CJS';
}
import { fixTagsAndSpaces, removeDivsAndSpans } from "./src/html-manipulation";
import { nodesToContentful, nodesToHtml } from "./src/nodes-conversion-handler";
export function htmlToRichText(html, options) {
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
    var content = (settings.fixTagsAndSpaces) ? fixTagsAndSpaces(html) : html;
    if (moduleType === 'CJS') {
        var JSDOM = require("jsdom").JSDOM;
        var dom = new JSDOM();
        doc = new dom.window.DOMParser().parseFromString(content, 'text/html');
    }
    else {
        doc = new DOMParser().parseFromString(content, 'text/html');
    }
    if (settings.removeDivsAndSpan)
        doc.body = removeDivsAndSpans(doc.body);
    var nodes = Array.from(doc.body.childNodes);
    var contentfulNodes = nodes.map(function (node) {
        return nodesToContentful(node);
    }).filter(function (el) { return el !== false; });
    var data = contentfulNodes.length > 0 ? {
        nodeType: 'document',
        data: {},
        content: contentfulNodes
    } : false;
    return data;
}
export function richTextToHtml(json) {
    if (typeof json.content === 'undefined')
        return '';
    return nodesToHtml(json);
}
//# sourceMappingURL=contentful-richtext-converter.js.map