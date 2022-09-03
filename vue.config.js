const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';
// const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const proxyUrl =
  process.env.BUILD_ENV === 'prod'
    ? 'https://wallet.nerve.network/'
    : 'http://seeda.nuls.io:8009';

const port = process.env.BUILD_ENV === 'prod' ? 8031 : 8033;
module.exports = {
  publicPath: '/',
  configureWebpack: config => {
    // element-plus import es-module
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      );
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        //定义全局变量
        'process.env': {
          BUILD_ENV: JSON.stringify(process.env.BUILD_ENV)
        }
      })
    );
    // element-plus按需引入
    /*config.plugins.push(
      AutoImport({
        resolvers: [ElementPlusResolver()]
      })
    );*/
    config.plugins.push(
      Components({
        resolvers: [ElementPlusResolver()]
      })
    );
    config.optimization.splitChunks = {
      // 添加分包
      chunks: 'all',
      maxAsyncRequests: 5, // 每个异步加载模块最多能被拆分的数量
      maxInitialRequests: 5, // 每个入口和它的同步依赖最多能被拆分的数量
      cacheGroups: {
        'nerve-sdk-js': {
          name: 'sdk-chunk',
          // test: /[\\/]node_modules[\\/](jsrsasign|nerve-sdk-js)/,
          test: /[\\/]node_modules[\\/](nerve-sdk-js|jsrsasign)/,
          priority: -7
        },
        'element-plus': {
          name: 'ui-chunk',
          test: /[\\/]node_modules[\\/](element-plus)/,
          priority: -8
        },
        echarts: {
          name: 'echarts-chunk',
          test: /[\\/]node_modules[\\/](echarts|zrender)/,
          priority: -9
        },
        ethers: {
          name: 'ethers-chunk',
          test: /[\\/]node_modules[\\/](ethers|web3)/,
          priority: -10
        },
        /*vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -20
        }*/
      }
    };
    config.devtool = !isProduction ? 'cheap-module-source-map' : false;
    config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    // config.plugins.push(new BundleAnalyzerPlugin());
  },
  css: {
    // 提取 CSS 在开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容
    extract: !isProduction ? false : { ignoreOrder: true },
    sourceMap: !isProduction
  },

  devServer: {
    port,
    host: '0.0.0.0',
    https: false,
    open: true,
    proxy: {
      '/api': {
        target: proxyUrl,
        changeOrigin: true,
        pathRewrite: {
          // "^/api": ""
        }
      },
      '/test': {
        target: 'http://xm_mp_dev.zhoulijun.top/api',
        changeOrigin: true,
        pathRewrite: {
          '^/test': ''
        }
      }
    }
  }
};
