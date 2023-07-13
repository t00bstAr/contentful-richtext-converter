import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

// Recursive nodes to html
export const nodesToHtml = (document:any) => {

    console.log(document)

    const options = {
        renderMark: {
            [MARKS.BOLD]: (text:string) => `<strong>${text}</strong>`,
            [MARKS.ITALIC]: (text:string) => `<em>${text}</em>`,
            [MARKS.UNDERLINE]: (text:string) => `<u>${text}</u>`,
            [MARKS.CODE]: (text:string) => `<pre><code>${text}</code></pre>`,
            [MARKS.SUPERSCRIPT]: (text:string) => `<sup>${text}</sup>`,
            [MARKS.SUBSCRIPT]: (text:string) => `<sub>${text}</sub>`
        },
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node:any, next:any) => `<p>${next(node.content)}</p>`,
            [BLOCKS.HEADING_1]: (node:any, next:any) => `<h1>${next(node.content)}</h1>`,
            [BLOCKS.HEADING_2]: (node:any, next:any) => `<h2>${next(node.content)}</h2>`,
            [BLOCKS.HEADING_3]: (node:any, next:any) => `<h3>${next(node.content)}</h3>`,
            [BLOCKS.HEADING_4]: (node:any, next:any) => `<h4>${next(node.content)}</h4>`,
            [BLOCKS.HEADING_5]: (node:any, next:any) => `<h5>${next(node.content)}</h5>`,
            [BLOCKS.HEADING_6]: (node:any, next:any) => `<h6>${next(node.content)}</h6>`,
            [BLOCKS.UL_LIST]: (node:any, next:any) => `<ul>${next(node.content)}</ul>`,
            [BLOCKS.OL_LIST]: (node:any, next:any) => `<ol>${next(node.content)}</ol>`,
            [BLOCKS.LIST_ITEM]: (node:any, next:any) => `<li>${next(node.content)}</li>`,
            [BLOCKS.QUOTE]: (node:any, next:any) => `<blockquote>${next(node.content)}</blockquote>`,
            [BLOCKS.HR]: () => `<hr/>`
        }
    }

    return documentToHtmlString(document, options);

}
