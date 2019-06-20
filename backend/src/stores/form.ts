import { RootStore } from '@stores';
import { action, observable } from 'mobx';
import { IFunction, IObject } from '@interfaces';
import { each } from 'lodash';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { api } from '@utils';

export class FormStore {
    private rootStore: RootStore;
    form?: WrappedFormUtils;
    @observable fields: IObject = {};
    @observable apiPath: string;

    @observable loading = false;

    @action showLoading = () => {
        this.loading = true;
    };

    @action hideLoading = () => {
        this.loading = false;
    };

    @action onFieldsChange(fields: IObject) {
        each(fields, (field, key) => {
            this.fields[key] = field;
        });
    }

    @action onValuesChange(values: IObject) {
        each(values, (value, key) => {
            this.fields[key] = {
                ...this.fields[key],
                value,
            };
        });
    }

    @action post<T>(
        successAction?: (reply: T) => any,
        failAction?: IFunction,
        borrowValue?: IFunction,
    ) {
        if (!this.form) {
            throw new Error('it should not happened');
        }
        this.form.validateFields((err, value) => {
            if (err) {
                return;
            }
            this.showLoading();
            const transformedValue = borrowValue ? borrowValue(value) : value;
            api.post<T>(this.apiPath, {
                ...transformedValue,
                id: undefined,
            })
                .then(successAction)
                .catch(failAction)
                .finally(this.hideLoading);
        });
    }

    @action put<T>(
        successAction?: (reply: T) => any,
        failAction?: IFunction,
        borrowValue?: IFunction,
    ) {
        if (!this.form) {
            throw new Error('it should not happened');
        }
        this.form.validateFields((err, value) => {
            if (err) {
                return;
            }
            this.showLoading();
            const transformedValue = borrowValue ? borrowValue(value) : value;
            api.put<T>(`${this.apiPath}/:id`, transformedValue)
                .then(successAction)
                .catch(failAction)
                .finally(this.hideLoading);
        });
    }

    resetFields() {
        this.form && this.form.resetFields();
    }

    constructor(rootStore: RootStore, apiPath: string) {
        this.apiPath = apiPath;
        this.rootStore = rootStore;
    }
}
