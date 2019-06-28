import React from 'react';
import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import './index.scss';
import { createLazyForm } from '@utils';
import { useStore } from '@hooks';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { API_PATH } from '@configs';

const FORM_KEY = 'loginForm';

const Item = Form.Item;
const Password = Input.Password;

const LoginForm = createLazyForm(FORM_KEY, API_PATH.login)(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator } = form;
        const {
            forms: { loginForm },
            user,
        } = useStore(['forms', 'user']);
        const formProps: FormProps = {
            className: 'login-form',
            layout: 'vertical',
            onSubmit: user.login.bind(user),
        };
        return (
            <Form {...formProps}>
                <Item>
                    {getFieldDecorator('nickname', {
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    })(
                        <Input
                            prefix={
                                <Icon className={'grey-icon'} type='user' />
                            }
                            placeholder='Nickname'
                        />,
                    )}
                </Item>
                <Item>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    })(
                        <Password
                            prefix={
                                <Icon className={'grey-icon'} type='lock' />
                            }
                            placeholder='Password'
                        />,
                    )}
                </Item>
                <Item>
                    <div className={'login-remember-forgot'}>
                        {getFieldDecorator('remember', {
                            initialValue: true,
                            valuePropName: 'checked',
                        })(<Checkbox>Remember me</Checkbox>)}
                        <Link to={'/index'}>Forgot password</Link>
                    </div>
                    <Button
                        loading={loginForm.loading}
                        type='primary'
                        htmlType='submit'
                        className='login-form-button'
                    >
                        Log in
                    </Button>
                    <div className={'sign-about'}>
                        <div className={'third-party'}>
                            Or sign in with
                            <Icon
                                className={'third-party-icon grey-icon'}
                                type='github'
                            />
                        </div>
                        <Link className={'sign-up'} to={'/auth/register'}>
                            Sign up
                        </Link>
                    </div>
                </Item>
            </Form>
        );
    }),
);

export default LoginForm;
