export * from './api';
export * from './auth';

export interface AnyObject {
    [key: string]: any;
}

export type ValueOf<T> = T[keyof T];
