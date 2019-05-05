import moment from 'moment';
import { toNumber } from 'lodash/fp';

class Storage {
    static saveItem<T>(
        key: string,
        value: T,
        expire = 1000 * 60 * 60 * 24 * 15,
    ) {
        //default save a month
        let expiredTime = moment.now() + expire;
        localStorage.setItem(
            key,
            `${JSON.stringify({ value })}&expire:${expiredTime}`,
        );
    }

    static hasItem(key: string) {
        let hasFlag = false;
        const returnValue = window.localStorage.getItem(key);
        if (returnValue) {
            const [, expiredTIme] = returnValue.split(/&expire:/);
            if (toNumber(expiredTIme) > moment.now()) {
                hasFlag = true;
            } else {
                window.localStorage.removeItem(key);
            }
        }
        return hasFlag;
    }

    static getItemOrDefault<T>(key: string, defaultValue: T): T {
        let result = defaultValue;
        const returnValue = window.localStorage.getItem(key);
        if (returnValue) {
            const [dataString, expiredTIme] = returnValue.split(/&expire:/);
            if (toNumber(expiredTIme) > moment.now()) {
                result = JSON.parse(dataString).value;
            } else {
                window.localStorage.removeItem(key);
            }
        }
        return result;
    }

    static getItem<T>(key: string): T | null {
        const returnValue = window.localStorage.getItem(key);
        if (returnValue) {
            const [dataString, expiredTIme] = returnValue.split(/&expire:/);
            if (toNumber(expiredTIme) > moment.now()) {
                return JSON.parse(dataString).value;
            }
            window.localStorage.removeItem(key);
        }
        return null;
    }
}
export { Storage };
