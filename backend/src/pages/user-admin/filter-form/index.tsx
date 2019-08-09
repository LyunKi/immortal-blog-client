import { createLazyForm, formatTimeRange } from '@utils';
import { observer } from 'mobx-react-lite';
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Tooltip,
} from 'antd';
import React, { useCallback } from 'react';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import moment from 'moment';
import './index.scss';
import { useStore } from '@hooks';
import { API_PATH } from '@configs';
import { ImmortalSelect } from '@components';

const FILTER_FORM_KEY = 'userFilterForm';
const Item = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const UserFilterForm = createLazyForm(FILTER_FORM_KEY, API_PATH.users)(
    observer(({ form }: FormComponentProps) => {
        const {
            forms: { userFilterForm },
            tables: { userTable },
        } = useStore(['forms', 'tables']);
        const { getFieldDecorator, validateFields } = form;
        const onSubmit = useCallback(
            event => {
                event.preventDefault();
                validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    userTable.submitFilters({
                        ...values,
                        createdAt: formatTimeRange(values.createdAt),
                        updatedAt: formatTimeRange(values.updatedAt),
                    });
                    userTable.fetchData();
                });
            },
            [validateFields, userTable],
        );
        const formProps: FormProps = {
            className: 'user-filter-form',
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
            onReset: userFilterForm.resetFields.bind(userFilterForm),
            onSubmit,
        };
        return (
            <Form {...formProps}>
                <Row type={'flex'} gutter={24}>
                    <Col span={8}>
                        <Item label={'Nickname'}>
                            {getFieldDecorator('nickname')(
                                <Input placeholder={'Search user nickname'} />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'User Email'}>
                            {getFieldDecorator('email', {
                                rules: [{ type: 'email' }],
                            })(<Input type={'email'} placeholder='Email' />)}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'User Gender'}>
                            {getFieldDecorator('sex', {
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                            })(
                                <Select
                                    placeholder='User Gender'
                                    showSearch
                                    optionFilterProp={'children'}
                                    allowClear
                                >
                                    <Option value={0}>Male</Option>
                                    <Option value={1}>Female</Option>
                                    <Option value={2}>Unknown Gender</Option>
                                </Select>,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'User Roles'}>
                            {getFieldDecorator('roles')(
                                <ImmortalSelect
                                    apiPath={API_PATH.role_options}
                                    placeholder='User Roles'
                                    mode={'multiple'}
                                    allowClear
                                />,
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

export default UserFilterForm;
