import { RootStore } from '@stores';
import { action, computed, observable } from 'mobx';

export class CommonStore {
    private rootStore: RootStore;

    @observable collapsed = false;
    @computed get marginMenu() {
        return this.collapsed ? 'margin-collapsed-menu' : 'margin-menu';
    }

    @action onCollapse(collapsed: boolean) {
        this.collapsed = collapsed;
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}
