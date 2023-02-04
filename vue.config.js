const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false, //打包不生成map
  transpileDependencies: true,
    //配置代理服务器解决跨域
    devServer: {
      proxy: {
        '/api': {
          // 'http://39.108.110.17:8081'
          target:  'http://39.108.110.17:8081',
          ws: true,
          changeOrigin: true,      
          pathRewrite: {
            '^/api': '' // 思路是如果是开发环境，就给所有要代理的接口统一加上前缀，然后代理请求时再统一通过rewrite去掉
        }
        },
      }
    }
})
