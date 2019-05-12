import { AnyObject } from '@interfaces/index';

export interface ILoginRequest {
    remember: boolean;
    nickname: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    privileges: IPrivileges;
}
export interface IPrivileges {
    roles: String[];
    permissions: AnyObject;
}
