import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IObject } from '@interfaces';
import { Activated, ImmortalAvatar, ImmortalSelect } from '@components';
import { get } from 'lodash';
import { useCheckRepeatedName, useStore } from '@hooks';
import { createLazyForm } from '@utils';
import { observer } from 'mobx-react-lite';
import { API_PATH } from '@configs';
import { Form, Input, Radio } from 'antd';
import { FormComponentProps, FormProps } from 'antd/lib/form';

const Item = Form.Item;

interface IProps extends FormComponentProps {
    match: IObject;
}

const UserSettings = createLazyForm('userModifyForm', API_PATH.user_settings)(
    observer((props: IProps) => {
        const { form, match } = props;
        const { getFieldDecorator, setFieldsValue } = form;
        const { user } = useStore(['user']);
        const nickname = get(match, 'params.nickname');
        const [userSettings, setSettings] = useState({} as IObject);
        useEffect(() => {
            user.getSettings(nickname).then(settings => {
                setFieldsValue({
                    nickname: settings.nickname,
                    email: settings.email,
                    phone: settings.phone,
                    sex: settings.sex,
                    roles: settings.roles,
                    avatar: settings.avatar,
                });
                setSettings(settings);
            });
        }, [user, nickname, setFieldsValue]);
        const { activated, userId } = useMemo(() => {
            return {
                activated: userSettings.activated,
                userId: userSettings.id,
            };
        }, [userSettings.activated, userSettings.id]);
        const getRequiredFieldDecorator = useCallback(
            (name: string, options?: IObject) => {
                return getFieldDecorator(name, {
                    ...options,
                    rules: [...get(options, 'rules', []), { required: true }],
                });
            },
            [getFieldDecorator],
        );
        const formProps: FormProps = {};
        const checkRepeatedName = useCheckRepeatedName(userSettings.nickname);
        return (
            <Form {...formProps}>
                <Item label={'Nickname'}>
                    {getRequiredFieldDecorator('nickname', {
                        rules: [
                            {
                                validator: checkRepeatedName,
                            },
                        ],
                    })(<Input placeholder={'Input nickname'} />)}
                </Item>
                <Item label={'Email'}>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, type: 'email' }],
                    })(<Input type={'email'} placeholder='Email' />)}
                </Item>
                <Item label={'Phone'}>
                    {getFieldDecorator('phone', {
                        rules: [
                            {
                                type: 'string',
                                pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/,
                                message: 'Invalid phone number',
                            },
                        ],
                    })(<Input type={'tel'} placeholder='Phone' />)}
                </Item>
                <Item label={'Avatar'}>
                    {getFieldDecorator('avatar')(<ImmortalAvatar />)}
                </Item>
                <Item label='Gender'>
                    {getFieldDecorator('sex')(
                        <Radio.Group>
                            <Radio value={0}>Male</Radio>
                            <Radio value={1}>Female</Radio>
                            <Radio value={2}>Unknown Gender</Radio>
                        </Radio.Group>,
                    )}
                </Item>
                <Item label='Status'>
                    <Activated
                        activated={activated}
                        showAction={{ activeUser: userId }}
                    />
                </Item>
                <Item label={'Roles'}>
                    {getFieldDecorator('roles')(
                        <ImmortalSelect
                            apiPath={API_PATH.role_options}
                            placeholder='User Roles'
                            mode={'multiple'}
                            allowClear
                        />,
                    )}
                </Item>
            </Form>
        );
    }),
);

export default UserSettings;
