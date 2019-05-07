import { RootStore } from '@stores';

export class CommonStore {
    private rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}
