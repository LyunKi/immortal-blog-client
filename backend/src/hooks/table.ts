import { IScroll, ISizeChecker } from '@interfaces';
import { useCheckInnerWidth } from '@hooks';
import { useMemo } from 'react';

export function useShowScroll(sizeChecker: ISizeChecker, scroll: IScroll) {
    const noNeed = !useCheckInnerWidth(sizeChecker);
    return useMemo(() => {
        return noNeed ? undefined : scroll;
    }, [noNeed, scroll]);
}
