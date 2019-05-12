import { useContext } from 'react';
import Context from '@context';
import { RootStore } from '@stores';
import { each } from 'lodash';

type StoreKeys = (keyof RootStore)[];

type TargetStores = { [key in keyof RootStore]: RootStore[key] };

export const useStore = (storeKeys?: StoreKeys): TargetStores | RootStore => {
    const store = useContext(Context);
    if (!storeKeys) {
        return store;
    }
    let result = <TargetStores>{};
    each(storeKeys, key => {
        result[key] = store[key];
    });
    return result;
};
