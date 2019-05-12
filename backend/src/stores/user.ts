import { RootStore } from '@stores';
import { action, observable, runInAction } from 'mobx';
import { message } from 'antd';
import { Auth, Storage, Navigator } from '@utils';
import { ILoginRequest, IPrivileges } from '@interfaces/auth';
import { AuthApi } from '@apis';
import { AnyObject } from '@interfaces';

export class UserStore {
    private rootStore: RootStore;

    @observable hasAuthorized = false;
    @observable nickname: string = '';
    @observable privileges?: IPrivileges = undefined;

    @action login(params: ILoginRequest) {
        this.rootStore.forms.loginForm.showLoading();
        AuthApi.login(params)
            .then(({ token, privileges }) => {
                //store the token and refresh token
                Auth.setToken(token);
                //get privileges of current user
                runInAction(() => {
                    this.privileges = privileges;
                    this.nickname = params.nickname;
                    this.hasAuthorized = true;
                });
                //login success
                Storage.saveItem('token', token);
                Storage.saveItem('user', {
                    privileges: this.privileges,
                    nickname: this.nickname,
                    hasAuthorized: this.hasAuthorized,
                });
                message.success('Login success');
                Navigator.goto('/index');
            })
            .catch(error => {
                message.error(`Login fail,caused by: ${error.message}`);
            })
            .finally(this.rootStore.forms.loginForm.hideLoading);
    }

    @action
    initFromStorage() {
        const userInfo = Storage.getItem<AnyObject>('user');
        if (userInfo !== null) {
            this.hasAuthorized = userInfo.hasAuthorized;
            this.nickname = userInfo.nickname;
            this.privileges = userInfo.privileges;
        }
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.initFromStorage();
    }
}
