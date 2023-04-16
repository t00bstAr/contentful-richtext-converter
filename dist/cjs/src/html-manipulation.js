"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDivsAndSpans = exports.fixTagsAndSpaces = void 0;
var moduleType = 'ESM';
var cjsDocument;
if (typeof require !== "undefined" && typeof __dirname !== "undefined") {
    var JSDOM = require("jsdom").JSDOM;
    var dom = new JSDOM();
    cjsDocument = dom.window.document;
    moduleType = 'CJS';
}
var nodesToAllow = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'STRONG', 'B', 'EM', 'I', 'U', 'SUP', 'SUB', 'CODE', 'A', 'IMG', 'VIDEO', 'HR', 'DIV', 'SPAN'];
var Node = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
};
function fixTagsAndSpaces(html) {
    var regex = /<img([^>]*)>/gi;
    html = html.replace(regex, function (match, p1) {
        if (/\/\s*>$/.test(p1)) {
            return match;
        }
        else {
            return '<img ' + p1.trim() + ' />';
        }
    });
    html = html.replace(/\\r/g, '');
    html = html.replace(/\\n/g, '');
    html = html.replace(/\n/g, '');
    html = html.replace(/&(?!\w+;)/g, '&amp;');
    html = html.replace(/&nbsp;/g, ' ');
    html = html.replace(/<br>/g, '<br/>');
    html = html.replace(/<hr>/g, '<hr/>');
    return html;
}
exports.fixTagsAndSpaces = fixTagsAndSpaces;
function parentNodeRemover(node) {
    var _a;
    var parentNode = node.parentNode;
    while (node.firstChild) {
        var child = node.removeChild(node.firstChild);
        if (child.nodeType === Node.ELEMENT_NODE) {
            (_a = child.classList).remove.apply(_a, child.classList);
            parentNode.insertBefore(child, node);
        }
        else if (child.nodeType === Node.TEXT_NODE) {
            if (child.textContent.trim() !== '') {
                if (parentNode.lastChild === node) {
                    parentNode.appendChild(child);
                }
                else {
                    parentNode.insertBefore(child, node);
                }
            }
        }
    }
    parentNode.removeChild(node);
}
function removeDivsAndSpans(node) {
    var _a;
    (_a = node.classList).remove.apply(_a, node.classList);
    if (node.hasChildNodes()) {
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
                removeDivsAndSpans(child);
            }
        }
    }
    if (node.nodeType === Node.ELEMENT_NODE && !nodesToAllow.includes(node.nodeName)) {
        if (node.nodeName !== 'BODY')
            parentNodeRemover(node);
    }
    if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === "DIV" || node.nodeName === "SPAN")) {
        var dataSysId = node.getAttribute("data-sys-id");
        if (!dataSysId) {
            parentNodeRemover(node);
        }
    }
    else if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === "LI" || node.nodeName === "TD" || node.nodeName === "TH" || node.nodeName === "BODY")) {
        var childNodes = node.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var child = childNodes[i];
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                var wrapper = (moduleType === 'CJS') ? cjsDocument : document;
                var p = wrapper.createElement("p");
                p.textContent = child.textContent;
                node.replaceChild(p, child);
                i--;
            }
            else if (child.nodeType === Node.ELEMENT_NODE && !["H1", "H2", "H3", "H4", "H5", "H6", "P"].includes(child.nodeName)) {
                var wrapper = (moduleType === 'CJS') ? cjsDocument : document;
                var p = wrapper.createElement("p");
                p.appendChild(child.cloneNode(true));
                node.replaceChild(p, child);
                i--;
            }
        }
    }
    return node;
}
exports.removeDivsAndSpans = removeDivsAndSpans;
//# sourceMappingURL=html-manipulation.js.map