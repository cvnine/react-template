import { lazy } from "react";

let routesConfig = [
    {
        path: '/layout/dashboard',
        name: 'dashboard',
        exact: true,
        permissions: [ 'admin', 'user' ],
        requireAuth: false,
        component: lazy(() => import('@/pages/Dashboard')),
        meta: {
          title: '首页'
        }
    },
]

export default routesConfig
