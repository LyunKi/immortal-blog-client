import React from 'react';
import { Form, Input, message } from 'antd';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { observer } from 'mobx-react-lite';
import { createLazyForm } from '@utils';
import { APi_PATH } from '@configs';
import { ImmortalButton } from '@components';
import { useStore } from '@hooks';
import './index.scss';

const Item = Form.Item;
const { TextArea } = Input;

const TABLE_FORM_KEY = 'categoryTableForm';

const CategoryTableForm = createLazyForm(TABLE_FORM_KEY, APi_PATH.categories)(
    observer(({ form }: FormComponentProps) => {
        const {
            tables: { categoryTable },
            forms: { categoryTableForm },
        } = useStore(['tables', 'forms']);
        const { getFieldDecorator } = form;
        const formProps: FormProps = {
            className: 'category-table-form',
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 19,
            },
        };
        return (
            <Form {...formProps}>
                <Item label={'Name'}>
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                    })(<Input placeholder='Name' />)}
                </Item>
                <Item label={'Description'}>
                    {getFieldDecorator('description')(
                        <TextArea
                            autosize={{ minRows: 5, maxRows: 7 }}
                            maxLength={200}
                            placeholder='Description'
                        />,
                    )}
                </Item>
                <Item label={' '} colon={false} className={'operation-row'}>
                    <div className={'operations'}>
                        <ImmortalButton
                            confirm={{
                                title: 'Sure to give up',
                            }}
                            button={{
                                className: 'operation',
                                loading: categoryTableForm.loading,
                                text: 'Cancel',
                            }}
                            action={categoryTable.cancelChange.bind(
                                categoryTable,
                            )}
                        />
                        <ImmortalButton
                            auth={{ requirePermissions: { category: 3 } }}
                            button={{
                                text: 'Confirm',
                                type: 'primary',
                                className: 'operation',
                                loading: categoryTableForm.loading,
                            }}
                            action={categoryTable.confirmAction.bind(
                                categoryTable,
                                () => {
                                    message.success('Operate successfully');
                                    categoryTableForm.resetFields();
                                    categoryTable.cancelChange();
                                    categoryTable.fetchData();
                                },
                                undefined,
                                value => ({
                                    ...value,
                                    id: form.getFieldValue('id'),
                                }),
                            )}
                        />
                    </div>
                </Item>
            </Form>
        );
    }),
);
export default CategoryTableForm;
