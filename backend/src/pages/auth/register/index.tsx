import React, { useCallback } from 'react';
import { createLazyForm } from '@utils';
import { observer } from 'mobx-react-lite';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { Button, Form, Input, Select } from 'antd';
import './index.scss';
import { Link } from 'react-router-dom';
import { useStore } from '@hooks';

const initRegisterFormFields = async () => ({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    sex: undefined,
});

const Item = Form.Item;
const Option = Select.Option;

const RegisterForm = createLazyForm(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator, validateFields, getFieldValue } = form;
        const {
            forms: { registerForm },
            user,
        } = useStore(['forms', 'user']);
        const register = useCallback(event => {
            event.preventDefault();
            validateFields((err, values) => {
                if (err) {
                    return;
                }
                user.register(values);
            });
        }, []);
        const confirmSamePassword = useCallback((_, value, callback) => {
            if (value !== getFieldValue('password')) {
                callback('The two passwords you entered did not match.');
            } else {
                callback();
            }
        }, []);
        const formProps: FormProps = {
            className: 'register-form',
            layout: 'vertical',
            onSubmit: register,
        };
        return (
            <Form {...formProps}>
                <Item>
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true }],
                    })(<Input placeholder='Nickname' />)}
                </Item>
                <Item>
                    {getFieldDecorator('email', {
                        rules: [{ required: true }],
                    })(<Input placeholder='Email' />)}
                </Item>
                <Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true }],
                    })(<Input type='password' placeholder='Password' />)}
                </Item>
                <Item>
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            {
                                required: true,
                                validator: confirmSamePassword,
                            },
                        ],
                    })(
                        <Input
                            type='password'
                            placeholder='Confirm your password'
                        />,
                    )}
                </Item>
                <Item>
                    {getFieldDecorator('sex')(
                        <Select placeholder='Sex' showSearch>
                            <Option value={0}>male</Option>
                            <Option value={1}>female</Option>
                            <Option value={2}>unknown</Option>
                        </Select>,
                    )}
                </Item>
                <Item>
                    <Button
                        type={'primary'}
                        htmlType={'submit'}
                        loading={registerForm.loading}
                        className={'register-form-button'}
                    >
                        Sign up
                    </Button>
                    <Link to={'/auth/login'}>
                        Log in with an existing account
                    </Link>
                </Item>
            </Form>
        );
    }),
    'registerForm',
    initRegisterFormFields,
);

export default RegisterForm;
