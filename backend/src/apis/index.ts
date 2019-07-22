import { IKeyMap, IObject, IUser } from '@interfaces';
import { api } from '@utils';
import { API_PATH } from '@configs';

export class ApiAction {
    static checkIsRepeated(conditions: IObject) {
        return api.get<boolean>('/users/is_repeated', {
            $query: {
                ...conditions,
            },
        });
    }

    static forbidUsers(ids: number[] | string[]) {
        return api.put<number>('users/forbidden', {
            $query: {
                ids,
            },
        });
    }

    static getSettings(nickname: string) {
        return api.get<IUser>('users/settings', {
            $query: {
                nickname,
            },
        });
    }

    static getRoleOptions() {
        return api.get<IKeyMap>(API_PATH.role_options);
    }

    static activeUsers(ids: number[]) {
        return api.post<IKeyMap>(API_PATH.users_activated, { ids });
    }
}
