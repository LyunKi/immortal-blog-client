import axios from 'axios';
import { API_SERVER, Immortal, METHOD } from '@configs';
import { AnyObject, ApiRequestOptions, IApi, IResponse } from '@interfaces';
import { each, set } from 'lodash';
import {
    generateAuthorizationHeader,
    generateUrlParams,
    Storage,
} from '@utils';

const instance = axios.create({
    baseURL: API_SERVER,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

//try to get the token from storage , and set into axios instance
const token = Storage.getItem<string>('token');

if (token) {
    set(
        instance,
        'defaults.headers.common.Authorization',
        generateAuthorizationHeader(token),
    );
}

// @ts-ignore
const api: IApi = {
    request<T>(options: ApiRequestOptions): Promise<T> {
        return instance(options)
            .catch(error => {
                if (error.response) {
                    return Promise.reject({
                        code: error.response.status,
                        message: error.response.statusText,
                    });
                }
                const errMessage = error.request
                    ? 'Cannot receive response from server'
                    : error.message;
                return Promise.reject({
                    ...Immortal.UnknownError,
                    message: errMessage,
                });
            })
            .then(axiosResponse => {
                const response: IResponse<T> = axiosResponse.data;
                //return the date we needed directly
                if (response.code >= 400) {
                    //if it's a error
                    return Promise.reject({
                        code: response.code,
                        message: response.message,
                    });
                }
                return Promise.resolve(response.data);
            });
    },
};

function produceMethod<T>(method: string) {
    return function(
        beforeUrl: string,
        beforeParams: AnyObject,
        configs: ApiRequestOptions,
    ) {
        const { url, data } = generateUrlParams(beforeUrl, beforeParams);
        return api.request<T>({
            ...configs,
            method,
            url,
            data,
        });
    };
}

each(Reflect.ownKeys(METHOD), method => {
    // @ts-ignore
    api[method] = produceMethod(method);
});

export { api, instance };
