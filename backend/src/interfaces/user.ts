export interface IUser {
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
