import { api } from '@utils';
import { ILoginParams, IPrivileges, IToken } from '@interfaces';

export class AuthApi {
    static login(params: ILoginParams): Promise<IToken> {
        return api.post<IToken>('/login', params);
    }
    static getPrivileges(): Promise<IPrivileges> {
        return api.get<IPrivileges>('/privileges');
    }
}
