export interface ParentMark {
    type: string;
}
export interface TagNameMap {
    [key: string]: string;
}
export declare const nodesToContentful: (node: any, marks?: [ParentMark]) => any;
export declare const nodesToHtml: (node: any) => any;
