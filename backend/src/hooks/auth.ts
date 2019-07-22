import { IAuthChecker, IAuthStatus } from '@interfaces';
import { get, intersection, isEmpty, some, trim } from 'lodash';
import { useDebounce, useStore } from '@hooks';
import { useMemo } from 'react';
import { ApiAction } from '@apis';

export const useCheckStatus = ({
    forbiddenRoles = [],
    requireRoles,
    requirePermissions,
    notFound,
    requireUser,
}: IAuthChecker): IAuthStatus => {
    const { user } = useStore(['user']);
    return useMemo(() => {
        //Firstly , authorized?
        if (!user.hasAuthorized) {
            return '401';
        }
        //Secondly, path can be found?
        if (notFound) {
            return '404';
        }
        //Thirdly , forbidden?
        const userRoles = get(user, 'privileges.roles');
        if (!isEmpty(intersection(userRoles, forbiddenRoles))) {
            return '403';
        }
        //Fourthly , require user?
        if (
            requireUser !== false &&
            (get(user, 'userInfo.nickname') !== requireUser &&
                !userRoles.includes('immortal'))
        ) {
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
    }, [
        user,
        forbiddenRoles,
        requireUser,
        notFound,
        requirePermissions,
        requireRoles,
    ]);
};

export const useConfirmSamePassword = (password: string) => {
    return useDebounce(
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

export const useCheckRepeatedName = (initialName?: string) => {
    return useDebounce(
        (_, value, callback) => {
            if (isEmpty(value) || trim(value) === initialName) {
                callback();
                return;
            }
            ApiAction.checkIsRepeated({
                nickname: value,
            })
                .then(isRepeated => {
                    if (isRepeated) {
                        callback('This nickname already exists');
                    } else {
                        callback();
                    }
                })
                .catch(() => callback());
        },
        [initialName],
    );
};
