import { RootStore } from '@stores';
import { action, observable } from 'mobx';

export class CommonStore {
    private rootStore: RootStore;

    @observable loading = false;

    @action showLoading = () => {
        this.loading = true;
    };

    @action hideLoading = () => {
        this.loading = false;
    };

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}
