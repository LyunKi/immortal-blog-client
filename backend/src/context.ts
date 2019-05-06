import { createContext } from 'react';
import { Storage } from '@utils';
import { RootStore, UserStore } from '@stores';

const INITIAL_STATE = new RootStore();
INITIAL_STATE.user = Storage.getItemOrDefault<UserStore>(
    'user',
    {} as UserStore,
);

const Context = createContext<RootStore>(INITIAL_STATE);
export default Context;
