import './index.scss';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { get } from 'lodash';
import { createLazyForm } from '@utils';
import { API_PATH } from '@configs';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { Col, Form, Input, Row } from 'antd';
import { IObject } from '@interfaces';
import { ImmortalSelect } from '@components';
import { useCheckStatus } from '@hooks';

const Item = Form.Item;
const TextArea = Input.TextArea;

const BlogCreation = createLazyForm('blogCreateForm', API_PATH.blogs)(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator } = form;
        // eslint-disable-next-line
        const status = useCheckStatus({
            requirePermissions: {
                blog: 4,
            },
        });
        const getRequiredFieldDecorator = useCallback(
            (name: string, options?: IObject) => {
                return getFieldDecorator(name, {
                    ...options,
                    rules: [...get(options, 'rules', []), { required: true }],
                });
            },
            [getFieldDecorator],
        );
        const formProps: FormProps = {
            className: 'blog-create-form',
            layout: 'horizontal',
            labelAlign: 'left',
            labelCol: {
                span: 24,
            },
            wrapperCol: {
                span: 24,
            },
        };
        return (
            <Form {...formProps}>
                <Row>
                    <Col span={10}>
                        <Item label={'Title'}>
                            {getRequiredFieldDecorator('title')(
                                <Input placeholder={'Input the blog title'} />,
                            )}
                        </Item>
                    </Col>
                    <Col span={10} offset={4}>
                        <Item label={'Authors'}>
                            {getRequiredFieldDecorator('authors')(
                                <ImmortalSelect
                                    apiPath={API_PATH.author_options}
                                    placeholder='Authors'
                                    mode={'multiple'}
                                    allowClear
                                />,
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label={'Tags'}>
                            {getFieldDecorator('tags')(
                                <ImmortalSelect
                                    apiPath={API_PATH.tag_options}
                                    placeholder='Tags'
                                    mode={'multiple'}
                                    allowClear
                                />,
                            )}
                        </Item>
                    </Col>
                    <Col span={10} offset={4}>
                        <Item label={'Categories'}>
                            {getFieldDecorator('categories')(
                                <ImmortalSelect
                                    apiPath={API_PATH.category_options}
                                    placeholder='Categories'
                                    mode={'multiple'}
                                    allowClear
                                />,
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Item label={'Description'} wrapperCol={{ span: 24 }}>
                        {getFieldDecorator('description')(
                            <TextArea
                                autosize={{ minRows: 5, maxRows: 7 }}
                                maxLength={200}
                                placeholder='Description'
                            />,
                        )}
                    </Item>
                </Row>
            </Form>
        );
    }),
);

export default BlogCreation;
