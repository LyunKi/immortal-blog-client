export interface IObject {
    [key: string]: any;
}

export type ISyncFunction = (...args: any[]) => any;
export type IAsyncFunction = (...args: any[]) => Promise<any>;
export type IFunction = ISyncFunction | IAsyncFunction;

export type Operator = '>' | '=' | '<';

export interface ISizeChecker {
    type: Operator;
    size: number;
}
export interface IScroll {
    y?: number;
    x?: number;
}
export interface IKeyMap {
    id: string;
    name: string;
}
