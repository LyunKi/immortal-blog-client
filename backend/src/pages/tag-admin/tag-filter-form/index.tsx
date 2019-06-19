import { createLazyForm, formatTimeRange } from '@utils';
import { observer } from 'mobx-react-lite';
import { Button, Col, DatePicker, Form, Input, Row, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import moment from 'moment';
import { Auth } from '@components';
import './index.scss';
import { useStore } from '@hooks';

const FILTER_FORM_KEY = 'tagFilterForm';

const initTagFilterForm = async () => {
    return {};
};

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;

const Index = createLazyForm(FILTER_FORM_KEY, initTagFilterForm)(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator, resetFields, validateFields } = form;
        const onReset = useCallback(() => {
            resetFields();
        }, [resetFields]);
        const {
            tables: { tagTable },
        } = useStore(['tables']);
        const onSubmit = useCallback(
            event => {
                event.preventDefault();
                validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    tagTable.submitFilters({
                        ...values,
                        createdAt: formatTimeRange(values.createdAt),
                        updatedAt: formatTimeRange(values.updatedAt),
                    });
                    tagTable.fetchData();
                });
            },
            [validateFields, tagTable],
        );
        const formProps: FormProps = {
            className: 'tag-filter-form',
            layout: 'horizontal',
            labelAlign: 'left',
            labelCol: {
                xxl: {
                    span: 5,
                },
                xl: {
                    span: 7,
                },
            },
            wrapperCol: {
                xxl: {
                    span: 19,
                },
                xl: {
                    span: 17,
                },
            },
            onReset,
            onSubmit,
        };
        return (
            <Form {...formProps}>
                <Row type={'flex'} gutter={24}>
                    <Col span={8}>
                        <Item label={'Tag Name'}>
                            {getFieldDecorator('name')(
                                <Input placeholder={'Search tag name'} />,
                            )}
                        </Item>
                    </Col>
                    <Auth
                        requirePermissions={{ tag: 5 }}
                        render={
                            <Col span={8}>
                                <Item label={'Created By'}>
                                    {getFieldDecorator('createdBy')(
                                        <Input
                                            placeholder={'Search create user'}
                                        />,
                                    )}
                                </Item>
                            </Col>
                        }
                    />
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
                </Row>
                <Row>
                    <Col span={24} className={'operations'}>
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
                    </Col>
                </Row>
            </Form>
        );
    }),
);

export default Index;
