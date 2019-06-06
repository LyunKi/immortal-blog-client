export * from './api';
export * from './auth';

export interface IObject {
    [key: string]: any;
}

export type ISyncFunction = (...args: any[]) => any;
export type IAsyncFunction = (...args: any[]) => Promise<any>;
export type IFunction = ISyncFunction | IAsyncFunction;
