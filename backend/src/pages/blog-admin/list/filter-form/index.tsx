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

const FILTER_FORM_KEY = 'blogFilterForm';

const Item = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const BlogFilterForm = createLazyForm(FILTER_FORM_KEY, API_PATH.login)(
    observer(({ form }: FormComponentProps) => {
        const {
            forms: { blogFilterForm },
            tables: { blogTable },
        } = useStore(['forms', 'tables']);
        const { getFieldDecorator, validateFields } = form;
        const onSubmit = useCallback(
            event => {
                event.preventDefault();
                validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    blogTable.submitFilters({
                        ...values,
                        createdAt: formatTimeRange(values.createdAt),
                        updatedAt: formatTimeRange(values.updatedAt),
                    });
                    blogTable.fetchData();
                });
            },
            [validateFields, blogTable],
        );
        const formProps: FormProps = {
            className: 'blog-filter-form',
            layout: 'horizontal',
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
            onReset: blogFilterForm.resetFields.bind(blogFilterForm),
            onSubmit,
        };
        return (
            <Form {...formProps}>
                <Row type={'flex'} gutter={24}>
                    <Col span={8}>
                        <Item label={'Title'}>
                            {getFieldDecorator('title')(
                                <Input placeholder={'Search blog title'} />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Tags'}>
                            {getFieldDecorator('tags')(
                                <ImmortalSelect
                                    apiPath={API_PATH.tag_options}
                                    placeholder='Search Tags'
                                    mode={'multiple'}
                                    allowClear
                                />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Categories'}>
                            {getFieldDecorator('categories')(
                                <ImmortalSelect
                                    apiPath={API_PATH.category_options}
                                    placeholder='Search Categories'
                                    mode={'multiple'}
                                    allowClear
                                />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Authors'}>
                            {getFieldDecorator('authors')(
                                <ImmortalSelect
                                    apiPath={API_PATH.author_options}
                                    placeholder='Authors'
                                    mode={'multiple'}
                                    allowClear
                                />,
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label={'Published'}>
                            {getFieldDecorator('published')(
                                <Select
                                    optionFilterProp={'children'}
                                    placeholder='Search published'
                                    allowClear
                                >
                                    <Option value={1}>unpublished</Option>
                                    <Option value={2}>published</Option>
                                </Select>,
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
                        <Item label={'Updated By'}>
                            {getFieldDecorator('updatedBy')(
                                <Input placeholder={'Search updated user'} />,
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

export default BlogFilterForm;
