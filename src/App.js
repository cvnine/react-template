import React from 'react';
import { Provider } from 'mobx-react';
import { stores, StoresContext } from './store';

function App() {

    return (
        <Provider {...stores}>
            <StoresContext.Provider value={stores}>
                <div></div>
            </StoresContext.Provider>
        </Provider>
    );
}

export default App;
