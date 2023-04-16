<div align="center">
  <img src="https://contentful-richtext-converter.netlify.app/favicon.svg" width="120" alt="Contentful RichText Converter Logo" />
  <h1>Contentful RichText Converter</h1>
  <p>HTML to RichText and back again.</p>
  <a href="https://www.npmjs.com/package/contentful-richtext-converter">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/contentful-richtext-converter">
  </a>
  <a href="https://www.npmjs.com/package/contentful-richtext-converter">
    <img src="https://img.shields.io/npm/types/contentful-richtext-converter" alt="Types Typescript" />
  </a>
  <a href="https://www.npmjs.com/package/contentful-richtext-converter">
    <img src="https://img.shields.io/npm/l/contentful-richtext-converter" alt="NPM License" />
  </a>
  <br/>
  <a href="https://contentful-richtext-converter.netlify.app">
    <img src="https://img.shields.io/netlify/d1afdd0d-9141-45a8-b330-08889fde867c" alt="Playground on Netlify" />
  </a>
  <a href="https://github.com/t00bstAr/contentful-richtext-converter">
    <img src="https://img.shields.io/github/stars/t00bstAr/contentful-richtext-converter?style=social" alt="GitHub Stars" />
  </a>
</div>

<br/><br/>

This is a module build to convert HTML data into the Contentful ready RichText JSON, and convert RichText back to HTML. 
It is intended to be used during migrations or when working with the Contentful Management API.

It handles all kinds of features and usecases to ensure full functionality with all of the aspects of the Contentful RichText Editor.
Some are easy, *some a quirky* - but it's a working progress.

Use at your own risk :)

## 🚀 Playground

**Want to try it out?**

[Jump to the Playground](https://contentful-richtext-converter.netlify.app/) where you can "write" or "copy-paste" a chunk of HTML and instantly get RichText JSON back. 

Try it out, and get busy coding :)

## 🔎 Current Status

The project is currently still a working progress with possible future changes, but currently set up to support both ESM (browser) and CommonJS with node.
The functionality is somewhat feature complete, but further testing, typescript and even better implementations will be coming in the near future.

## ⚙️ Installation

Using [npm](https://www.npmjs.com/package/contentful-richtext-converter):


```sh
npm i contentful-richtext-converter
```

### Usage (HTML to RichText)

#### Node (CommonJS)

```js
const { htmlToRichText } = require("contentful-richtext-converter");
const html = '<p>Hello <strong>World</strong></p>';
const result = htmlToRichText(html);
```

#### Browser (ESM)

```js
import { htmlToRichText } from 'contentful-richtext-converter';
const html = '<p>Hello <strong>World</strong></p>';
const result = htmlToRichText(html);
```

####  Output:

```json
{
    "nodeType": "document",
    "data": {},
    "content": [
        {
            "nodeType": "paragraph",
            "data": {},
            "content": [
                {
                    "nodeType": "text",
                    "value": "Hello ",
                    "marks": [],
                    "data": {}
                },
                {
                    "nodeType": "text",
                    "value": "World",
                    "marks": [
                        {
                            "type": "bold"
                        }
                    ],
                    "data": {}
                }
            ]
        }
    ]
}
```

You might also need to validate and test an HTML output from the RichText data.
This is just a simple RichText to HTML output. It allows to output - and work with all basic HTML elements of the RichText editor and supports hyperlinks, 
but isn't the "current" solution for deeper outputs with Entry blocks, Assets and Inline Entries. This will be covered later on, but for now this is just a simple conversion.

### Usage (RichText to HTML)

#### Node (CommonJS)

```js
const { richTextToHtml } = require("contentful-richtext-converter");
const json = {"nodeType": "document", "data": {}, "content": [{"nodeType": "paragraph", "data": {}, "content": [{"nodeType": "text", "value": "Hello ", "marks": [], "data": {}}, {"nodeType": "text", "value": "World", "marks": [{"type": "bold"}], "data": {}}]}]};
const result = richTextToHtml(json);
```

#### Browser (ESM)

```js
import { richTextToHtml } from 'contentful-richtext-converter';
const json = {"nodeType": "document", "data": {}, "content": [{"nodeType": "paragraph", "data": {}, "content": [{"nodeType": "text", "value": "Hello ", "marks": [], "data": {}}, {"nodeType": "text", "value": "World", "marks": [{"type": "bold"}], "data": {}}]}]};
const result = richTextToHtml(json);
```

####  Output:

```html
<p>Hello <strong>World</strong></p>
```

## ✨ Features
The ```htmlToRichText(html,options)``` function takes to parameters:

```html``` is a string of HTML

```options``` is an Object to enable or disable default settings for html manipulation.

The default settings:

```json
{
    "fixTagsAndSpaces": true,
    "removeDivsAndSpan": true
}
```

These features are enabled by default, but can be set to false with the options parameter.

```fixTagsAndSpaces``` does a basic cleanup, closing tags and removing unwanted spacing.

```removeDivsAndSpan``` removes all elements of type ```DIV``` and ```SPAN``` - leaving only the flat valid HTML structure for the RichText JSON.

Though when a DIV or SPAN has a ```data-sys-id``` it can be used to automatically convert the element to a Entry Block or Inline Entry.

This will be covered later on, when thoroughly tested.

___

## 😺 Git Repository

https://github.com/t00bstAr/contentful-richtext-converter
