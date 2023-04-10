# Contentful (to) RichText Converter

[![npm version](https://img.shields.io/npm/v/contentful-richtext-converter)](https://www.npmjs.com/package/contentful-richtext-converter)
[![npm license](https://img.shields.io/npm/l/contentful-richtext-converter)](https://www.npmjs.com/package/contentful-richtext-converter)


This is a module build to convert HTML data into the Contentful ready RichText JSON. 
It is intended to be used during migrations or when working with the Contentful Management API.

It handles all kinds of features and usecases to ensure full functionality with all of the aspects of the Contentful RichText Editor.
Some are easy, *some a quirky* – but it's a working progress...

This is the initial start of this repo and the module is under development.

Use at your own risk :)

## Current Status
This is the initial commit and therefore might be up for breaking changes.

**Update:**
Still undergoing possible changes, but currently set up to support both ESM og CommonJS with browser and node specific verisons.

## Installation

Using [npm](https://www.npmjs.com/package/contentful-richtext-converter):

```sh
npm i contentful-richtext-converter
```

## Usage

```js
import { htmlToRichText } from 'contentful-richtext-converter';
const html = '<p>Hello <strong>World</strong></p>';
const result = htmlToRichText(html);
```

## Output:

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

___

## Features
The ```htmlToRichText(html,options)``` function takes to parameters: 

```html``` is a string of HTML

```options``` is an Object to enable or disable default settings for html manipulation.

The default settings:

```js
{
    fixTagsAndSpaces: true,
    removeDivsAndSpan: true
}
```

These features are enabled by default, but can be set to false with the options parameter.

```fixTagsAndSpaces``` does a basic cleanup, closing tags and removing unwanted spacing.

```removeDivsAndSpan``` removes all elements of type ```DIV``` and ```SPAN``` - leaving only the flat valid HTML structure for the RichText JSON.

Though when a DIV or SPAN has a ```data-sys-id``` it can be used to automatically convert the element to a Entry Block or Inline Entry. 

This will be covered later on, when thoroughly tested. 

___

## Git Repository

https://github.com/t00bstAr/contentful-richtext-converter

