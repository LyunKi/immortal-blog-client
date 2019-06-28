import { IKeyMap, IObject } from '@interfaces';
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

    static getRoleOptions() {
        return api.get<IKeyMap>(API_PATH.role_options);
    }
}
