import { IFunction } from '@interfaces';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';

const useDebounce = (func: IFunction, deps: any[], wait: number = 500) => {
    // return debounce(useCallback(func, deps), wait);
    return useCallback(debounce(func, wait), deps);
    // return debounce(func, wait);
};

const useAsyncState = <T>() => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState(undefined);
    return {
        loading,
        setLoading,
        data,
        setData,
        error,
        setError,
    };
};
export { useDebounce, useAsyncState };
