import { store } from '@stores';
import { IColumnProps, ImmortalTable } from '@components';
import { ICategory } from '@interfaces';
import moment from 'moment';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useShowScroll } from '@hooks';
import { Modal, Tooltip, Typography } from 'antd';
import CategoryTableForm from '../table-form';
import { useStore } from '@hooks';
import { uniqueId } from 'lodash';
import './index.scss';
import { API_PATH } from '@configs';

const TABLE_KEY = 'categoryTable';
const TABLE_FORM_KEY = 'categoryTableForm';
const { Paragraph } = Typography;

store.createTableStore(TABLE_KEY, API_PATH.categories, TABLE_FORM_KEY, {
    sortInfo: {
        field: 'updatedAt',
        order: 'descend',
    },
});
const CategoryTable = observer(() => {
    const {
        tables: { categoryTable },
    } = useStore(['tables']);
    const columns: IColumnProps<ICategory>[] = [
        {
            title: 'name',
            dataIndex: 'name',
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
                moment(x.createdAt).valueOf() - moment(y.createdAt).valueOf(),
        },
        {
            title: 'created by',
            dataIndex: 'createdBy',
        },
        {
            title: 'updated at',
            dataIndex: 'updatedAt',
            sorter: (x, y) =>
                moment(x.updatedAt).valueOf() - moment(y.updatedAt).valueOf(),
        },
        {
            title: 'updated by',
            dataIndex: 'updatedBy',
        },
        {
            key: 'action',
            width: 200,
            actions: [
                {
                    button: {
                        text: 'modify',
                        type: 'link',
                    },
                    auth: {
                        requirePermissions: { category: 3 },
                    },
                    action: (_: any, record) => {
                        categoryTable.change({
                            type: 'modifying',
                            record,
                        });
                        categoryTable.changeForm &&
                            categoryTable.changeForm.onValuesChange({
                                ...record,
                            });
                    },
                },
            ],
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
        deletable: {
            requirePermissions: { category: 3 },
        },
        batchDeletable: {
            requirePermissions: { category: 3 },
        },
        operations: [
            {
                type: 'normal',
                auth: {
                    requirePermissions: { category: 3 },
                },
                button: {
                    tip: {
                        title: 'Create',
                    },
                    icon: 'plus',
                    type: 'primary',
                    className: 'operation create-button',
                },
                action: () => {
                    categoryTable.change({
                        type: 'creating',
                        record: {
                            id: uniqueId('immortal-create-temp-id'),
                        },
                    });
                },
            },
        ],
        tableKey: 'categoryTable',
        showSelection: true,
        scroll,
        columns,
    };
    const changingType = categoryTable.changingType;
    const modelTitle =
        changingType === 'creating' ? 'Create Category' : 'Modify Category';
    return (
        <div className={'category-table'}>
            <Modal
                title={modelTitle}
                footer={null}
                maskClosable={false}
                closable={false}
                visible={categoryTable.isChanging}
            >
                <CategoryTableForm />
            </Modal>
            {
                //@ts-ignore
                <ImmortalTable {...props} />
            }
        </div>
    );
});

export default CategoryTable;
