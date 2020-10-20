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
const HtmlWebpackPlugin = require('html-webpack-plugin')

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

const kedacomConfig = (config, env) => {
	let include = getBabelLoader(config).include
	getBabelLoader(config).include = [include, /node_modules(\\|\/)@kedacom-new(\\|\/)react-base/]

	config = adjustStyleLoaders(({ use: [, , , , processor] }) => {
		// pre-processor
		if (processor && processor.loader.includes('sass-loader')) {
			processor.options.prependData = `@import "@kedacom-new/react-base/theme/index.scss";`
		}
	})(config, env)

	let extensions = config.resolve.extensions

	config = addWebpackResolve({
		extensions: [...extensions, '.scss', '.css'],
	})(config, env)

	config.resolve.plugins = removePlugin(config.resolve.plugins, 'ModuleScopePlugin')

	return config
}

const ToolsConfig = (config, env) => {
	const paths = require('react-scripts/config/paths')
	const getClientEnvironment = require('react-scripts/config/env')
	const envR = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))
	const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false'
	const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
	const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')

	let plugin = [
		new HtmlWebpackPlugin(
			Object.assign(
				{},
				{
					inject: true,
					template: path.resolve(__dirname, './public/index_full.html'),
					filename: 'index_full.html',
				},
				'development' !== process.env.NODE_ENV
					? {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true,
							},
					  }
					: undefined
			)
		),
		'development' !== process.env.NODE_ENV &&
			shouldInlineRuntimeChunk &&
			new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, envR.raw),
	]

	config.plugins = [...plugin.filter(Boolean), ...config.plugins]

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
		kedacomConfig,
		ToolsConfig

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
