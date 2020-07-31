<template>
  <div :style="styleLayoutMainGroup" :class="{grayMode: grayActive}" class="ibps-layout-header-aside-group hidden-print">
    <!-- 半透明遮罩 -->
    <div class="ibps-layout-header-aside-mask" />
    <!-- websocket -->
    <!-- <ibps-notify-monitor /> -->
    <!-- 主体内容 -->
    <div class="ibps-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div :style="{
          opacity: searchActive ? 0.5 : 1,
          boxShadow: '0px 5px 5px rgba(0,0,0,.08)',
          position: 'relative',
        }" class="ibps-theme-header" flex-box="0" flex>
        <div :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}" class="logo-group" flex-box="0">
          <!--logo-->
          <!--  <div class="subsystemListBox" v-if="subsystemList && subsystemList.length >1">
            <el-dropdown trigger="click" placement="bottom-start" @command="command => handleSubsystemClick(command)">
              <ibps-logo :system="system" :aside-collapse="asideCollapse" :subsystem-list="subsystemList" />
              <el-dropdown-menu slot="dropdown" style="width:180px;">
                <el-dropdown-item :icon="'icon-'+item.logo" v-for="(item,index) in subsystemList" :key="index" :disabled="item.id===system.id" :command="item">{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div> -->

          <!-- 三一图标 -->
          <!-- <ibps-logo :system="system" :aside-collapse="asideCollapse" :subsystem-list="subsystemList" /> -->
          <div class="logo-group-icon">
            <!-- 文思logo -->
            <i class="iconfont icon-pactera icontop"></i>
            <!-- 国网logo -->
            <!-- <i class="iconfont icon-guowang icontop guowang"></i> -->
            <!-- <i class="iconfont icon-sanylogobig icontop"></i> -->

            <span class="logo-title ibps-ellipsis" style="width:140px; margin-top: -7px;">
              <img v-if="$store.state.ibps.theme.activeName=='light-white'" src="../../assets/images/header/topWord1.svg" alt="" srcset="">
              <!-- 文思logo -->
              <img v-else src="../../assets/images/header/topWord1white.svg" alt="" srcset="">
              <!-- 国网logo -->
              <!-- <img v-else src="../../assets/images/header/topWord1white3.svg" alt="" srcset=""> -->
              <!-- <img v-else src="../../assets/images/header/topWord1white2.svg" alt="" srcset=""> -->
            </span>
          </div>
        </div>
        <!-- 原有的logon右侧的菜单缩放 -->
        <!-- <div class="toggle-aside-btn" flex-box="0" @click="handleToggleAside">
          <ibps-icon :name="asideCollapse ?'indent':'outdent'" />
        </div> -->
        <!-- <ibps-menu-header flex-box="1" /> -->

        <!-- <div class="header-left">
          <img class="company-logo" :src="SanySvg" />

        </div>-->
        <!-- 顶栏右侧 -->
        <div class="ibps-header-right" flex-box="0">
          <fssc-subsystem :sublist="subsystemList" v-if="subsystemList && subsystemList.length >1" :system="system" @system-hander='handleSubsystemClick'></fssc-subsystem>
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->

          <!-- <router-link to="/work" class="work">工作台</router-link> -->
          <!-- <div class="waves-effect waves-block" style="width:50px;height:50px;border:1px solid #999;">点击</div> -->
          <!-- <fssc-header-home /> -->
          <!-- <router-link to="/desktop-notes" class="note">
            <ibps-icon name="feed" size="20"></ibps-icon>
          </router-link>
          <router-link to="/notes" class="note">
            <ibps-icon name="instagram" size="20"></ibps-icon>
          </router-link>-->

          <!-- 搜索按钮 -->

          <ibps-header-search @click="handleSearchClick" />
          <!-- 首页按钮 -->
          <fssc-header-home />
          <!-- 多任务队列 -->
          <fssc-header-tab />
          <!-- 显示隐藏侧边栏按钮 -->
          <fssc-header-aside-toggle ref="fsfsf" class="waves-effect waves-block" />
          <!-- 消息队列 -->
          <!-- <fssc-header-message /> -->
          <!-- 我的发起流程 -->
          <!--  <el-tooltip class="item" effect="dark" content="我的发起流程" placement="bottom">
            <span class="process" @click="processApp">
              <i v-if="$store.state.ibps.theme.activeName=='light-white'" class="iconfont icon-toubu-jiqirenfasong black" />
              <i v-else class="iconfont icon-toubu-jiqirenfasong white" />
              <span class="num">
                <el-badge :value="proAppNum" :max="99" class="item" />
              </span>
            </span>
          </el-tooltip> -->
          <fssc-process-user-send v-if="checkisShowProcess()" @click="processApp" :badgeNumber="proAppNum"></fssc-process-user-send>
          <!-- 我的处理流程 -->
          <!--  <el-tooltip class="item" effect="dark" content="我的处理流程" placement="bottom">
            <span class="process" @click="processMan">
              <i v-if="$store.state.ibps.theme.activeName=='light-white'" class="iconfont icon-chulizhong- black" />
              <i v-else class="iconfont icon-chulizhong- white" />
              <span class="num">
                <el-badge :value="proManNum" :max="99" class="item" />
              </span>
            </span>
          </el-tooltip> -->
          <fssc-process-user-check v-if="checkisShowProcess()" @click="processMan" :badgeNumber="proManNum"></fssc-process-user-check>
          <!-- 报错按钮 -->
          <!-- <ibps-header-error-log class="waves-effect waves-block" v-if="$env === 'development'" /> -->

          <!-- 自定义组件 -->

          <!-- 邮件按钮 -->
          <!-- <ibps-header-message /> -->
          <!-- 设置按钮 -->
          <!-- <ibps-header-setting /> -->
          <!-- 用户按钮 -->
          <ibps-header-user />
          <!-- 全屏按钮 -->
          <ibps-header-fullscreen />
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="ibps-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div id="slideToggle" ref="aside" :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity:searchActive ? 0.5 : 1
          }" flex-box="0" class="ibps-theme-container-aside">
          <ibps-menu-side />

          <!-- 改造按钮到菜单栏的下方 -->
          <!-- 修改 隐藏左下角切换 -->
          <div class="toggle-aside-main">
            <div class="toggle-aside-btn" flex-box="0" @click="handleToggleAside">
              <ibps-icon class="asideIcon waves-block waves-effect" :name="asideCollapse ?'indent':'outdent'" />
              <span v-show="!asideCollapse" class="asdieText">折叠菜单</span>
            </div>
          </div>
        </div>
        <!-- 主体右边 -->
        <div flex-box="1" flex class="boxright">
          <!-- bannner -->
          <!-- <div class="banner">
            <div class="bannercarousel">
              <carousel></carousel>
            </div>
            <div class="bannermycard">
              <mycard></mycard>
            </div>
          </div>-->
          <!-- 主体 -->
          <div class="ibps-theme-container-main" flex-box="1" flex>
            <!-- 搜索 -->
            <transition name="fade-scale">
              <div v-show="searchActive" class="ibps-theme-container-main-layer" flex>
                <ibps-panel-search ref="panelSearch" @close="searchPanelClose" />
              </div>
            </transition>
            <!-- 内容 -->
            <transition name="fade-scale">
              <div v-show="!searchActive" class="ibps-theme-container-main-layer" flex="dir:top">
                <!-- tab -->
                <!-- <div class="ibps-theme-container-main-header" flex-box="0">
                <ibps-tabs />
                </div>-->
                <!-- 页面 -->
                <div class="ibps-theme-container-main-body" flex-box="1">
                  <transition :name="transitionActive ? 'fade-transverse' : ''">
                    <keep-alive :include="keepAlive">
                      <router-view />
                    </keep-alive>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
          <ibps-dialog-payable-form :visible.sync="dialogTableVisible" :get-params="params" />
          <div class="copyright">2019 Pactera Technology International Limited.All rights reserved. Liaoning ICP 060110790. OpenAppSupport@pactera.com 京公网安备11010802016198号</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SanySvg from '@/assets/images/company/sany.svg';

