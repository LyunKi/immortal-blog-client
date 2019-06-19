import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Divider, message, Popconfirm, Table, Tooltip } from 'antd';
import { each, get, map, uniqueId, isEmpty } from 'lodash';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { useStore } from '@hooks';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { TableStore } from '@stores';
import './index.scss';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { api } from '@utils';
import classnames from 'classnames';
import { IAuthChecker, IFunction } from '@interfaces';
import { Auth } from '@components';

const ACTION_CONFIG: ColumnProps<any> = {
    title: 'action',
    key: 'action',
    width: 200,
    fixed: 'right',
};

interface ILinkAction extends IAuthChecker {
    link: string;
    text: string;
}

interface IClickAction<T> extends IAuthChecker {
    action: (text: any, record: T, index: number, disabled?: boolean) => any;
    text: string;
    disabled?: boolean;
    confirm?: {
        title: string;
        placement?: string;
    };
}

type IAction<T> = IClickAction<T> | ILinkAction;

export interface IColumnProps<T> extends ColumnProps<T> {
    modifiable?: boolean;
    dynamicRender?: {
        display?: (text: any, record: T, index: number) => React.ReactNode;
        control?: (text: any, record: T, index: number) => React.ReactNode;
    };
    actions?: IAction<T>[];
}

export interface ITableProps<T> extends TableProps<T> {
    creatable?: IAuthChecker;
    modifiable?: IAuthChecker;
    deletable?: IAuthChecker;
    batchDeletable?: IAuthChecker;
    tableKey: string;
    columns: IColumnProps<T>[];
    form?: WrappedFormUtils;
    rowKey?: string;
    showSelection: boolean;
}

function isLinkAction<T>(action: IAction<T>): action is ILinkAction {
    return !!(action as ILinkAction).link;
}

function getRowKey<T>(props: ITableProps<T>) {
    return props.rowKey || 'id';
}

function createConfirmActions<T>(table: TableStore<T>, form: WrappedFormUtils) {
    return [
        {
            text: 'confirm',
            action: (_: any, record: T) => {
                const [method, apiPath] =
                    table.changing && table.changing.type === 'modifying'
                        ? ['put', `${table.apiPath}/${get(record, 'id')}`]
                        : ['post', table.apiPath];
                form.validateFields((error, values) => {
                    if (error) {
                        return;
                    }
                    table.showLoading();
                    api[method](apiPath, values)
                        .then(() => {
                            message.success('Operate successfully');
                            table.cancelChange();
                            form.resetFields();
                            table.fetchData();
                        })
                        .finally(table.hideLoading);
                });
            },
        },
        {
            text: 'cancel',
            confirm: {
                title: 'sure to give up',
            },
            action: () => {
                table.cancelChange();
                form.resetFields();
            },
        },
    ];
}

function createModifyAction<T>(table: TableStore<T>, auth: IAuthChecker) {
    return {
        ...auth,
        text: 'modify',
        disabled: table.isChanging,
        action: (_: any, record: T, index: number, disabled?: boolean) => {
            if (!!disabled) {
                return;
            }
            table.change({
                type: 'modifying',
                record: {
                    ...record,
                },
            });
        },
    };
}

function createDeleteAction<T>(table: TableStore<T>, auth: IAuthChecker) {
    return {
        ...auth,
        text: 'delete',
        disabled: table.isChanging,
        confirm: {
            title: 'sure to delete',
        },
        action: (_: any, record: T, index: number, disabled?: boolean) => {
            if (!!disabled) {
                return;
            }
            table.showLoading();
            api.delete(table.apiPath, { $query: { ids: [get(record, 'id')] } })
                .then(num => {
                    message.success(`Successfully delete ${num} records`);
                    table.fetchData();
                })
                .finally(table.hideLoading);
        },
    };
}

function renderActionColumn<T>(
    actions: IAction<T>[] = [],
    table: TableStore<T>,
    form: WrappedFormUtils,
    rowKey: string,
    modifiable?: IAuthChecker,
    deletable?: IAuthChecker,
) {
    return (text: any, record: T) => {
        let newActions = [...actions];
        if (
            table.changing &&
            get(table, `changing.record.${rowKey}`) === get(record, rowKey)
        ) {
            newActions = createConfirmActions(table, form);
        } else {
            if (modifiable) {
                newActions.push(createModifyAction(table, modifiable));
            }
            if (deletable) {
                newActions.push(createDeleteAction(table, deletable));
            }
        }
        return (
            <div className={'table-actions'}>
                {map(newActions, (action, index) => {
                    return (
                        <span key={action.text}>
                            <Auth
                                fallback={
                                    <span
                                        className={
                                            'no-auth table-action disabled'
                                        }
                                    >
                                        Forbidden
                                    </span>
                                }
                                requirePermissions={action.requirePermissions}
                                forbiddenRoles={action.forbiddenRoles}
                                requireRoles={action.requireRoles}
                                render={
                                    <>
                                        {isLinkAction(action) ? (
                                            <Link
                                                key={action.text}
                                                className={'table-action'}
                                                to={action.link}
                                            >
                                                {action.text}
                                            </Link>
                                        ) : !action.disabled &&
                                          (action as IClickAction<T>)
                                              .confirm ? (
                                            <Popconfirm
                                                //@ts-ignore
                                                title={action.confirm.title}
                                                //@ts-ignore
                                                onConfirm={action.action}
                                            >
                                                <span
                                                    key={action.text}
                                                    className={'table-action'}
                                                >
                                                    {action.text}
                                                </span>
                                            </Popconfirm>
                                        ) : (
                                            <span
                                                key={action.text}
                                                className={classnames(
                                                    'table-action',
                                                    {
                                                        disabled:
                                                            action.disabled,
                                                    },
                                                )}
                                                onClick={action.action.bind(
                                                    null,
                                                    text,
                                                    record,
                                                    index,
                                                    action.disabled,
                                                )}
                                            >
                                                {action.text}
                                            </span>
                                        )}
                                    </>
                                }
                            />
                            {newActions.length - 1 !== index && (
                                <Divider type='vertical' />
                            )}
                        </span>
                    );
                })}
            </div>
        );
    };
}

