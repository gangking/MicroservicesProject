
<template>
  <div v-on="listeners">
    <script ref="script" :name="name" type="text/plain" />
  </div>
</template>

<script>
// 参考代码   https://github.com/HaoChuan9421/vue-ueditor-wrap 的v2.4.1版本[2019-05-30]
import LoadEvent from './utils/Event.js'
import Debounce from './utils/Debounce.js'
import defaultConfig from './ueditor.config'

export default {
  name: 'ibps-ueditor',
  props: {
    // v-model 实现方式
    mode: {
      type: String,
      default: 'observer',
      validator: function(value) {
        // 1. observer 借助 MutationObserver API https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
        // 2. listener 借助 UEditor 的 contentChange 事件 https://ueditor.baidu.com/doc/#UE.Editor:contentChange
        return ['observer', 'listener'].indexOf(value) !== -1
      }
    },
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: function() {
        return {}
      }
    },
    init: {
      type: Function,
      default: function() {
        return () => {}
      }
    },
    id: {
      type: String,
      default: function() {
        return 'ibps-ueidtor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    destroy: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    observerDebounceTime: {
      type: Number,
      default: 50,
      validator: function(value) {
        return value >= 20
      }
    },
    observerOptions: {
      type: Object,
      default: function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
        return {
          attributes: true, // 是否监听 DOM 元素的属性变化
          attributeFilter: ['src', 'style', 'type', 'name'], // 只有在该数组中的属性值的变化才会监听
          characterData: true, // 是否监听文本节点
          childList: true, // 是否监听子节点
          subtree: true // 是否监听后代元素
        }
      }
    },
    // 本组件提供对普通 Vue 项目和 Nuxt 项目开箱即用的支持，但如果是自己搭建的 Vue SSR 项目，可能需要自行区分是客户端还是服务端环境并跳过环境检测，直接初始化
    forceInit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status: 0,
      initValue: '',
      defaultConfig: defaultConfig
    }
  },
  computed: {
    mixedConfig() {
      return Object.assign({ readonly: this.readonly }, this.defaultConfig, this.config)
    },
    listeners() {
      return {
        ...this.$listeners
      }
    }
  },
  // v-model语法糖实现
  watch: {
    value: {
      handler(value) {
        // 0: 尚未初始化 1: 开始初始化但尚未ready 2 初始化完成并已ready
        switch (this.status) {
          case 0:
            this.status = 1
            this.initValue = value;
            // 判断执行环境是服务端还是客户端，这里的 process.client 是 Nuxt 添加的环境变量
            (this.forceInit || (typeof process !== 'undefined' && process.client) || typeof window !== 'undefined') && this._checkDependencies().then(() => {
              this.$refs.script ? this._initEditor() : this.$nextTick(() => this._initEditor())
            })
            break
          case 1:
            this.initValue = value
            break
          case 2:
            this._setContent(value)
            break
          default:
            break
        }
      },
      immediate: true
    }
  },
  deactivated() {
    this.editor && this.editor.removeListener('contentChange', this.contentChangeHandler)
    this.observer && this.observer.disconnect()
  },
  beforeDestroy() {
    this.destroyEditor()
  },
  methods: {
    // 实例化编辑器
    _initEditor() {
      this.$refs.script.id = this.id || 'ibps-ueidtor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '') // 这么做是为了支持 Vue SSR，因为如果把 id 属性放在 data 里会导致服务端和客户端分别计算该属性的值，而造成 id 不匹配无法初始化的 BUG
      this.init()
      console.log('实例化编辑器风格数据',this.mixedConfig)
      // this.$emit('beforeInit', this.id, this.mixedConfig)
      this.editor = window.UE.getEditor(this.id, this.mixedConfig)
    },
    // 检测依赖,确保 UEditor 资源文件已加载完毕
    _checkDependencies() {
      return new Promise((resolve, reject) => {
        // 判断ueditor.config.js和ueditor.all.js是否均已加载(仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象存在,但为空对象)
        const scriptsLoaded = !!window.UE && !!window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0 && !!window.UE.getEditor
        if (scriptsLoaded) {
          resolve()
        } else if (window['$loadEnv']) { // 利用订阅发布，确保同时渲染多个组件时，不会重复创建script标签
          window['$loadEnv'].on('scriptsLoaded', () => {
            resolve()
          })
        } else {
          window['$loadEnv'] = new LoadEvent()
          // 如果在其他地方只引用ueditor.all.min.js，在加载ueditor.config.js之后仍需要重新加载ueditor.all.min.js，所以必须确保ueditor.config.js已加载
          this._loadConfig().then(() => this._loadCore()).then(() => {
            resolve()
            window['$loadEnv'].emit('scriptsLoaded')
          })
        }
      })
    },
    _loadConfig() {
      return new Promise((resolve, reject) => {
        if (window.UE && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0) {
          resolve()
          return
        }
        const configScript = document.createElement('script')
        configScript.type = 'text/javascript'
        configScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'ueditor.config.js'
        document.getElementsByTagName('head')[0].appendChild(configScript)
        configScript.onload = function() {
          if (window.UE && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0) {
            resolve()
          } else {
            console.error('加载ueditor.config.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!\n', configScript.src)
          }
        }
      })
    },
    _loadCore() {
      return new Promise((resolve, reject) => {
        if (window.UE && window.UE.getEditor) {
          resolve()
          return
        }
        const coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'ueditor.all.min.js'
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function() {
          if (window.UE && window.UE.getEditor) {
            resolve()
          } else {
            console.error('加载ueditor.all.min.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!\n', coreScript.src)
          }
        }
      })
    },
    // 设置内容
    _setContent(value) {
      value === this.editor.getContent() || this.editor.setContent(value)
    },
    // 获取内容
    getUEContent(){
      return this.editor.getPlainTxt();
    },
    contentChangeHandler() {
      this.$emit('input', this.editor.getContent())
    },
    execCommand(cmd, params) {
      this.editor.execCommand(cmd, params)
    },
    // 基于 UEditor 的 contentChange 事件
    _normalChangeListener() {
      this.editor.addListener('contentChange', this.contentChangeHandler)
    },
    // 基于 MutationObserver API
    _observerChangeListener() {
      const changeHandle = (mutationsList) => {
        if (this.editor.document.getElementById('baidu_pastebin')) {
          return
        }
        this.$emit('input', this.editor.getContent())
      }
      // 函数防抖
      this.observer = new MutationObserver(Debounce(changeHandle, this.observerDebounceTime))
      this.observer.observe(this.editor.body, this.observerOptions)
    },
    // 销毁
    destroyEditor() {
      if (this.destroy && this.editor && this.editor.destroy) {
        this.editor.destroy()
        var child = document.getElementById(this.id)
        if (child) { child.parentNode.removeChild(child) }
      }
      if (this.observer && this.observer.disconnect) {
        this.observer.disconnect()
      }
    }
  }
}
</script>
