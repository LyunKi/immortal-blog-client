export interface ILoginParams {
    remember: boolean;
    nickname: string;
    password: string;
}

export interface IToken {
    token: string;
}
export interface IPrivileges {
    privileges: string[];
}
