import React from 'react';
import { store } from '@stores';
import Context from '@context';
import ImmortalRouter from '@router';

import './App.scss';

const App = () => (
    <Context.Provider value={store}>
        <ImmortalRouter />
    </Context.Provider>
);

export default App;
