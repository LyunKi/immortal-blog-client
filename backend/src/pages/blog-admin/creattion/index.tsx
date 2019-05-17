import React, { useCallback } from 'react';
import { createLazyForm } from '@utils';
import { observer } from 'mobx-react-lite';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { Button, Form, Input, Select } from 'antd';
import './index.scss';
import { Link } from 'react-router-dom';
import { useStore } from '@hooks';

const initBlogCreateFormFields = async () => ({
    title: '',
    content: '',
    description: '',
    publishImmediately: false,
    authors: [],
    tags: [],
    categories: [],
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
        return <Form {...formProps} />;
    }),
    'CreateBlogForm',
    initBlogCreateFormFields,
);
