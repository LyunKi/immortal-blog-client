import { CommonStore, UserStore, FormStore } from '@stores';
import { AnyObject } from '@interfaces';

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

    newForm(key: string, initFields: () => Promise<AnyObject>) {
        this.forms[key] = new FormStore(this);
        return this.forms[key].init(initFields);
    }
}

const store = new RootStore();

export { store };
