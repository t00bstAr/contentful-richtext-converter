export interface Settings {
    fixTagsAndSpaces: boolean;
    removeDivsAndSpan: boolean;
}
export declare function htmlToRichText(html: string, options?: Partial<Settings>): false | {
    nodeType: string;
    data: {};
    content: any[];
};
export declare function richTextToHtml(json: any): any;
