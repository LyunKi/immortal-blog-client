import {
    CommonStore,
    FormStore,
    IConfig,
    TableStore,
    UserStore,
} from '@stores';

export type StoreCollection<T> = {
    [key: string]: T;
};

export class RootStore {
    user: UserStore;
    common: CommonStore;
    forms: StoreCollection<FormStore> = {};
    tables: StoreCollection<TableStore<any>> = {};

    constructor() {
        this.user = new UserStore(this);
        this.common = new CommonStore(this);
    }

    createFormStore(key: string, apiPath: string, refresh: boolean = false) {
        if (this.forms.hasOwnProperty(key) && !refresh) {
            //form had been created
            return;
        }
        this.forms[key] = new FormStore(this, apiPath);
    }

    createTableStore<T>(
        key: string,
        apiPath: string,
        formKey?: string,
        configs?: IConfig<T>,
        refresh: boolean = false,
    ) {
        if (this.tables.hasOwnProperty(key) && !refresh) {
            return;
        }
        this.tables[key] = new TableStore(this, apiPath);
        //set table configs
        configs && this.tables[key].setConfig(configs);
        //bind form
        formKey && this.tables[key].bindForm(formKey);
    }
}

const store = new RootStore();

const getStore = () => {
    return store;
};

// @ts-ignore
export { store, getStore };
