import moment from 'moment';
import { toNumber } from 'lodash';

class Storage {
    static saveItem<T>(
        key: string,
        value: T,
        expire = 1000 * 60 * 60 * 24 * 30,
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

    static getItem<T>(key: string, defaultValue: T | null = null): T | null {
        const returnValue = window.localStorage.getItem(key);
        if (returnValue) {
            const [dataString, expiredTIme] = returnValue.split(/&expire:/);
            if (toNumber(expiredTIme) > moment.now()) {
                return JSON.parse(dataString).value;
            }
            window.localStorage.removeItem(key);
        }
        return defaultValue;
    }
}
export { Storage };
