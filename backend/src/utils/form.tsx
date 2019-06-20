import { each } from 'lodash';
import { Form as AntForm } from 'antd';
import { IObject } from '@interfaces';
import { getStore } from '@stores';
import React, { ComponentType } from 'react';

//Provide a easier way to create a form
export function createLazyForm<T extends ComponentType<any>>(
    formKey: string,
    apiPath: string,
) {
    const store = getStore();
    store.createFormStore(formKey, apiPath);
    const formStore = store.forms[formKey];
    return (Form: T) => () => {
        const EnhancedForm = AntForm.create({
            mapPropsToFields() {
                let formFields: IObject = {};
                each(formStore.fields, (field, key) => {
                    formFields[key] = AntForm.createFormField(field);
                });
                return formFields;
            },
            onFieldsChange(_, changedFields) {
                formStore.onFieldsChange(changedFields);
            },
            onValuesChange(_, changedValues) {
                formStore.onValuesChange(changedValues);
            },
        })(Form);
        return (
            //@ts-ignore
            <EnhancedForm ref={ins => (formStore.form = ins)} />
        );
    };
}
