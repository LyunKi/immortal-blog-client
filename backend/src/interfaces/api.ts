import { AxiosRequestConfig } from 'axios';

export interface IApiRequestOptions extends AxiosRequestConfig {}

export interface IResponse<T> {
    code: number;
    data: T;
    message: string;
}

export interface IApi {
    [key: string]: <T>(...args: any[]) => Promise<any>;
    request<T>(...args: any[]): Promise<T>;
    post<T>(...args: any[]): Promise<T>;
    get<T>(...args: any[]): Promise<T>;
    delete<T>(...args: any[]): Promise<T>;
    put<T>(...args: any[]): Promise<T>;
}
