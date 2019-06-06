import { IFunction } from '@interfaces';
import { useCallback } from 'react';
import { debounce } from 'lodash';
const useDebounce = (func: IFunction, deps: any[], wait: number = 500) => {
    // return debounce(useCallback(func, deps), wait);
    return useCallback(debounce(func, wait), deps);
    // return debounce(func, wait);
};

export { useDebounce };