function renderColumn<T>(
    column: IColumnProps<T>,
    showControl: boolean,
): IFunction {
    //Case changing
    if (showControl) {
        if (typeof get(column, 'dynamicRender.control') === 'undefined') {
            throw new Error(
                `${column.title} need dynamicRender.control property`,
            );
        }
        //@ts-ignore
        return column.dynamicRender.control;
    }
    const defaultRender = (value: any) => value;
    //Case normal
    return (
        (column.dynamicRender && column.dynamicRender.display) ||
        column.render ||
        defaultRender
    );
}

function transformColumns<T>(props: ITableProps<T>, table: TableStore<T>) {
    let columns: ColumnProps<T>[] = [];
    let actionColumn: ColumnProps<T> = {
        ...ACTION_CONFIG,
    };
    let actions: IAction<T>[] = [];
    let rowKey = getRowKey(props);
    each(props.columns, column => {
        //action column
        if (column.key === 'action') {
            actionColumn = {
                ...actionColumn,
                ...column,
            };
            if (column.actions) {
                actions = actions.concat(column.actions);
            }
        } else {
            let tempColumn: ColumnProps<T> = {
                ...column,
                render: (value, record, index) => {
                    let renderFunction = renderColumn(
                        column,
                        !!column.modifiable &&
                            get(record, rowKey) ===
                                get(table, `changing.record.${rowKey}`),
                    );
                    return renderFunction(value, record, index);
                },
            };
            if (table.sortInfo) {
                tempColumn.sortOrder =
                    get(table.sortInfo, 'field') === column.dataIndex &&
                    get(table.sortInfo, 'order');
            }
            columns.push(tempColumn);
        }
    });
    if (actions.length || props.modifiable || props.deletable) {
        actionColumn.render = renderActionColumn(
            actions,
            table,
            props.form as WrappedFormUtils,
            rowKey,
            props.modifiable,
            props.deletable,
        );
        columns.push(actionColumn);
    }
    return columns;
}

function Inner<T>(props: ITableProps<T>) {
    const {
        tables: { [props.tableKey]: table },
    } = useStore(['tables']);
    //transform columns
    const columns = transformColumns(props, table);
    //show row selection?
    const rowSelection = props.showSelection
        ? {
              selectedRowKeys: table.selectedRowKeys,
              onChange: table.onSelectChange.bind(table),
          }
        : undefined;
    //transform props
    const transformProps = {
        ...props,
        columns,
        rowSelection,
        bordered: true,
        rowKey: getRowKey(props),
        onChange: table.onChange.bind(table),
        loading: table.loading,
        pagination: table.pagination,
        dataSource: table.datasource,
        className: classnames('table', props.className),
    };
    //create operation
    const onCreate = useCallback(() => {
        table.change({
            type: 'creating',
            record: {
                id: uniqueId('immortal-create-temp-id'),
            },
        });
        // eslint-disable-next-line
    }, []);

    //batch delete operation
    const isEmptySelected = useMemo(() => isEmpty(table.selectedRowKeys), [
        table.selectedRowKeys,
    ]);
    const onBatchDelete = useCallback(() => {
        if (isEmptySelected) {
            message.warn('You should select at least one row');
            return;
        }
        api.delete(table.apiPath, { $query: { ids: table.selectedRowKeys } })
            .then(num => {
                message.success(`Successfully delete ${num} records`);
                table.fetchData();
            })
            .finally(table.hideLoading);
        // eslint-disable-next-line
    }, [table.selectedRowKeys]);

    //batch delete visibility
    const [visible, setVisible] = useState(false);
    const handleVisibleChange = useCallback(() => {
        setVisible(!isEmptySelected && !visible);
    }, [visible, setVisible, isEmptySelected]);

    //fetch data in the initial
    useEffect(() => {
        table.fetchData();
        // eslint-disable-next-line
    }, []);
    return (
        <div className={'immortal-table'}>
            <div className={'operations'}>
                {props.creatable && (
                    <Auth
                        {...props.creatable}
                        render={
                            <Tooltip title='Create'>
                                <Button
                                    icon={'plus'}
                                    type={'primary'}
                                    className={'operation create-button'}
                                    disabled={table.isChanging}
                                    onClick={onCreate}
                                />
                            </Tooltip>
                        }
                    />
                )}
                {props.batchDeletable && (
                    <Auth
                        {...props.batchDeletable}
                        render={
                            <Popconfirm
                                placement={'topRight'}
                                title={'Sure to execute batch delete'}
                                onConfirm={onBatchDelete}
                                visible={visible}
                                onVisibleChange={handleVisibleChange}
                            >
                                <Tooltip title='Batch Delete'>
                                    <Button
                                        icon={'delete'}
                                        className={'operation delete-button'}
                                        disabled={
                                            table.isChanging || isEmptySelected
                                        }
                                    />
                                </Tooltip>
                            </Popconfirm>
                        }
                    />
                )}
            </div>
            <Table {...transformProps} />
        </div>
    );
}

const ImmortalTable = observer(Inner);

export default ImmortalTable;
