import produce from 'immer';
import { each } from 'lodash';
import { AnyMap } from '@interfaces';

/**
 * a easy function for parsing url by params
 * @param  url
 * @param params
 */
export const generateUrlParams = (url: string, params: AnyMap) => {
    const pathKey: string[] = [];
    const newUrl = url
        .replace(/:(\w*)/g, (_, key) => {
            pathKey.push(key);
            return params[key];
        })
        .replace(/[?&](\w*)/g, (pre, key) => {
            pathKey.push(key);
            return `${pre}=${params[key]}`;
        });
    const data = produce(params, draft => {
        each(pathKey, (ignoreKey: string) => {
            delete draft[ignoreKey];
        });
    });
    return { url: newUrl, data };
};

export const generateAuthorizationHeader = (token: string) => 'Bearer ' + token;
