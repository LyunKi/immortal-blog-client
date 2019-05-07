import { RootStore } from '@stores';
import { action, observable } from 'mobx';
import { AnyObject } from '@interfaces';
import { each } from 'lodash';

export class FormStore {
    private rootStore: RootStore;

    @observable fields: AnyObject = {};
    @observable initiated: boolean = false;

    @observable loading = false;

    @action showLoading = () => {
        this.loading = true;
    };

    @action hideLoading = () => {
        this.loading = false;
    };

    @action onFieldsChange(fields: AnyObject) {
        each(fields, (field, key) => {
            this.fields[key] = field;
        });
    }

    @action onValuesChange(values: AnyObject) {
        each(values, (value, key) => {
            this.fields[key] = {
                ...this.fields[key],
                value,
            };
        });
    }

    @action init(initFields: () => Promise<AnyObject>) {
        return initFields().then(fields => {
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
