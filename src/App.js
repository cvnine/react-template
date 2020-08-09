import React from 'react';
import { Provider } from 'mobx-react';
import { stores, StoresContext } from './store';
import { HashRouter as Router } from "react-router-dom";
import Route from './route';

function App() {

    return (
        <Provider {...stores}>
            <StoresContext.Provider value={stores}>
                <Router>
                    <Route />
                </Router>
            </StoresContext.Provider>
        </Provider>
    );
}

export default App;
