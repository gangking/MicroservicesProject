<template>
  <div class="ibps-layout-header-aside-menu-side">
    <!-- <el-menu ref="menu" :collapse="asideCollapse" :unique-opened="true" :default-active="active" @select="handleMenuSelect">
      <template v-for="(menu, menuIndex) in allSide">
        <ibps-layout-header-aside-menu-sub :key="menuIndex" :menu="menu" />
      </template>
    </el-menu>
 -->

    <!--  <menuList :list="allSide" :is-collapse="isCollapse" :childerenFlag="false"></menuList> -->
    <new-submenu-list :list="allSide" @select="handleMenuSelect" :is-collapse="isCollapse" :hasTitle="true"></new-submenu-list>

    <div v-if="allSide.length === 0 && !asideCollapse" class="ibps-layout-header-aside-menu-empty" flex="dir:top main:center cross:center">
      <ibps-icon name="inbox" />
      <span>没有侧栏菜单</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import menuMixin from '../mixin/menu';
import { elMenuItem, elSubmenu } from '../libs/util.menu';
import BScroll from 'better-scroll';
import IbpsLayoutMainMenuItem from '../components/menu-item/index.vue';
import IbpsLayoutMainMenuSub from '../components/menu-sub/index.vue';
import menuList from '../components/menu-sub/menu-list.vue';
import newSubmenuList from '../components/menu-sub/new-submenu-list.vue';
import { uniqueId } from 'lodash';
export default {
  name: 'ibps-layout-header-aside-menu-side',
  components: {
    'ibps-layout-header-aside-menu-item': IbpsLayoutMainMenuItem,
    'ibps-layout-header-aside-menu-sub': IbpsLayoutMainMenuSub,
    menuList,
    newSubmenuList
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: true
    }
  },
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
  mixins: [menuMixin],
  data() {
    return {
      active: '',
      asideHeight: 300,
      BS: null
    };
  },

  computed: {
    ...mapState('ibps/menu', ['aside', 'allSide', 'asideCollapse'])
  },
  watch: {
    allSide: {
      handler(n) {
        console.log('导航栏数据', n);
      },
      immediate: true
    },
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse(val) {
      this.scrollDestroy();
      setTimeout(() => {
        this.scrollInit();
      }, 500);
    },
    // 监听路由 控制侧边栏激活状态
    '$route.matched': {
      handler(val) {
        this.active = val[val.length - 1].path;
        this.$nextTick(() => {
          if (this.allSide.length > 0 && this.$refs.menu) {
            this.$refs.menu.activeIndex = this.active;
          }
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.scrollInit();
  },
  beforeDestroy() {
    this.scrollDestroy();
  },
  methods: {
    scrollInit() {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      });
    },
    scrollDestroy() {
      try {
        this.BS.destroy();
      } catch (e) {
        delete this.BS;
        this.BS = null;
      }
    }
  }
  /*   render(createElement) {
    return createElement('div', { attrs: { class: 'ibps-layout-header-aside-menu-side' } }, [
      createElement(
        'el-menu',
        {
          props: {
            collapse: this.asideCollapse,
            uniqueOpened: true,
            defaultActive: this.active
          },
          ref: 'menu',
          on: { select: this.handleMenuSelect }
        },
        this.aside.map(menu =>
          (menu.children === undefined ? elMenuItem : elSubmenu).call(this, createElement, menu)
        )
      ),
      ...(this.aside.length === 0 && !this.asideCollapse
        ? [
            createElement(
              'div',
              {
                attrs: {
                  class: 'ibps-layout-header-aside-menu-empty',
                  flex: 'dir:top main:center cross:center'
                }
              },
              [
                createElement('ibps-icon', { props: { name: 'inbox' } }),
                createElement('span', {}, this.$t('layout.header-aside.menu-side.empty'))
              ]
            )
          ]
        : [])
    ]);
  } */
};
</script>

<style scoped>
.ibps-layout-header-aside-menu-side >>> .collapse-transition {
  -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
  transition: 0s height, 0s padding-top, 0s padding-bottom;
}

.ibps-layout-header-aside-menu-side >>> .horizontal-collapse-transition {
  -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
  transition: 0s width, 0s padding-left, 0s padding-right;
}

.ibps-layout-header-aside-menu-side
  >>> .horizontal-collapse-transition
  .el-submenu__title
  .el-submenu__icon-arrow {
  -webkit-transition: 0s;
  transition: 0s;
  opacity: 0;
}
</style>
