import { api } from '@utils';
import { IObject } from '@interfaces';

export class AuthApi {
    static checkIsRepeated(conditions: IObject) {
        return api.get<boolean>('/users/is_repeated', {
            $query: {
                ...conditions,
            },
        });
    }
}
