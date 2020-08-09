import React, { useCallback, lazy, Suspense } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import routesConfig from './config';
import { useStore } from '@/store';


const Router = () => {
    const { authStore: { userInfo = {} } } = useStore()

    const checkPermissions = useCallback((permissions, role) => {
        if (!permissions) return true
        return permissions.includes(role)
    },[])


    const renderRoute = (r, userInfo) => {
        //未登录
        // if (Object.keys(userInfo).length === 0) {
        //     return <Redirect
        //         key={r.path}
        //         to={{
        //             pathname: '/login',
        //             state: {
        //                 fromName: r.name
        //             }
        //         }}
        //     />
        // }

        const hasPermission = checkPermissions(r.permissions, userInfo.role)

        if (r.requireAuth === false || hasPermission) {
            return <Route
                key={r.path}
                exact ={ r.exact}
                path={r.path}
                render ={props => {
                    return <r.component 
                        {...props}
                    />
                }}
            />
        } else {
            return <Route 
                key={r.path}
                exact ={ r.exact}
                path={r.path}
                component={lazy(() => import('@/pages/NotAuth'))} 

            />
        }
    }


    const mapRoutes = (routeList, userInfo) => {
        return routeList.map(r => {
            if (r.childRoutes && r.childRoutes.length > 0) {
                return mapRoutes(r.childRoutes, userInfo)
            } else {
                return renderRoute(r, userInfo)
            }
        })
    }



    return <Suspense fallback={<div className="loadingMask">loading</div>}>
        <Switch>
            <Route exact path='/login' component={lazy(() => import('@/pages/Login'))} />
            {mapRoutes(routesConfig, userInfo)}
            <Route component={lazy(() => import('@/pages/NotFound'))} />
        </Switch>
    </Suspense>

}

export default withRouter(Router)
