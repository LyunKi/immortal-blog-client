import produce from 'immer';
import { each, map } from 'lodash';
import { AnyObject } from '@interfaces';

/**
 * a easy function for parsing url by params
 * @param  url
 * @param params
 * @example generateUrlParams("/test/:a",{a:3,$query:{b:2}}) => {url:"test/3?b=2" ,data:{}}
 */
export const generateUrlParams = (url: string, params: AnyObject) => {
    const pathKey: string[] = [];
    let newUrl = url.replace(/:(\w*)/g, (_, key) => {
        pathKey.push(key);
        return params[key];
    });
    if (params.hasOwnProperty('$query')) {
        let queries = map(
            params.$query,
            (value: string, key: string) => `${key}=${value}`,
        );
        newUrl += `?${queries}`;
    }
    const data = produce(params, draft => {
        each(pathKey, (ignoreKey: string) => {
            delete draft[ignoreKey];
            delete draft['query'];
        });
    });
    return { url: newUrl, data };
};

export const generateAuthorizationHeader = (token: string) => 'Bearer ' + token;

export const generateAssets = (relativePath: string) =>
    require('@assets/' + relativePath);

export const generateImages = (relativePath: string, suffix = 'jpg') =>
    generateAssets(`imgs/${relativePath}.${suffix}`);

export const generateIcons = (relativePath: string, suffix = 'svg') =>
    generateAssets(`icons/${relativePath}.${suffix}`);
