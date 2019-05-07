import { Form as AntForm, Icon } from 'antd';
import { AnyObject } from '@interfaces';
import { store } from '@stores';
import { each } from 'lodash';
import React, { ComponentType, PureComponent, Suspense } from 'react';

//Provide a easier way to create a form
async function createForm<T extends ComponentType<any>>(
    Form: T,
    formKey: string,
    initFields: () => Promise<AnyObject>,
) {
    await store.newForm(formKey, initFields);
    const formStore = store.forms[formKey];
    return {
        default: AntForm.create({
            mapPropsToFields() {
                let formFields: AnyObject = {};
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
        })(Form),
    };
}

export function createSuspenseForm<T extends ComponentType<any>>(
    Form: T,
    formKey: string,
    initFields: () => Promise<AnyObject>,
) {
    const LazyForm = React.lazy(() => createForm(Form, formKey, initFields));
    return class SuspenseForm extends PureComponent {
        render() {
            return (
                <Suspense fallback={<Icon type={'loading'} />}>
                    {
                        // @ts-ignore
                        <LazyForm />
                    }
                </Suspense>
            );
        }
    };
}
