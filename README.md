# contentful-richtext-converter
This is a module build to convert HTML data into the Contentful ready RichText JSON. 
It was intended to be use during migrations or when working with the Contentful Management API.

It handles all kinds of features and usecases to ensure full functionality with all of the aspects of the contentful RichText Editor.
Some are easy, *some a quirky* 

– but it's a working progress...

This is the initial start of this repo and the module is under developlment.
___
**Use at your own risk :)**
___
## Current Status
This is the initial commit and therefore might be up for multiple changes.

## Installation

Using [npm](https://www.npmjs.com/package/contentful-richtext-converter):

`npm install contentful-richtext-converter`

## Usage

```
import { htmlToRichText } from 'contentful-richtext-converter';
const html = '<p>Hello <strong>World</strong></p>';
const result = htmlToRichText(html);
```

## Output:

```
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


## Git Repository

https://github.com/t00bstAr/contentful-richtext-converter

