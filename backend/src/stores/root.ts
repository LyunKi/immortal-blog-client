import { CommonStore, UserStore, FormStore } from '@stores';
import { AnyMap } from '@interfaces';

export type FormsStore = {
    [key: string]: FormStore;
};

export class RootStore {
    user: UserStore;
    common: CommonStore;
    forms: FormsStore = {};

    constructor() {
        this.user = new UserStore(this);
        this.common = new CommonStore(this);
    }

    newForm(key: string, fields: AnyMap) {
        this.forms[key] = new FormStore(this, fields);
    }
}

const store = new RootStore();

export { store };
