import './index.scss';
import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

const columns: ColumnProps<any>[] = [
    {
        title: 'name',
        dataIndex: 'name',
    },
    {
        title: 'color',
        dataIndex: 'color',
        render: () => <span>color</span>,
    },
    {
        title: 'updated at',
        dataIndex: 'updated_at',
        defaultSortOrder: 'descend',
        sorter: (x, y) => moment(x).valueOf() - moment(y).valueOf(),
    },
    {
        title: 'created at',
        dataIndex: 'created_at',
        defaultSortOrder: 'descend',
        sorter: (x, y) => moment(x).valueOf() - moment(y).valueOf(),
    },
    {
        title: 'created by',
        dataIndex: 'created_by',
    },
    {
        title: 'action',
        width: 100,
        key: 'action',
        fixed: 'right',
        render: () => <span>edit</span>,
    },
];

const TagAdmin = () => (
    <div className={'tag-admin'}>
        <Table columns={columns} />
    </div>
);

export default TagAdmin;
