import { CommonStore, UserStore } from '@stores';

export class RootStore {
    user: UserStore;
    common: CommonStore;
    constructor() {
        this.user = new UserStore(this);
        this.common = new CommonStore(this);
    }
}

const store = new RootStore();

export { store };
