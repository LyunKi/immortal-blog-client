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

    async createFormStore(
        key: string,
        initFields: () => Promise<AnyObject>,
        refresh: boolean = false,
    ) {
        if (this.forms.hasOwnProperty(key)) {
            //form had been created
            return refresh && this.forms[key].init(initFields);
        }
        this.forms[key] = new FormStore(this);
        return this.forms[key].init(initFields);
    }
}

const store = new RootStore();

export { store };
