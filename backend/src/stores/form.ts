import { RootStore } from '@stores';
import { action, observable, runInAction } from 'mobx';
import { IObject } from '@interfaces';
import { each } from 'lodash';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export class FormStore {
    private rootStore: RootStore;

    form?: WrappedFormUtils;

    @observable fields: IObject = {};
    @observable initiated: boolean = false;

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

    @action async init(initFields: () => Promise<IObject>) {
        const fields = await initFields();
        runInAction(() => {
            each(fields, (field, key) => {
                this.fields[key] = {
                    value: field,
                };
            });
            this.initiated = true;
        });
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}
