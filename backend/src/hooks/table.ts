import { IScroll, ISizeChecker } from '@interfaces';
import { useCheckInnerWidth } from '@hooks';
import { useMemo } from 'react';

export function useShowScroll(sizeChecker: ISizeChecker, scroll: IScroll) {
    const need = !useCheckInnerWidth(sizeChecker);
    return useMemo(() => {
        return need ? undefined : scroll;
    }, [need, scroll]);
}
