import React, { lazy, Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { routesConfig, IPermissions, IRoutesConfig } from './config'

interface UserInfo {
	role?: IPermissions
}

function checkPermissions(permissions: IPermissions[], role: IPermissions | undefined): boolean {
	if (!permissions) return true
	if (!role) return false
	return permissions.includes(role)
}

function renderRoute(r: IRoutesConfig, userInfo: UserInfo): React.ReactNode {
	const hasPermission = checkPermissions(r.permissions, userInfo.role)

	if (r.requireAuth === false || hasPermission) {
		return (
			<Route
				key={r.path}
				exact={r.exact}
				path={r.path}
				render={(props) => {
					return <r.component {...props} />
				}}
			/>
		)
	} else {
		return <Route key={r.path} exact={r.exact} path={r.path} component={lazy(() => import('@/pages/NotAuth'))} />
	}
}

function mapRoutes(routeList: IRoutesConfig[], userInfo: UserInfo): React.ReactNode {
	return routeList.map((r) => {
		if (r.childRoutes && r.childRoutes.length > 0) {
			return mapRoutes(r.childRoutes, userInfo)
		} else {
			return renderRoute(r, userInfo)
		}
	})
}

const Router = () => {
	const userInfo: UserInfo = {}

	return (
		<Suspense fallback={<div></div>}>
			<Switch>
				{mapRoutes(routesConfig, userInfo)}
				<Route component={lazy(() => import('@/pages/NotFound'))} />
			</Switch>
		</Suspense>
	)
}

export default withRouter(Router)
