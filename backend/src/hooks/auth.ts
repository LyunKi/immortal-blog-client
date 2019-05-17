import { IAuthStatus, IPermissions, IRoles } from '@interfaces';
import { isEmpty, get, intersection, some } from 'lodash';
import { useStore } from '@hooks';

export const useCheckStatus = (
    forbiddenRoles: IRoles,
    requireRoles: IRoles,
    requirePermissions: IPermissions,
    notFound?: boolean,
): IAuthStatus => {
    const { user } = useStore(['user']);
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
    const permissions = get(user, 'privileges.permissions');
    if (!isEmpty(intersection(userRoles, forbiddenRoles))) {
        return '403';
    }
    //Lastly, lack of some permissions or don't have high enough level
    if (
        some(
            requirePermissions,
            (level, key) =>
                Math.max(
                    get(permissions, `${key}.level`, 0),
                    get(permissions, 'all.level', 0),
                ) < level,
        )
    ) {
        return '403';
    }
    return '200';
};
