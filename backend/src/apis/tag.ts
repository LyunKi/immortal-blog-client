import { api } from '@utils';
import { ITag } from '@interfaces';

export class TagApi {
    static get_tags() {
        return api.get<ITag[]>('/tags');
    }
}
