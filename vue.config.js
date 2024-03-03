/*
 * @Author: maple_jy
 * @Date: 2023-09-01 18:36:46
 */
const AutoImport = require('unplugin-vue-components/webpack')
const ComponentsPlugin = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
    configureWebpack: {
        plugins: [
            ComponentsPlugin({
                resolvers: [ElementPlusResolver()],
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    },
};
