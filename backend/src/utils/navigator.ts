import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

class Navigator {
    static replace(path: string) {
        history.replace(path);
    }
    static back() {
        history.goBack();
    }
    static goto(path: string) {
        history.push(path);
    }
}

export { history, Navigator };
