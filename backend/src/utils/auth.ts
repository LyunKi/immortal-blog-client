import { generateAuthorizationHeader } from '@utils/generate';
import { instance } from '@utils/api';

class Auth {
    static setToken(token: string) {
        instance.defaults.headers.common[
            'Authorization'
        ] = generateAuthorizationHeader(token);
    }
}

export { Auth };
