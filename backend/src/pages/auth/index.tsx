import React from 'react';
import LoginForm from './login';
import RegisterForm from './register';
import Activation from './activation';
import './index.scss';
import { Logo } from '@components';
import { IObject } from '@interfaces';
import { fromPairs, map, split, get } from 'lodash';

type ActionType = 'login' | 'register' | 'activation';

interface IProps {
    match: {
        params: {
            actionType: ActionType;
        };
    };
    location: IObject;
}

const Auth = (props: IProps) => {
    const {
        match: {
            params: { actionType },
        },
        location: { search },
    } = props;
    const queries = fromPairs(
        map(split(search.slice(1), '&'), item => split(item, '=')),
    );
    const token = get(queries, 'token');
    return (
        <div className={'auth-container'}>
            <Logo className={'login-logo'} />
            <div className={'form-container'}>
                {(() => {
                    switch (actionType) {
                        case 'activation':
                            return <Activation token={token} />;
                        case 'register':
                            return <RegisterForm />;
                        case 'login':
                            return <LoginForm />;
                        default:
                            return null;
                    }
                })()}
            </div>
        </div>
    );
};

export default Auth;