import IbpsLogo from './components/logo';
import IbpsMenuSide from './components/menu-side';
import IbpsMenuHeader from './components/menu-header';
import FsscSubsystem from './components/header-subsystem-list';
import IbpsTabs from './components/tabs';
import IbpsHeaderSearch from './components/header-search';

import IbpsHeaderFullscreen from './components/header-fullscreen';
import IbpsHeaderSetting from './components/header-setting';
import IbpsHeaderMessage from './components/header-message';

import FsscHeaderMessage from './components/header-mess';
import FsscHeaderTab from './components/header-tab';
import FsscHeaderHome from './components/fssc-home';
import FsscProcessUserSend from './components/header-process-user-send';
import FsscProcessUserCheck from './components/header-process-user-check';

import FsscHeaderAsideToggle from './components/header-aside-toggle';
import IbpsHeaderUser from './components/header-user';
import IbpsHeaderErrorLog from './components/header-error-log';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import mixinSearch from './mixins/search';
import mixinLock from './mixins/lock';

import carousel from './components/carousel/index';
import mycard from './components/mycard/index';
import ibpsDialogPayableForm from '@/views/platform/dispatch/Invoice/payable/dialog-payable';
import util from '@/utils/util';
import { BASE_GATEWAY_API } from '@/api/baseUrl';
import request from '@/utils/request';
export default {
  name: 'ibps-layout-header-aside',
  props: {
    addressParam: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    addressParam: {
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          this.setPayableParams(val);
        }
      },
      immediate: true
    }
  },
  components: {
    FsscProcessUserSend,
    FsscProcessUserCheck,
    FsscSubsystem,
    IbpsLogo,
    IbpsMenuSide,
    IbpsMenuHeader,
    IbpsTabs,
    IbpsHeaderSearch,

    IbpsHeaderFullscreen,
    // IbpsHeaderLocking,
    // IbpsHeaderLanguage,
    // IbpsHeaderSize,
    // IbpsHeaderTheme,
    // IbpsHeaderToolbar,
    IbpsHeaderSetting,
    IbpsHeaderMessage,
    IbpsHeaderUser,
    IbpsHeaderErrorLog,

    FsscHeaderMessage,
    FsscHeaderTab,
    FsscHeaderHome,
    FsscHeaderAsideToggle,
    carousel,
    mycard,
    // 注册复合表单
    ibpsDialogPayableForm
  },

  mixins: [mixinSearch, mixinLock],
  provide() {
    return {
      ibpsPayable: this
    };
  },
  data() {
    return {
      // 侧栏宽度正常状态
      asideWidth: '210px',
      // 侧栏宽度折叠状态
      asideWidthCollapse: '65px',
      SanySvg: SanySvg, // svg图标
      dialogTableVisible: false,
      params: {},
      proAppNum: '',
      proManNum: ''
    };
  },
  computed: {
    ...mapState('ibps', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse,
      system: state => state.system.system,
      subsystemList: state => state.system.subsystemList
    }),
    ...mapGetters('ibps', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup() {
      return {
        ...(this.themeActiveSetting.backgroundImage
          ? {
              backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
            }
          : {})
      };
    },
    logoIconAll() {
      return `${this.$baseUrl}static/images/theme/${this.themeActiveSetting.name}/all.png`;
    },
    logoIconOnly() {
      return `${this.$baseUrl}static/images/theme/${this.themeActiveSetting.name}/only.png`;
    }
  },
  methods: {
    onmousemeeter() {},
    onmouseleave() {},
    ...mapActions('ibps/menu', ['asideCollapseToggle']),
    ...mapMutations('ibps/menu', ['asideHandel']),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside() {
      this.asideCollapseToggle();
      this.asideHandel();
    },
    checkisShowProcess() {
      return this.$store.state.ibps.system.system.id == '266946423468851203';
    },
    setPayableParams(val) {
      if (!util.isEmpty(val)) {
        this.dialogTableVisible = true;
        this.params = val;
      }
    },
    handleSubsystemClick(system) {
      const path = this.$route.path;
      this.$store.dispatch('ibps/system/set', system).then(() => {
        if (path != '/home') {
          this.$router.push({ path: '/home' });
        }
        setTimeout(() => {
          location.reload();
        }, 200);
      });
    },
    processApp() {
      const path = this.$route.path;
      //统一内外跳转
      //console.log('/fqlc/MyInitiationProcess', '/fqlc/MyInitiationProcess');
      if (path != '/fqlc/MyInitiationProcess') {
        this.$router.push({ path: '/fqlc/MyInitiationProcess' });
      }
    },
    processMan() {
      const path = this.$route.path;
      //统一内外跳转
      if (path != '/cllc/MyDisposeProcess') {
        this.$router.push({ path: '/cllc/MyDisposeProcess' });
      }
    },
    getPorcessNum() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: 'bpm/v3/bpm/received/query/StatisticsDocument',
        method: 'get'
      })
        .then(res => {
          this.proAppNum = res.data.sponsorCount;
          this.proManNum = res.data.handerCount;
        })
        .catch(res => {
          this.proAppNum = 0;
          this.proManNum = 0;
        });
    }
  },
  mounted() {
    this.getPorcessNum();
    this.$nextTick(() => {
      this.$refs['fsfsf'].slideToggle();
    });
  }
};
</script>

