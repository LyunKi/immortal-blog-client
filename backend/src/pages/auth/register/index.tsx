import React from 'react';
import { createLazyForm } from '@utils';
import { observer } from 'mobx-react-lite';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { Button, Form, Input, Select } from 'antd';
import './index.scss';
import { Link } from 'react-router-dom';
import { useCheckRepeatedName, useConfirmSamePassword, useStore } from '@hooks';
import { API_PATH } from '@configs';

const FORM_KEY = 'registerForm';
const Item = Form.Item;
const Option = Select.Option;

const RegisterForm = createLazyForm(FORM_KEY, API_PATH.register)(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator, getFieldValue } = form;
        const {
            forms: { registerForm },
            user,
        } = useStore(['forms', 'user']);

        const confirmSamePassword = useConfirmSamePassword(
            getFieldValue('password'),
        );
        const checkRepeatedName = useCheckRepeatedName();

        const formProps: FormProps = {
            className: 'register-form',
            layout: 'vertical',
            onSubmit: user.register.bind(user),
        };
        return (
            <Form {...formProps}>
                <Item hasFeedback>
                    {getFieldDecorator('nickname', {
                        rules: [
                            { required: true },
                            {
                                validator: checkRepeatedName,
                            },
                        ],
                    })(<Input placeholder='Nickname' />)}
                </Item>
                <Item hasFeedback>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, type: 'email' }],
                    })(<Input type={'email'} placeholder='Email' />)}
                </Item>
                <Item hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{ required: true }],
                    })(<Input type='password' placeholder='Password' />)}
                </Item>
                <Item hasFeedback>
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            {
                                required: true,
                            },
                            {
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
                    {getFieldDecorator('sex', {
                        initialValue: 2,
                    })(
                        <Select
                            optionFilterProp={'children'}
                            placeholder='User Gender'
                            showSearch
                        >
                            <Option value={0}>Male</Option>
                            <Option value={1}>Female</Option>
                            <Option value={2}>Unknown Gender</Option>
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
);

export default RegisterForm;
