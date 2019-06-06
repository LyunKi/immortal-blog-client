import { api } from '@utils';
import {
    ILoginRequest,
    ILoginResponse,
    IObject,
    IPrivileges,
    IRegisterRequest,
    IUserInfo,
} from '@interfaces';

export class AuthApi {
    static login(params: ILoginRequest) {
        return api.post<ILoginResponse>('/login', params);
    }
    static register(params: IRegisterRequest) {
        return api.post<null>('/register', params);
    }
    static getPrivileges() {
        return api.get<IPrivileges>('/privileges');
    }
    static getUserByConditions(conditions: IObject) {
        return api.get<IUserInfo>('/users', {
            $query: {
                ...conditions,
            },
        });
    }
}
