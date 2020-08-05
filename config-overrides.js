const path = require('path');
const { merge } = require('webpack-merge');
const {
    override, addDecoratorsLegacy, addLessLoader, fixBabelImports, addWebpackAlias, addWebpackPlugin, addBundleVisualizer
} = require('customize-cra');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

//修改 环境变量
// process.env.PORT = 9000;
process.env.BROWSER = 'none'; //devServer不自动打开浏览器
process.env.GENERATE_SOURCEMAP = false; // 生成环境是否打包 Source Map



const removePlugin = (plugins, name) => {
    const list = plugins.filter(it => !(it.constructor && it.constructor.name && name === it.constructor.name));
    if (list.length === plugins.length) {
        throw new Error(`Can not found plugin: ${name}.`);
    }
    return list;
};


const overrideGenerateSWConfig = (config, env) => {
    if (env === 'development') return config

    config.plugins = removePlugin(config.plugins, 'GenerateSW')
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW({
        cacheId: "main-pwa",
        skipWaiting: true,
        clientsClaim: true,
        offlineGoogleAnalytics: true,
        swDest: 'service-worker.js',
        exclude: [/.*\.html/, /(asset-manifest|manifest)\.json$/, /.*\.(?:png|jpg|jpeg|svg|gif)/],
        runtimeCaching: [
            {
                urlPattern: /.*\.html/,
                handler: 'NetworkFirst'
            }, {
                urlPattern: /(asset-manifest|manifest).json/,
                handler: 'NetworkFirst'
            },
            {
                urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
                handler: 'CacheFirst',
                options: {
                    cacheName: "image-cache",
                    expiration: {
                        maxAgeSeconds: 24 * 60 * 60 * 7,
                        maxEntries: 50
                    }
                }
            },
            // {
            //     urlPattern: /api/,
            //     handler: 'NetworkFirst',
            //     options: {
            //         cacheName: "api-cache"
            //     }
            // },
        ]
    }))

    return config
}

const otherMerge = (config, env) => {
    return merge(config, {})
}


module.exports = {
    webpack: override(
        overrideGenerateSWConfig,

        // 配置路径别名
        addWebpackAlias({ '@': path.join(__dirname, 'src') }),
        // 对Decorators支持
        addDecoratorsLegacy(),

        // addBundleVisualizer()

        otherMerge,
    ),

    devServer: configFunction => (proxy, allowedHost) => {
        let config = configFunction(proxy, allowedHost);

        config.proxy = {
            // '/api': {
            //     target: 'https://localhost:5001/',
            //     secure: false, //
            //     changeOrigin: true,
            //     rejectUnauthorized: false,
            //     pathRewrite: {
            //         '^/api': '/api'
            //     }
            // },
        }


        return config
    },

    jest: config => {

        return config
    },

    paths: (paths, env) => {
        return paths
    }
}
