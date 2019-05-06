import { RootStore } from '@stores';
import { action, observable } from 'mobx';
import { AnyMap } from '@interfaces';
import { forEach } from 'lodash';

export class FormStore {
    private rootStore: RootStore;

    @observable fields: AnyMap;

    @action onFieldsChange(fields: AnyMap) {
        forEach(fields, (value, key) => {
            this.fields[key] = value;
        });
    }

    constructor(rootStore: RootStore, fields: AnyMap) {
        this.rootStore = rootStore;
        this.fields = fields;
    }
}
