import { api } from '@utils';
import {
    ILoginRequest,
    ILoginResponse,
    IPrivileges,
    IRegisterRequest,
} from '@interfaces';

export class AuthApi {
    static login(params: ILoginRequest) {
        return api.post<ILoginResponse>('/login', params);
    }
    static register(params: IRegisterRequest) {
        return api.post<null>('/register', params);
    }
    static getPrivileges(): Promise<IPrivileges> {
        return api.get<IPrivileges>('/privileges');
    }
}
