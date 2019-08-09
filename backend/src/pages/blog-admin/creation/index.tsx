import './index.scss';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import { api, beforeUpload, createLazyForm } from '@utils';
import { API_PATH } from '@configs';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { Button, Col, Form, Icon, Input, Row, Upload } from 'antd';
import { IObject } from '@interfaces';
import { ImmortalSelect } from '@components';
import { useCheckStatus, useStore } from '@hooks';
// @ts-ignore
import { ContentUtils } from 'braft-utils';
import BraftEditor, { ExtendControlType } from 'braft-editor';
import 'braft-editor/dist/index.css';

const Item = Form.Item;
const TextArea = Input.TextArea;

const BlogCreation = createLazyForm('blogCreateForm', API_PATH.blogs)(
    observer(({ form }: FormComponentProps) => {
        const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
        const {
            forms: { blogCreateForm },
        } = useStore(['forms']);
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
        const handleChange = useCallback(
            info => {
                if (info.file.status === 'uploading') {
                    blogCreateForm.showLoading();
                    return;
                }
                if (info.file.status === 'done') {
                    const content = getFieldValue('content');
                    setFieldsValue({
                        content: ContentUtils.insertMedias(content, [
                            {
                                type: 'IMAGE',
                                url: info.file.response[0],
                            },
                        ]),
                    });
                }
            },
            [getFieldValue, setFieldsValue, blogCreateForm],
        );
        const customRequest = useCallback(
            (info: IObject) => {
                const file = info.file;
                api.upload([file], {
                    onUploadProgress: (progressEvent: any) => {
                        const percent =
                            (progressEvent.loaded / progressEvent.total) | 0;
                        info.onProgress({ percent: percent });
                    },
                })
                    .then(urls => {
                        info.onSuccess(urls);
                    })
                    .catch(info.onError)
                    .finally(blogCreateForm.hideLoading.bind(blogCreateForm));
            },
            [blogCreateForm],
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
        const initEditorState = useMemo(() => {
            BraftEditor.createEditorState(null);
        }, []);
        const extendControls: ExtendControlType[] = useMemo(() => {
            return [
                {
                    key: 'antd-uploader',
                    type: 'component',
                    component: (
                        <Upload
                            accept='image/*'
                            showUploadList={false}
                            multiple
                            customRequest={customRequest}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                        >
                            <Button
                                className='control-item button upload-button'
                                data-title='insert pictures'
                            >
                                <Icon type='picture' theme='filled' />
                            </Button>
                        </Upload>
                    ),
                },
            ];
        }, [handleChange, customRequest]);

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
                <Row>
                    <Item label={'Content'} wrapperCol={{ span: 24 }}>
                        {getFieldDecorator('content', {
                            validateTrigger: 'onBlur',
                            initialValue: initEditorState,
                            rules: [
                                {
                                    required: true,
                                    validator: (_, value, callback) => {
                                        if (value.isEmpty()) {
                                            callback(
                                                'Please input some content',
                                            );
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ],
                        })(
                            <BraftEditor
                                language={'en'}
                                className='immortal-editor'
                                extendControls={extendControls}
                                placeholder='Please input some content'
                            />,
                        )}
                    </Item>
                </Row>
            </Form>
        );
    }),
);

export default BlogCreation;
