import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IObject, IUserInfoAndPrivileges } from '@interfaces';
import {
    Activated,
    Auth,
    ImmortalAvatar,
    ImmortalButton,
    ImmortalSelect,
} from '@components';
import { get, toInteger } from 'lodash';
import { useCheckRepeatedName, useStore } from '@hooks';
import { createLazyForm, Navigator, refreshStorageInfo } from '@utils';
import { observer } from 'mobx-react-lite';
import { API_PATH } from '@configs';
import { Form, Input, message, Radio } from 'antd';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import './index.scss';

const Item = Form.Item;

interface IProps extends FormComponentProps {
    match: IObject;
}

const UserSettings = createLazyForm('userModifyForm', API_PATH.user_settings)(
    observer((props: IProps) => {
        const { form, match } = props;
        const { getFieldDecorator, setFieldsValue } = form;
        const {
            user,
            forms: { userModifyForm },
        } = useStore(['user', 'forms']);
        const nickname = get(match, 'params.nickname');
        const [userSettings, setSettings] = useState({} as IObject);
        useEffect(() => {
            user.getSettings(nickname).then(settings => {
                setFieldsValue({
                    nickname: settings.nickname,
                    email: settings.email,
                    phone: settings.phone,
                    sex: settings.sex,
                    role: settings.roles[0],
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
        const formProps: FormProps = {
            className: 'user-settings-form',
            layout: 'horizontal',
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const checkRepeatedName = useCheckRepeatedName(userSettings.nickname);
        return (
            <Form {...formProps}>
                <Item label='Avatar'>
                    {getFieldDecorator('avatar')(<ImmortalAvatar />)}
                </Item>
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
                <Item label='Gender'>
                    {getRequiredFieldDecorator('sex')(
                        <Radio.Group>
                            <Radio value={0}>Male</Radio>
                            <Radio value={1}>Female</Radio>
                            <Radio value={2}>Unknown Gender</Radio>
                        </Radio.Group>,
                    )}
                </Item>
                <Auth
                    render={
                        <Item label={'Role'}>
                            {getRequiredFieldDecorator('role')(
                                <ImmortalSelect
                                    apiPath={API_PATH.role_options}
                                    placeholder='User Role'
                                    allowClear
                                />,
                            )}
                        </Item>
                    }
                    requireRoles={['immortal']}
                />
                <Item label='Status'>
                    <Activated
                        activated={activated}
                        showAction={{ activeUser: userId }}
                    />
                </Item>
                <Item
                    label={' '}
                    colon={false}
                    className={'user-settings-operations'}
                >
                    <div className={'operations'}>
                        <ImmortalButton
                            button={{
                                className: 'operation',
                                text: 'Back',
                            }}
                            action={() => {
                                Navigator.back();
                            }}
                        />
                        <ImmortalButton
                            button={{
                                text: 'Confirm',
                                type: 'primary',
                                className: 'operation',
                                loading: userModifyForm.loading,
                            }}
                            action={userModifyForm.put.bind(
                                userModifyForm,
                                (info: IUserInfoAndPrivileges) => {
                                    refreshStorageInfo(info);
                                    message.success(
                                        'Update user settings successfully',
                                    );
                                    Navigator.back();
                                },
                                (err: IObject) => message.error(err.message),
                                (value: IObject) => ({
                                    ...value,
                                    roles: [toInteger(value.role)],
                                    id: userSettings.id,
                                }),
                            )}
                        />
                    </div>
                </Item>
            </Form>
        );
    }),
);

export default UserSettings;
