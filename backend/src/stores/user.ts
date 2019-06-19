import { RootStore } from '@stores';
import { action, computed, observable, runInAction } from 'mobx';
import { message } from 'antd';
import { Storage, Navigator, setTokenHeader } from '@utils';
import {
    ILoginRequest,
    IPrivileges,
    IRegisterRequest,
    IObject,
    IUserInfo,
} from '@interfaces';
import { AuthApi } from '@apis';
import { get } from 'lodash';

export class UserStore {
    private rootStore: RootStore;

    @computed get hasAuthorized() {
        return !!this.privileges;
    }
    @computed get hasInitialized() {
        return !!this.userInfo;
    }
    @observable userInfo?: IUserInfo;
    @observable privileges?: IPrivileges = undefined;

    @action login(params: ILoginRequest) {
        this.rootStore.forms.loginForm.showLoading();
        AuthApi.login(params)
            .then(({ token, privileges, userInfo }) => {
                //store the token or refresh token
                setTokenHeader(token);
                //get privileges of current user
                runInAction(() => {
                    this.privileges = privileges;
                    this.userInfo = userInfo;
                });
                //login success
                Storage.saveItem('token', token);
                Storage.saveItem('user', {
                    privileges: this.privileges,
                    userInfo: userInfo,
                });
                message.success('Login successfully');
                Navigator.goto('/index');
            })
            .catch(error => {
                message.error(`Login fail,caused by: ${error.message}`);
            })
            .finally(this.rootStore.forms.loginForm.hideLoading);
    }

    @action register(params: IRegisterRequest) {
        this.rootStore.forms.registerForm.showLoading();
        AuthApi.register(params)
            .then(() => {
                //register success,and then redirect to the login page
                message.success('Register successfully');
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
            })
            .finally(this.rootStore.forms.registerForm.hideLoading);
    }

    @action
    initFromStorage() {
        const user = Storage.getItem<IObject>('user');
        if (user !== null) {
            this.userInfo = user.userInfo;
            this.privileges = user.privileges;
        }
    }

    hasRole(role: string) {
        return !!this.privileges && this.privileges.roles.includes(role);
    }

    hasPrivilege(key: string, level: number) {
        return (
            !!this.privileges &&
            Math.max(
                get(this.privileges.permissions, `${key}`, 0),
                get(this.privileges.permissions, 'all', 0),
            ) < level
        );
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.initFromStorage();
    }
}
