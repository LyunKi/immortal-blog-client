import React, { ReactElement } from 'react';
import { useCheckStatus } from '@hooks';
import { IAuthChecker } from '@interfaces';
import { DEFAULT_FORBIDDEN } from '@configs';

interface IProps extends IAuthChecker {
    render: ReactElement;
}
const Auth = ({
    forbiddenRoles = DEFAULT_FORBIDDEN,
    requireRoles = [],
    requirePermissions = {},
    fallback,
    render,
}: IProps) => {
    const status = useCheckStatus(
        forbiddenRoles,
        requireRoles,
        requirePermissions,
    );
    if (status === '403' || status === '401') {
        return fallback ? fallback : <></>;
    } else {
        return render;
    }
};

export default Auth;
