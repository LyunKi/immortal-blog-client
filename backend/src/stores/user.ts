import { RootStore } from '@stores';
import { action, observable, runInAction } from 'mobx';
import { message } from 'antd';
import { Auth, Storage } from '@utils';
import { ILoginParams } from '@interfaces/auth';
import { AuthApi } from '@apis';

export class UserStore {
    private rootStore: RootStore;

    @observable hasAuthorized = false;
    @observable nickname: string = '';
    @observable privileges: string[] = [];

    @action login(params: ILoginParams) {
        this.rootStore.forms.loginForm.showLoading();
        AuthApi.login(params)
            .then(({ token }) => {
                //store the token and refresh token
                Auth.setToken(token);
                //get privileges of current user
                return AuthApi.getPrivileges().then(({ privileges }) => {
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
                });
            })
            .catch(error => {
                message.error(`Login fail,caused by: ${error.message}`);
            })
            .finally(this.rootStore.forms.loginForm.hideLoading);
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}
