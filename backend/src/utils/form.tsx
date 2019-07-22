import { each } from 'lodash';
import { Form as AntForm } from 'antd';
import { IObject } from '@interfaces';
import { getStore } from '@stores';
import React, { ComponentType } from 'react';

//Provide a easier way to create a form
export function createLazyForm<T extends ComponentType<any>>(
    formKey: string,
    apiPath: string,
    initialFields?: IObject,
) {
    const store = getStore();
    store.createFormStore(formKey, apiPath);
    initialFields && store.forms[formKey].initFields(initialFields);
    const formStore = store.forms[formKey];
    return (Form: T) => (props: any) => {
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
            <EnhancedForm {...props} ref={ins => (formStore.form = ins)} />
        );
    };
}