<style lang="scss">
// 注册主题
@import '@/assets/styles/theme/register.scss';
.note {
  margin-right: 7px;
  color: #fff;
}
.ibps-header-right {
  position: absolute;
  right: 0;
  width: 480px;
  margin-left: auto;
}

.logo-group {
  position: relative;
  width: calc(100% - 380px) !important;
  .subsystemListBox {
    position: absolute;
    width: 60px;
    right: 8px;
    top: 4px;
    /deep/ .el-dropdown {
      width: 100%;
      height: calc(100% - 4px);
    }
    /deep/ .newicon {
      position: relative;
      top: 2px;
      .el-icon-arrow-down {
        position: relative;
        top: -3px;
      }
    }
  }

  .icontop {
    display: inline-block;
    position: absolute;
    // top: -0.02rem;
    left: 20px;
    height: 47px;
    line-height: 47px;
    font-size: 24px;
    // margin-right: 0.4rem;
  }

  .guowang {
    font-size: 32px;
  }

  .puhua {
    color: #03a8f3;
  }
}

#slideToggle .ibps-layout-header-aside-menu-side {
  bottom: 50px;
}
#slideToggle .toggle-aside-btn {
  position: absolute;
  z-index: 10;
  left: 0;
  bottom: 0;
  height: 0px;
  width: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  // color: rgb(135, 140, 141);
  // 侧栏图标大小
  .asideIcon {
    font-size: 0.24rem;
  }
  .asdieText {
    cursor: pointer;
    margin-left: 3px;
    font-size: 16px;
    white-space: nowrap;
  }
}

.ibps-layout-header-aside-group .header-left {
  display: flex;
  align-items: center;
  margin-left: 5px;
  .company-logo {
    height: 32px;
    padding-left: 30px;
    border-left: 1px solid #ccc;
  }
}
.boxright {
  flex-direction: column;
  .banner {
    height: 320px;
    .bannercarousel {
      background-color: #ccc;
      height: 320px;
      float: left;
      width: 70%;
    }
    .bannermycard {
      float: left;
      width: 30%;
    }
  }
}
.process {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 46px;
  margin: 0 2px !important;
  padding: 14px 12px;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 17px;
  cursor: pointer;
  i {
    position: absolute;
    top: 17px;
    left: 12px;
  }
  .num {
    position: absolute;
    top: 2px;
    left: 24px;
  }
}
.black {
  color: #4e5367;
}
.white {
  color: #fff;
}
.process:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
