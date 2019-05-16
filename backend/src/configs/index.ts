const API_SERVER = '//localhost:8083/api';

const SUCCESS = 200;
const UNKNOWN_ERROR = 500;

const Immortal = {
    Success: {
        code: SUCCESS,
        message: 'Request success',
    },
    UnknownError: {
        code: UNKNOWN_ERROR,
        message: 'Unknown internal server error',
    },
};

const METHOD = {
    get: 'get',
    post: 'post',
    put: 'put',
    delete: 'delete',
};

const DEFAULT_FORBIDDEN = ['untouchable'];

export { API_SERVER, SUCCESS, Immortal, METHOD, DEFAULT_FORBIDDEN };
