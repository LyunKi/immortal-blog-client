import { RootStore } from '@stores';
import { action, computed, observable, runInAction } from 'mobx';
import { message } from 'antd';
import { Navigator, setTokenHeader, Storage } from '@utils';
import { ILoginResponse, IObject, IPrivileges, IUserInfo } from '@interfaces';
import { get } from 'lodash';
import { FormEvent } from 'react';
import { API_PATH } from '@configs';
import { ApiAction } from '@apis';

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

    @action login(event: FormEvent) {
        event.preventDefault();
        this.rootStore.forms.loginForm.post<ILoginResponse>(
            ({ token, privileges, userInfo }) => {
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
            },
            error => {
                message.error(`Login fail,caused by: ${error.message}`);
            },
        );
    }

    @action logout(event: FormEvent) {
        event.preventDefault();
        Storage.removeItem('token');
        Storage.removeItem('user');
        this.userInfo = undefined;
        this.privileges = undefined;
        Navigator.goto('/auth/login');
    }

    @action forbid(ids: number[] | string[]) {
        return ApiAction.forbidUsers(ids).then(num => {
            message.success(`Succeed to forbid ${num} users`);
        });
    }

    @action getSettings(nickname?: string) {
        const queryUser = nickname || get(this.userInfo, 'nickname');
        if (!queryUser) {
            throw new Error('Unknown user');
        }
        return ApiAction.getSettings(queryUser);
    }

    @action register(event: FormEvent) {
        event.preventDefault();
        let autoComplete: IObject = {};
        this.rootStore.forms.registerForm.post(
            () => {
                //register success,and then redirect to the login page
                message.success('Register successfully');
                //create login form store if not exist
                if (!this.rootStore.forms.hasOwnProperty('loginForm')) {
                    this.rootStore.createFormStore('loginForm', API_PATH.login);
                }
                //auto complete the login form
                this.rootStore.forms.loginForm.onValuesChange({
                    nickname: autoComplete.nickname,
                    password: autoComplete.password,
                    remember: true,
                });
                Navigator.goto('/auth/login');
            },
            undefined,
            values => {
                autoComplete = {
                    ...values,
                };
                return values;
            },
        );
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
