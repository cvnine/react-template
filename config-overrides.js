const path = require('path')
const {
	override,
	addDecoratorsLegacy,
	addWebpackAlias,
	addBundleVisualizer,
	addBabelPlugins,
	addWebpackPlugin,
	getBabelLoader,
	fixBabelImports,
	adjustStyleLoaders,
	addWebpackResolve,
} = require('customize-cra')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

//修改 环境变量
process.env.PORT = 9000
process.env.BROWSER = 'none' //devServer不自动打开浏览器
process.env.GENERATE_SOURCEMAP = false // 生成环境是否打包 Source Map
process.env.PUBLIC_URL = './'

const removePlugin = (plugins, name) => {
	const list = plugins.filter((it) => !(it.constructor && it.constructor.name && name === it.constructor.name))
	if (list.length === plugins.length) {
		throw new Error(`Can not found plugin: ${name}.`)
	}
	return list
}

const overrideGenerateSWConfig = (config, env) => {
	if (process.env.NODE_ENV === 'development') return config

	config.plugins = removePlugin(config.plugins, 'GenerateSW')
	config.plugins.push(
		new WorkboxWebpackPlugin.GenerateSW({
			cacheId: 'main-pwa',
			skipWaiting: true,
			clientsClaim: true,
			offlineGoogleAnalytics: true,
			swDest: 'service-worker.js',
			exclude: [/.*\.html/, /(asset-manifest|manifest)\.json$/, /.*\.(?:png|jpg|jpeg|svg|gif)/],
			runtimeCaching: [
				{
					urlPattern: /.*\.html/,
					handler: 'NetworkFirst',
				},
				{
					urlPattern: /(asset-manifest|manifest).json/,
					handler: 'NetworkFirst',
				},
				{
					urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'image-cache',
						expiration: {
							maxAgeSeconds: 24 * 60 * 60 * 7,
							maxEntries: 50,
						},
					},
				},
				// {
				//     urlPattern: /api/,
				//     handler: 'NetworkFirst',
				//     options: {
				//         cacheName: "api-cache"
				//     }
				// },
			],
		})
	)

	return config
}

const Config = (config, env) => {
	let include = getBabelLoader(config).include
	getBabelLoader(config).include = [include]

	config = adjustStyleLoaders(({ use: [, , , , processor] }) => {
		// pre-processor
		
	})(config, env)

	let extensions = config.resolve.extensions

	config = addWebpackResolve({
		extensions: [...extensions, '.scss', '.css'],
	})(config, env)

	config.resolve.plugins = removePlugin(config.resolve.plugins, 'ModuleScopePlugin')

	return config
}

module.exports = {
	webpack: override(
		overrideGenerateSWConfig,
		...addBabelPlugins('styled-components', 'lodash'),

		fixBabelImports('@kedacom-new/react-base', {
			libraryName: '@kedacom-new/react-base',
			libraryDirectory: 'dist',
			camel2DashComponentName: false,
			style: true,
		}),
		fixBabelImports('lodash', {
			libraryName: 'lodash',
			libraryDirectory: '',
			camel2DashComponentName: false,
		}),

		// 配置路径别名
		addWebpackAlias({ '@': path.join(__dirname, 'src') }),
		// 对Decorators支持
		addDecoratorsLegacy(),

		addWebpackPlugin(
			new LodashModuleReplacementPlugin({
				collections: true,
				paths: true,
			})
		),
		Config,

		// addBundleVisualizer(),
	),

	devServer: (configFunction) => (proxy, allowedHost) => {
		let config = configFunction(proxy, allowedHost)

		config.proxy = {
			'/mock': {
				target: 'http://127.0.0.1:3001/',
				secure: false, //
				changeOrigin: true,
				// rejectUnauthorized: false,
				pathRewrite: {
					'^/mock': '/mock',
				},
			},
		}

		return config
	},

	jest: (config) => {
		config.moduleNameMapper = {
			...config.moduleNameMapper,
			'^@/(.*)$': '<rootDir>/src/$1',
		}
		return config
	},

	paths: (paths, env) => {
		paths.appBuild = path.resolve('dist')
		return paths
	},
}
