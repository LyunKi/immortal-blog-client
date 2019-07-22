import { store } from '@stores';
import { IColumnProps, ImmortalTable } from '@components';
import { IBlog } from '@interfaces';
import moment from 'moment';
import React from 'react';
import { createLazyForm } from '@utils';
import { Tooltip, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { API_PATH } from '@configs';

const TABLE_KEY = 'blogTable';
const TABLE_FORM_KEY = 'blogTableForm';

store.createTableStore(TABLE_KEY, '/blogs', TABLE_FORM_KEY, {
    sortInfo: {
        field: 'updatedAt',
        order: 'descend',
    },
});

const Paragraph = Typography.Paragraph;

const BlogTable = createLazyForm(TABLE_FORM_KEY, API_PATH.blogs)(
    observer(() => {
        const columns: IColumnProps<IBlog>[] = [
            {
                title: 'title',
                dataIndex: 'title',
            },
            {
                title: 'description',
                dataIndex: 'description',
                width: 120,
                render: (value: any) => {
                    return (
                        <Tooltip title={value}>
                            <Paragraph
                                className={'ellipse-text'}
                                ellipsis={{ rows: 2 }}
                            >
                                {value}
                            </Paragraph>
                        </Tooltip>
                    );
                },
            },
            {
                title: 'created at',
                dataIndex: 'createdAt',
                sorter: (x, y) =>
                    moment(x.createdAt).valueOf() -
                    moment(y.createdAt).valueOf(),
            },
            {
                title: 'tags',
                dataIndex: 'tags',
            },
            {
                title: 'categories',
                dataIndex: 'categories',
            },
            {
                title: 'authors',
                dataIndex: 'authors',
            },
            {
                title: 'published',
                dataIndex: 'published',
            },
            {
                title: 'comments',
                dataIndex: 'comments',
                render: comments => {
                    return comments.length;
                },
            },
            {
                title: 'created by',
                dataIndex: 'createdBy',
            },
            {
                title: 'updated at',
                dataIndex: 'updatedAt',
                sorter: (x, y) =>
                    moment(x.updatedAt).valueOf() -
                    moment(y.updatedAt).valueOf(),
            },
            {
                title: 'updated by',
                dataIndex: 'updatedBy',
            },
            {
                key: 'action',
                width: 300,
                actions: [
                    {
                        auth: {
                            requirePermissions: { blog: 4 },
                        },
                        button: {
                            type: 'link',
                            text: 'publish',
                        },
                    },
                    {
                        auth: {
                            requirePermissions: { blog: 3 },
                        },
                        button: {
                            type: 'link',
                            text: 'modify',
                        },
                    },
                ],
            },
        ];
        const scroll = {
            x: 1600,
        };
        const props = {
            deletable: {
                requirePermissions: { blog: 4 },
            },
            batchDeletable: {
                requirePermissions: { blog: 3 },
            },
            operations: [
                {
                    auth: {
                        requirePermissions: { blog: 3 },
                        requireUser: '{{nickname}}',
                    },
                    button: {
                        icon: 'plus',
                        type: 'primary',
                        href: '/blog-creation',
                    },
                },
            ],
            tableKey: 'blogTable',
            showSelection: true,
            scroll,
            columns,
        };
        //@ts-ignore
        return <ImmortalTable {...props} />;
    }),
);

export default BlogTable;
