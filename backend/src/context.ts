import { createContext } from 'react';
import { RootStore } from '@stores';

const INITIAL_STATE = new RootStore();

const Context = createContext<RootStore>(INITIAL_STATE);
export default Context;
