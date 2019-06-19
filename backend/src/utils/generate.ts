import produce from 'immer';
import { each } from 'lodash';
import { IObject } from '@interfaces';

/**
 * a easy function for parsing url by params
 * @param  url
 * @param params
 */
export const generateUrlParams = (url: string, params: IObject) => {
    let requestParams = {};
    if (!params) {
        return { url, data: undefined };
    }
    const pathKey: string[] = [];
    let newUrl = url.replace(/:(\w*)/g, (_, key) => {
        pathKey.push(key);
        return params[key];
    });
    if (params.hasOwnProperty('$query')) {
        requestParams = {
            ...params.$query,
        };
    }
    const data = produce(params, draft => {
        each(pathKey, (ignoreKey: string) => {
            delete draft[ignoreKey];
            delete draft['$query'];
        });
    });
    return { url: newUrl, data, params: requestParams };
};

export const generateAuthorizationHeader = (token: string) => 'Bearer ' + token;

export const generateAssets = (relativePath: string) =>
    require('@assets/' + relativePath);

export const generateImages = (relativePath: string, suffix = 'jpg') =>
    generateAssets(`imgs/${relativePath}.${suffix}`);

export const generateIcons = (relativePath: string, suffix = 'svg') =>
    generateAssets(`icons/${relativePath}.${suffix}`);
