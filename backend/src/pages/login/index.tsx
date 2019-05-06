import React, { useCallback, useContext } from 'react';
import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { FormProps } from 'antd/lib/form';
import { Link } from 'react-router-dom';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Context from '@context';
import './index.scss';

const Login = Form.create()(
    // @ts-ignore
    observer(({ form }: { form: WrappedFormUtils }) => {
        const { getFieldDecorator, validateFields } = form;
        const { common, user } = useContext(Context);
        const login = useCallback(
            event => {
                event.preventDefault();
                validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    user.login(values);
                });
            },
            [validateFields, user],
        );
        const formProps: FormProps = {
            className: 'login-form',
            layout: 'vertical',
            onSubmit: login,
        };
        return (
            <div className={'login-container'}>
                <Form {...formProps}>
                    <Form.Item>
                        {getFieldDecorator('nickname', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your nickname!',
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
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ],
                        })(
                            <Input
                                prefix={
                                    <Icon className={'grey-icon'} type='lock' />
                                }
                                type='password'
                                placeholder='Password'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <Link to={'/index'}>Forgot password</Link>
                        <Button
                            loading={common.loading}
                            type='primary'
                            htmlType='submit'
                            className='login-form-button'
                            onClick={login}
                        >
                            Log in
                        </Button>
                        Or <Link to={'/index'}>register now</Link>
                    </Form.Item>
                </Form>
            </div>
        );
    }),
);

export default Login;
