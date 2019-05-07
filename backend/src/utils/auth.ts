import { generateAuthorizationHeader, instance } from '@utils';

class Auth {
    static setToken(token: string) {
        instance.defaults.headers.common[
            'Authorization'
        ] = generateAuthorizationHeader(token);
    }
}

export { Auth };
