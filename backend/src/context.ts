import { createContext } from 'react';
import { Storage } from '@utils';
import { RootStore, UserStore, CommonStore } from '@stores';

const INITIAL_STATE: RootStore = {
    user: Storage.getItemOrDefault<UserStore>('user', {} as UserStore),
    common: {} as CommonStore,
};

const Context = createContext<RootStore>(INITIAL_STATE);
export default Context;
