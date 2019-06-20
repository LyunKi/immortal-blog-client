import { store } from '@stores';
import { ColorPicker, IColumnProps, ImmortalTable } from '@components';
import { ITag } from '@interfaces';
import moment from 'moment';
import React from 'react';
import { createLazyForm } from '@utils';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { observer } from 'mobx-react-lite';
import { useShowScroll } from '@hooks';
import { APi_PATH } from '@configs';

const TABLE_KEY = 'tagTable';
const TABLE_FORM_KEY = 'tagTableForm';

store.createTableStore(TABLE_KEY, '/tags', TABLE_FORM_KEY, {
    sortInfo: {
        field: 'updatedAt',
        order: 'descend',
    },
});

const Item = Form.Item;

const TagTable = createLazyForm(TABLE_FORM_KEY, APi_PATH.tags)(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator } = form;
        const columns: IColumnProps<ITag>[] = [
            {
                title: 'name',
                dataIndex: 'name',
                modifiable: true,
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
                modifiable: true,
                width: 40,
                dynamicRender: {
                    control: value => {
                        return (
                            <Item>
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
                requirePermissions: { tag: 3 },
            },
            deletable: {
                requirePermissions: { tag: 3 },
            },
            batchDeletable: {
                requirePermissions: { tag: 3 },
            },
            modifiable: {
                requirePermissions: { tag: 3 },
            },
            tableKey: 'tagTable',
            showSelection: true,
            form,
            scroll,
            columns,
        };
        //@ts-ignore
        return <ImmortalTable {...props} />;
    }),
);

export default TagTable;
