<template>
  <div>
    <el-menu class="el-menu-vertical-demo" background-color="#2b2b2b" text-color="#fff" active-text-color="#ffd04b" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :unique-opened="true" @select="handleMenuSelect" :collapse-transition="true" v-if="!childerenFlag">
      <template v-for="(item,index) of list">
        <el-submenu :index="item.path || uniqueId" v-if="item.children" :key="index">
          <template slot="title">
            <i :class="'icon-'+item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item-group>
            <template slot="title">
              <i :class="'icon-'+item.icon"></i>
              <span>{{item.title}}</span>
            </template>

            <template class="ziji">
              <menu-list :list="item.children" :childerenFlag="true">
              </menu-list>
            </template>
            <!--递归调用-->
          </el-menu-item-group>
        </el-submenu>

        <el-menu-item :index="item.type==='header'?item.id:(item.path || uniqueId)" v-else :key="index" :type="item.type">
          <div>

            <i :class="'icon-'+item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </div>
        </el-menu-item>

      </template>
    </el-menu>
    <template v-else v-for="(item,index) of list">
      <el-submenu :index="item.path || uniqueId" v-if="item.children" :key="index">
        <template slot="title">
          <i :class="'icon-'+item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <template class="ziji">
          <menu-list :list="item.children" :childerenFlag="true">
          </menu-list>
        </template>
        <!--递归调用-->
      </el-submenu>
      <el-menu-item :index="item.type==='header'?item.id:(item.path || uniqueId)" v-else :key="index" :type="item.type">
        <div>

          <i :class="'icon-'+item.icon"></i>
          <span slot="title">{{item.title}}</span>
        </div>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
import { uniqueId } from 'lodash';
import menuMixin from '@/layout/header-aside/components/mixin/menu.js';
import { mapState } from 'vuex';
export default {
  name: 'MenuList',
  props: {
    list: Array,
    isCollapse: {
      type: Boolean,
      default: false
    },
    childerenFlag: Boolean
  },
  computed: {
    ...mapState('ibps/menu', ['aside', 'allSide', 'asideCollapse'])
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
  watch: {
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
  methods: {
    mouseEnter() {
      console.log('mouse-enter-child');
    },
    mouseleave() {
      console.log('mouse-leave-child');
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" scoped>
.ziji {
  padding-left: 10px;
}
.gekai {
  display: inline-block;
  margin-left: 10px;
  background: red;
}
/deep/ .collapse-transition {
  -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
  transition: 0s height, 0s padding-top, 0s padding-bottom;
}

/deep/ .horizontal-collapse-transition {
  -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
  transition: 0s width, 0s padding-left, 0s padding-right;
}

/deep/ .horizontal-collapse-transition .el-submenu__title .el-submenu__icon-arrow {
  -webkit-transition: 0s;
  transition: 0s;
  opacity: 0;
}
</style>