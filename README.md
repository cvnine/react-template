## react 模板

create-react-app 结合 react-app-rewired 的形式。

技术栈：react、mobx、scss


- [ ] workbox 待测试

----

## 额外配置说明

#### 关闭 PWA

在 入口文件 index.js 将 `serviceWorker.register();` 改为 `serviceWorker.unregister();`


#### 在本模板基础上增加 Ant Design 组件库需自行增加如下步骤
1. 安装依赖
```
yarn add less less-loader antd-dayjs-webpack-plugin babel-plugin-import -D

yarn add antd
```

2. 在 config-overrides.js 增加如下代码
```diff
+ const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
    webpack: override(
        ...
+        //按需 antd 的 css
+        fixBabelImports('import', {
+            libraryName: 'antd',
+            libraryDirectory: 'es',
+            style: true,
+        }),
+        addLessLoader({
+            javascriptEnabled: true,
+            // modifyVars: { '@primary-color': '#1DA57A' }, //自定义主题样式
+            // localIdentName: '[local]--[hash:base64:5]' // 自定义 CSS Modules +的 localIdentName
+        }),
+        //用 dayjs 替换antd的 momentjs
+        addWebpackPlugin(new AntdDayjsWebpackPlugin()),
        ...
    ),
    ...
}

```



