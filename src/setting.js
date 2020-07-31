/**
 * 全局默认配置
 * <pre>
 * 作者:daxin ding
 * 邮箱:daxin.ding@pactera.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:深圳文思海辉信息科技有限公司
 * </pre>
 */
import { version } from '../package'

const setting = {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {// 查询快捷键
      open: 'Ctrl+Q',
      close: 'Esc'
    },
    lock: {
      open: 'Ctrl+L'
    }
  },
  // 侧边栏默认折叠状态
  menu: {
    activeHeader: '1',
    asideCollapse: true
  },
  // 修改在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'multi',
        path: '/multi',
        meta: {
          name: 'multi',
          title: '首页',
          requiresAuth: false
        }
      }
    ]
  },
  // 修改默认菜单
  menus: [
    {
      path: '/multi',
      name: '首页',
      alias: '首页',
      icon: 'home'
    }
  ],
  // 版本
  releases: {
    D2AdminVersion: '1.7.1', // 感谢D2 Admin 同步更新下D2版本
    version: version,
    api: ''// 更新版本的api
  },
  // 系统默认值设置
  system: {
    size: 'small',
    language: 'zh-CN'
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      // {
      //   title: '经典',
      //   name: 'ibps',
      //   preview: 'static/images/theme/ibps/preview@2x.png'
      // },
      // {
      //   title: '紫罗兰',
      //   name: 'violet',
      //   preview: 'static/images/theme/violet/preview@2x.png'
      // },
      // {
      //   title: '简约线条',
      //   name: 'line',
      //   backgroundImage: 'static/images/theme/line/bg.jpg',
      //   preview: 'static/images/theme/line/preview@2x.png'
      // },
      // {
      //   title: '流星',
      //   name: 'star',
      //   backgroundImage: 'static/images/theme/star/bg.jpg',
      //   preview: 'static/images/theme/star/preview@2x.png'
      // },
      // {
      //   title: 'Tomorrow Night Blue (vsCode)',
      //   name: 'tomorrow-night-blue',
      //   preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      // }
      {
        title: '深夜蓝',
        name: 'dark-sky',
        color: '#03a8f3',
        leftcolor: '#2d2828'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '明亮白',
        name: 'light-white',
        color: '#FFFFFF',
        leftcolor: '#FFFFFF'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '明亮灰',
        name: 'light-gray',
        color: '#4E5367',
        leftcolor: '#FFFFFF'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '明亮绿',
        name: 'light-green',
        // color: '#06C292',
        color: '#216361',
        leftcolor: '#FFFFFF'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '明亮粉',
        name: 'light-pink',
        color: '#E46A75',
        leftcolor: '#FFFFFF'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '明亮蓝',
        name: 'light-blue',
        color: '#03A9F3',
        leftcolor: '#FFFFFF'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '明亮紫',
        name: 'light-violet',
        color: '#6E42C1',
        leftcolor: '#FFFFFF'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '明亮青',
        name: 'light-cyan',
        color: '#01C0C8',
        leftcolor: '#FFFFFF'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      // 修改 去掉黑色主题
      // {
      //   title: '深夜灰',
      //   name: 'dark-gray',
      //   color:'#2d2828',
      //   leftcolor:'#2d2828'
      //   // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      // },
      {
        title: '深夜绿',
        name: 'dark-green',
        //color: '#06C292',
        color: '#216361',
        leftcolor: '#2d2828'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '深夜粉',
        name: 'dark-pink',
        color: '#E46A75',
        leftcolor: '#2d2828'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },

      {
        title: '深夜紫',
        name: 'dark-violet',
        color: '#6E42C1',
        leftcolor: '#2d2828'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      },
      {
        title: '深夜青',
        name: 'dark-cyan',
        color: '#01C0C8',
        leftcolor: '#2d2828'
        // preview: 'static/images/theme/tomorrow-night-blue/preview@2x.png'
      }
    ],
  },
  color: {
    predefine: [
      '#f5222d',
      '#fa541c',
      '#faad14',
      '#13c2c2',
      '#52c41a',
      '#409EFF',
      '#1890ff',
      '#2f54eb',
      '#722ed1'
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  },
  // 在读取持久化数据失败时默认用户信息
  userInfo: {
    user: {
      name: 'ghost',
      photo: 'static/images/headportrait.png'
    }
  },
  headerBtn: {
    headerMess: false,
    headerTab: false
  }
}

export default setting
