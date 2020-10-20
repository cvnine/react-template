import { lazy } from 'react'

export type IPermissions = 'admin' | 'user'

export type IRoutesConfig = {
	path: string
	name: string
	exact: boolean
	permissions: IPermissions[]
	requireAuth: boolean
	component: React.LazyExoticComponent<any>
	childRoutes?: IRoutesConfig[]
	meta: {
		title: string
		[params: string]: any
	}
}

export const routesConfig: IRoutesConfig[] = [
	{
		path: '/layout/home',
		name: 'home',
		exact: true,
		permissions: ['admin', 'user'],
		requireAuth: false,
		component: lazy(() => import('@/pages/Home')),
		meta: {
			title: '首页',
		},
	},
]
