import { RootStore } from '@stores';
import { action, computed, observable, runInAction } from 'mobx';
import { message } from 'antd';
import { Auth, Storage, Navigator } from '@utils';
import {
    ILoginRequest,
    IPrivileges,
    IRegisterRequest,
    AnyObject,
} from '@interfaces';
import { AuthApi } from '@apis';

export class UserStore {
    private rootStore: RootStore;

    @computed get hasAuthorized() {
        return !!this.privileges;
    }
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

    @action register(params: IRegisterRequest) {
        this.rootStore.forms.registerForm.showLoading();
        AuthApi.register(params).then(() => {
            //register success,and then redirect to the login page
            message.success('Register success');
            this.rootStore
                .createFormStore(
                    'loginForm',
                    async () => {
                        //auto complete the login form
                        return {
                            nickname: params.nickname,
                            password: params.password,
                            remember: true,
                        };
                    },
                    true,
                )
                .then(() => {
                    Navigator.goto('/auth/login');
                });
        });
        this.rootStore.forms.registerForm.hideLoading();
    }

    @action
    initFromStorage() {
        const userInfo = Storage.getItem<AnyObject>('user');
        if (userInfo !== null) {
            this.nickname = userInfo.nickname;
            this.privileges = userInfo.privileges;
        }
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.initFromStorage();
    }
}
