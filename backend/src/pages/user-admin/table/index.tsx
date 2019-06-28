import { store } from '@stores';
import { Association, IColumnProps, ImmortalTable } from '@components';
import { IKeyMap, IUser } from '@interfaces';
import moment from 'moment';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useFetch } from '@hooks';
import { filter, map } from 'lodash';
import './index.scss';
import { API_PATH } from '@configs';
import { ApiAction } from '@apis';
import { Avatar, Badge, Tag } from 'antd';
import { BadgeProps } from 'antd/lib/badge';

const TABLE_KEY = 'userTable';
const TABLE_FORM_KEY = 'userTableForm';

store.createTableStore(TABLE_KEY, API_PATH.users, TABLE_FORM_KEY, {
    sortInfo: {
        field: 'updatedAt',
        order: 'descend',
    },
});
const UserTable = observer(() => {
    const columns: IColumnProps<IUser>[] = [
        {
            title: 'avatar',
            width: 75,
            dataIndex: 'avatar',
            fixed: 'left',
            render: (value, record) => {
                const avatarProps = value
                    ? {
                          src: value,
                          alt: record.nickname,
                          className: 'avatar img',
                      }
                    : {
                          children: record.nickname,
                          className: 'avatar string',
                      };
                return <Avatar {...avatarProps} />;
            },
        },
        {
            title: 'nickname',
            dataIndex: 'nickname',
        },
        {
            title: 'email',
            dataIndex: 'email',
            render: (value: string) => {
                return <Association type={'email'} value={value} />;
            },
        },
        {
            title: 'phone',
            dataIndex: 'phone',
            render: (value: string) => {
                return <Association type={'phone'} value={value} />;
            },
        },
        {
            title: 'gender',
            dataIndex: 'sex',
            width: 120,
            render: value => {
                const showMap: {
                    [key: number]: BadgeProps;
                } = {
                    0: {
                        color: 'blue',
                        text: 'male',
                    },
                    1: {
                        color: 'pink',
                        text: 'female',
                    },
                    2: {
                        color: 'purple',
                        text: 'unknown',
                    },
                };
                return <Badge {...showMap[value]} />;
            },
        },
        {
            title: 'activated',
            dataIndex: 'activated',
            render: value => {
                const status: BadgeProps = value
                    ? { status: 'success', text: 'activated' }
                    : { status: 'default', text: 'inactivated' };
                return <Badge {...status} />;
            },
        },
        {
            title: 'roles',
            dataIndex: 'roles',
            render: value => {
                const ROLE_MAP: { [key: string]: string } = {
                    untouchable: 'black',
                    vaishya: 'grey',
                    kshatriya: 'blue',
                    brahmin: 'yellow',
                    immortal: 'red',
                };
                const ownedRoles = filter<IKeyMap>(roles, role =>
                    value.includes(+role.id),
                );
                return (
                    <>
                        {map(ownedRoles, role => (
                            <Tag key={role.id} color={ROLE_MAP[role.name]}>
                                {role.name}
                            </Tag>
                        ))}
                    </>
                );
            },
        },
        {
            title: 'created at',
            dataIndex: 'createdAt',
            sorter: (x, y) =>
                moment(x.createdAt).valueOf() - moment(y.createdAt).valueOf(),
        },
        {
            title: 'updated at',
            dataIndex: 'updatedAt',
            sorter: (x, y) =>
                moment(x.updatedAt).valueOf() - moment(y.updatedAt).valueOf(),
        },
        {
            key: 'action',
            width: 210,
            actions: [
                {
                    button: {
                        text: 'detail',
                        type: 'link',
                        href: '/user-center/{{nickname}}',
                    },
                },
                {
                    button: {
                        text: 'settings',
                        type: 'link',
                        href: '/user-settings/{{nickname}}',
                    },
                },
            ],
        },
    ];
    const scroll = {
        x: 1800,
    };
    const { data: roles } = useFetch<IKeyMap[]>([], ApiAction.getRoleOptions);
    const props = {
        tableKey: 'userTable',
        showSelection: true,
        scroll,
        columns,
    };
    return (
        <div className={'user-table'}>
            {
                //@ts-ignore
                <ImmortalTable {...props} />
            }
        </div>
    );
});

export default UserTable;
