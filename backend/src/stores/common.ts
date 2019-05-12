import { RootStore } from '@stores';
import { action, observable } from 'mobx';

export class CommonStore {
    private rootStore: RootStore;

    @observable collapsed = false;

    @action onCollapse(collapsed: boolean) {
        this.collapsed = collapsed;
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}
