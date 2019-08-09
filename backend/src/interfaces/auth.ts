import { ReactElement } from 'react';

export interface ILoginRequest {
    remember: boolean;
    nickname: string;
    password: string;
}

export interface IUserInfo {
    id: number;
    nickname: string;
    email: string;
    phone: string;
    avatar: string;
    sex: number;
    createdAt: string;
    updatedAt: string;
    activated: boolean;
    roles: number[];
}

export interface ILoginResponse {
    token: string;
    privileges: IPrivileges;
    userInfo: IUserInfo;
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

export interface IAuthChecker {
    requirePermissions?: IPermissions;
    requireRoles?: IRoles;
    forbiddenRoles?: IRoles;
    notFound?: boolean;
    requireUser?: string | false;
    fallback?: ReactElement;
}

export interface IRole {
    name: string;
    id: number;
}

export type IExceptionStatus = '404' | '403';
export type IAuthStatus = '401' | '403' | '404' | '200';

export type IUserInfoAndPrivileges = [IUserInfo, IPrivileges];
