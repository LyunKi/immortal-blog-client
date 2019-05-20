import { AnyObject } from '@interfaces';

export interface ILoginRequest {
    remember: boolean;
    nickname: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    privileges: IPrivileges;
}

export interface IPermissions {
    [key: string]: number;
}

export type IRoles = string[];

export interface IPrivileges {
    roles: IRoles;
    permissions: IPermissions;
}

export interface IRegisterRequest {
    nickname: string;
    password: string;
    email: string;
    sex: number;
}

export type IExceptionStatus = '404' | '403';
export type IAuthStatus = '401' | '403' | '404' | '200';
