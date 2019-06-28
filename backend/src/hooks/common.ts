import { IFunction, ISizeChecker } from '@interfaces';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

const useDebounce = (func: IFunction, deps: any[], wait: number = 500) => {
    // return debounce(useCallback(func, deps), wait);
    return useCallback(debounce(func, wait), deps);
    // return debounce(func, wait);
};

const useAsyncState = <T>(initialData: T) => {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState(true);
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

function getSize() {
    return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
    };
}

function useWindowSize() {
    let [windowSize, setWindowSize] = useState(getSize());

    function handleResize() {
        setWindowSize(getSize());
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
}

function useCheckInnerWidth(sizeChecker: ISizeChecker): boolean {
    const windowSize = useWindowSize();
    switch (sizeChecker.type) {
        case '<':
            return sizeChecker.size < windowSize.innerWidth;
        case '=':
            return sizeChecker.size === windowSize.innerWidth;
        case '>':
            return sizeChecker.size > windowSize.innerWidth;
    }
}

export { useDebounce, useAsyncState, useWindowSize, useCheckInnerWidth };
