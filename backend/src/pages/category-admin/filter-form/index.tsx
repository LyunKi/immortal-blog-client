import { createLazyForm, formatTimeRange } from '@utils';
import { observer } from 'mobx-react-lite';
import { Button, Col, DatePicker, Form, Input, Row, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import moment from 'moment';
import './index.scss';
import { useStore } from '@hooks';
import { API_PATH } from '@configs';

const FILTER_FORM_KEY = 'categoryFilterForm';
const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;

const CategoryFilterForm = createLazyForm(FILTER_FORM_KEY, API_PATH.categories)(
    observer(({ form }: FormComponentProps) => {
        const {
            forms: { categoryFilterForm },
            tables: { categoryTable },
        } = useStore(['forms', 'tables']);
        const { getFieldDecorator, validateFields } = form;
        const onSubmit = useCallback(
            event => {
                event.preventDefault();
                validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    categoryTable.submitFilters({
                        ...values,
                        createdAt: formatTimeRange(values.createdAt),
                        updatedAt: formatTimeRange(values.updatedAt),
                    });
                    categoryTable.fetchData();
                });
            },
            [validateFields, categoryTable],
        );
        const formProps: FormProps = {
            className: 'category-filter-form',
            labelAlign: 'left',
            labelCol: {
                xxl: {
                    span: 5,
                },
                xl: {
                    span: 7,
                },
                lg: {
                    span: 9,
                },
            },
            wrapperCol: {
                xxl: {
                    span: 19,
                },
                xl: {
                    span: 17,
                },
                lg: {
                    span: 15,
                },
            },
            onReset: categoryFilterForm.resetFields.bind(categoryFilterForm),
            onSubmit,
        };
        return (
            <Form {...formProps}>
                <Row type={'flex'} gutter={24}>
                    <Col span={8}>
                        <Item label={'Name'}>
                            {getFieldDecorator('name')(
                                <Input placeholder={'Search category name'} />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Created By'}>
                            {getFieldDecorator('createdBy')(
                                <Input placeholder={'Search create user'} />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Created At'}>
                            {getFieldDecorator('createdAt')(
                                <RangePicker
                                    style={{ width: '100%' }}
                                    ranges={{
                                        Today: [
                                            moment().startOf('day'),
                                            moment().endOf('day'),
                                        ],
                                        'This Month': [
                                            moment().startOf('month'),
                                            moment().endOf('month'),
                                        ],
                                    }}
                                    showTime
                                />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Updated By'}>
                            {getFieldDecorator('updatedBy')(
                                <Input placeholder={'Search update user'} />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Updated At'}>
                            {getFieldDecorator('updatedAt')(
                                <RangePicker
                                    style={{ width: '100%' }}
                                    ranges={{
                                        Today: [
                                            moment().startOf('day'),
                                            moment().endOf('day'),
                                        ],
                                        'This Month': [
                                            moment().startOf('month'),
                                            moment().endOf('month'),
                                        ],
                                    }}
                                    showTime
                                />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item
                            label={' '}
                            colon={false}
                            className={'operations'}
                        >
                            <Tooltip title='Search'>
                                <Button
                                    icon={'search'}
                                    htmlType={'submit'}
                                    type={'primary'}
                                />
                            </Tooltip>
                            <Tooltip title='Reset'>
                                <Button icon={'sync'} htmlType={'reset'} />
                            </Tooltip>
                        </Item>
                    </Col>
                </Row>
            </Form>
        );
    }),
);

export default CategoryFilterForm;
