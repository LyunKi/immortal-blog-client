import { matchPath } from 'react-router';

export const isCurrentPath = (pathname: string, pathRule: string) => {
    return !!matchPath(pathname, {
        path: pathRule,
        exact: true,
        strict: true,
    });
};
