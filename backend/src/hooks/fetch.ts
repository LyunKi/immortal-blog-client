import { IAsyncFunction } from '@interfaces';
import { useEffect } from 'react';
import { useAsyncState } from '@hooks';

export const useFetch = <T>(
    initialData: T,
    action: IAsyncFunction,
    ...params: any[]
) => {
    const {
        loading,
        setLoading,
        data,
        setData,
        error,
        setError,
    } = useAsyncState<T>(initialData);
    useEffect(() => {
        action(...params)
            .then((result: T) => {
                setData(result);
            })
            .catch(e => setError(e))
            .finally(() => setLoading(false));
        // eslint-disable-next-line
    }, []);
    return { loading, data, error };
};
