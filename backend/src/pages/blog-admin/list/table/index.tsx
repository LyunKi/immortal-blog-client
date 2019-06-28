import { store } from '@stores';
import { ColorPicker, IColumnProps, ImmortalTable } from '@components';
import { IBlog } from '@interfaces';
import moment from 'moment';
import React from 'react';
import { createLazyForm } from '@utils';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { observer } from 'mobx-react-lite';
import { useShowScroll } from '@hooks';
import { API_PATH } from '@configs';

const TABLE_KEY = 'blogTable';
const TABLE_FORM_KEY = 'blogTableForm';

store.createTableStore(TABLE_KEY, '/blogs', TABLE_FORM_KEY, {
    sortInfo: {
        field: 'updatedAt',
        order: 'descend',
    },
});

const Item = Form.Item;

const BlogTable = createLazyForm(TABLE_FORM_KEY, API_PATH.blogs)(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator } = form;
        const columns: IColumnProps<IBlog>[] = [
            {
                title: 'title',
                dataIndex: 'title',
                modifiable: true,
                width: 165,
                dynamicRender: {
                    control: value => {
                        return (
                            <Item>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true }],
                                    initialValue: value,
                                })(<Input placeholder='Name' />)}
                            </Item>
                        );
                    },
                },
            },
            {
                title: 'color',
                dataIndex: 'color',
                width: 40,
                modifiable: true,
                dynamicRender: {
                    control: value => {
                        return (
                            <Item style={{ width: 40 }}>
                                {getFieldDecorator('color', {
                                    rules: [{ required: true }],
                                    initialValue: value,
                                })(<ColorPicker />)}
                            </Item>
                        );
                    },
                    display: value => {
                        return <ColorPicker value={value} disabled />;
                    },
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
        ];
        const scroll = useShowScroll(
            {
                size: 1430,
                type: '>',
            },
            {
                x: 1200,
            },
        );
        const props = {
            creatable: {
                requirePermissions: { blog: 3 },
            },
            deletable: {
                requirePermissions: { blog: 3 },
            },
            batchDeletable: {
                requirePermissions: { blog: 3 },
            },
            modifiable: {
                requirePermissions: { blog: 3 },
            },
            tableKey: 'blogTable',
            showSelection: true,
            form,
            scroll,
            columns,
        };
        //@ts-ignore
        return <ImmortalTable {...props} />;
    }),
);

export default BlogTable;
