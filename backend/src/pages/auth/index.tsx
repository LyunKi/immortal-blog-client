import React from 'react';
import LoginForm from './login';
import RegisterForm from './register';
import './index.scss';

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
        <div className={'form-container'}>
            {actionType === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
    </div>
);

export default Auth;
