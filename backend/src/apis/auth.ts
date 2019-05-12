import { api } from '@utils';
import { ILoginRequest, ILoginResponse, IPrivileges } from '@interfaces';

export class AuthApi {
    static login(params: ILoginRequest): Promise<ILoginResponse> {
        return api.post<ILoginResponse>('/login', params);
    }
    static getPrivileges(): Promise<IPrivileges> {
        return api.get<IPrivileges>('/privileges');
    }
}
