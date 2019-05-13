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

export interface IRegisterRequest {
    nickname: string;
    password: string;
    email: string;
    sex: number;
}

export interface IRegisterRequest {
    nickname: string;
    password: string;
    email: string;
    sex: number;
}
