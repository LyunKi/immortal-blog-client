import React from 'react';
import LoginForm from './login';
import RegisterForm from './register';
import './index.scss';
import { Logo } from '@components';

type ActionType = 'login' | 'register';

interface IProps {
    match: {
        params: {
            actionType: ActionType;
        };
    };
}

const Auth = ({
    match: {
        params: { actionType },
    },
}: IProps) => (
    <div className={'auth-container'}>
        <Logo className={'login-logo'} />
        <div className={'form-container'}>
            {actionType !== 'register' ? <LoginForm /> : <RegisterForm />}
        </div>
    </div>
);

export default Auth;
