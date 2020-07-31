'use strict';

const ThemeColorReplacer = require('webpack-theme-color-replacer');
const forElementUI = require('webpack-theme-color-replacer/forElementUI');
const path = require('path');
const pkg = require('./package.json');

// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir);
}

// 当前版本
process.env.VUE_APP_VERSION = pkg.VUE_APP_VERSION;

const name = 'BeEver企业应用中台软件'; // page title
/**
 *  基础路径 注意发布之前要先修改这里
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://cloud.pactera.com/ibps/,
   * then publicPath should be set to "/ibps/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
// const publicPath = '/'
const publicPath = './';
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: publicPath,
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    }
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `http://127.0.0.1:${port}/mock`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // }
    // after: require('./mock/mock-server.js')
  },
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       implementation: require('sass'), // This line must in sass option
  //     },
  //   },
  // },
  configureWebpack: {

    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        'vue$': 'vue/dist/vue.esm.js',
        'platform': resolve('src/views/platform')
      }
    }
  },
  chainWebpack(config) {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    /*   config.plugins.delete('preload');
      config.plugins.delete('prefetch'); */
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    // 换色
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
        ],
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector
      }]);
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
    // image exclude
    const imagesRule = config.module.rule('images');
    imagesRule
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .exclude
      .add(resolve('src/icons/svgs'))
      .end();

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // 开发环境
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      );

    // 非开发环境
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end();
          /* config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 15, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                echarts: {
                  name: 'chunk-echarts', // 单独将 echarts 拆包
                  test: /[\\/]node_modules[\\/]_?echarts(.*)/,
                  priority: 20
                },
                vueEcharts: {
                  name: 'chunk-vue-echarts', // 单独将 echarts 拆包
                  test: /[\\/]node_modules[\\/]_?vue-echarts(.*)/,
                  priority: 21
                },
                pdfjs: {
                  name: 'chunk-pdfjs',
                  test: /[\\/]node_modules[\\/]_?pdfjs-dist(.*)/,
                  priority: 22
                },
                hlsjs: {
                  name: 'chunk-hlsjs',
                  test: /[\\/]node_modules[\\/]_?hls.js(.*)/,
                  priority: 23
                },
                fullcalendar: {
                  name: 'chunk-fullcalendar',
                  test: /[\\/]node_modules[\\/]_?fullcalendar(.*)/,
                  priority: 24
                },
                videojs: {
                  name: 'chunk-videojs',
                  test: /[\\/]node_modules[\\/]_?video.js(.*)/,
                  priority: 25
                },
                pinyin4js: {
                  name: 'chunk-pinyin4js',
                  test: /[\\/]node_modules[\\/]_?pinyin4js(.*)/,
                  priority: 26
                },
                bpmnjs: {
                  name: 'chunk-bpmnjs',
                  test: /[\\/]node_modules[\\/]_?bpmn-js(.*)/,
                  priority: 27
                },
                diagramjs: {
                  name: 'chunk-diagramjs',
                  test: /[\\/]node_modules[\\/]_?diagram-js(.*)/,
                  priority: 28
                },
                codemirror: {
                  name: 'chunk-codemirror',
                  test: /[\\/]node_modules[\\/]_?codemirror(.*)/,
                  priority: 29
                },
                highlightjs: {
                  name: 'chunk-highlightjs',
                  test: /[\\/]node_modules[\\/]_?highlight.js(.*)/,
                  priority: 30
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            });
          config.optimization.runtimeChunk('single'); */
        }
      );
  },
  pluginOptions: {
    dll: {
      // 入口配置
      entry: {
        vue: 'vue/dist/vue.runtime.esm.js',
        vuex: 'vuex',
        vueRouter: 'vue-router',
        axios: 'axios',
        elementUi: 'element-ui',
        echarts: 'echarts',
        vueEcharts: 'vue-echarts',
        echartsLiquidfill: 'echarts-liquidfill',
        diagramJsMinimap: "diagram-js-minimap",
        diagramJsOrigin: "diagram-js-origin",
        bpmnJsPropertiesPanel: "bpmn-js-properties-panel",
        camundaBpmnBoddle: "camunda-bpmn-moddle",
        lodash: 'lodash',
        handsontable: 'handsontable',
        vueHighlightjs: 'vue-highlightjs',
        vJsoneditor: "v-jsoneditor",
        videoJs: 'video.js',
        viewerjs: 'viewerjs',
        pdfjsDist: 'pdfjs-dist',
        pinyin4js: "pinyin4js",
        codemirror: 'codemirror',
        betterScroll: 'better-scroll',
        localstorageCache: 'localstorage-cache',
        hlsJs: 'hls.js',
        fuseJs: 'fuse.js',
        hotkeysJs: "hotkeys-js",
        cryptoJs: "crypto-js",
        lowdb: "lowdb",
        fullcalendarCore: "@fullcalendar/core",
        mockjs: "mockjs"

      },
      // 输出目录
      output: resolve('./src/assets/dll'),

      // 是否开启 DllReferencePlugin,
      // 默认情况下，插件没有检测到 vendor (执行 `npm run dll` 指令生成的 chunk 包)，会自动关闭。
      // 在有需要的情况下可以手动关闭插件，例如：
      // 1. 为了在开发环境使用vue代码中的提示，可配置只在生产环境开启分包模式，`open : process.env.NODE_ENV === 'production'`。
      // 2. 在构建目标(`target`)为 `node`，需要手动关闭 dll 插件。
      open: true,

      // 自动注入到 index.html
      // 在执行 `dev` , `build` 等其他指令时，程序会自动将 `dll` 指令生成的 `*.dll.js` 等文件自动注入到 index.html 中。
      inject: true,
    }
  }
};
