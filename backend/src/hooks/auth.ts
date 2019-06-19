import { IAuthStatus, IPermissions, IRoles } from '@interfaces';
import { get, intersection, isEmpty, some } from 'lodash';
import { useDebounce, useStore } from '@hooks';
import { useCallback, useMemo } from 'react';
import { AuthApi } from '@apis';

export const useCheckStatus = (
    forbiddenRoles: IRoles,
    requireRoles: IRoles,
    requirePermissions: IPermissions,
    notFound?: boolean,
): IAuthStatus => {
    const { user } = useStore(['user']);
    return useMemo(() => {
        //Firstly , authorized?
        if (!user.hasAuthorized) {
            return '401';
        }
        //Secondly, path can be found?
        if (!!notFound) {
            return '404';
        }
        //Thirdly , forbidden?
        const userRoles = get(user, 'privileges.roles');
        if (!isEmpty(intersection(userRoles, forbiddenRoles))) {
            return '403';
        }
        //Lastly, lack of some permissions or don't have high enough level
        if (
            some(requirePermissions, (level, key) =>
                user.hasPrivilege(key, level),
            ) ||
            some(requireRoles, role => !user.hasRole(role))
        ) {
            return '403';
        }
        return '200';
    }, [user, forbiddenRoles, notFound, requirePermissions, requireRoles]);
};

export const useConfirmSamePassword = (password: string) => {
    return useCallback(
        (_, value, callback) => {
            if (value !== password) {
                callback('The two passwords you entered did not match.');
            } else {
                callback();
            }
        },
        [password],
    );
};

export const useCheckRepeatedName = () => {
    return useDebounce((_, value, callback) => {
        AuthApi.checkIsRepeated({
            nickname: value,
        }).then(isRepeated => {
            if (isRepeated) {
                callback('This nickname already exists');
            } else {
                callback();
            }
        });
    }, []);
};
