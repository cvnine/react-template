import React, { Suspense, lazy } from 'react'
// import { Provider } from 'mobx-react';
// import { stores, StoresContext } from './store';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { GlobalStyle } from './style'

function App() {
	return (
		<>
			{/* <Provider {...stores}>
                <StoresContext.Provider value={stores}> */}
			<GlobalStyle />
			<Router>
				<Suspense fallback={<div className="loadingMask"></div>}>
					<Switch>
						<Route exact path="/" render={() => <Redirect to="/layout/home" push />} />
						<Route path="/layout" component={lazy(() => import('@/layout'))} />
						<Route component={lazy(() => import('@/pages/NotFound'))} />
					</Switch>
				</Suspense>
			</Router>
			{/* </StoresContext.Provider>
            </Provider> */}
		</>
	)
}

export default App
