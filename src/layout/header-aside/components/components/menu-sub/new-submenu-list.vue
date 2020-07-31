<template>
  <div>
    <el-menu v-if="hasTitle" @select="onMenuSelect" class="el-menu-vertical-demo" :collapse="isCollapse">
      <template v-for="(item,index) of list">
        <el-submenu popper-class="top-one-level" v-if="checkChild(item)" :key="index" :index="item.path || uniqueId">
          <template slot="title">
            <i :class="'icon-'+item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <div>
            <el-menu-item-group class="el-menu-item-title-border-line">
              <template slot="title">
                <!--   <i :class="'icon-'+item.icon"></i> -->
                <span>{{item.title}}</span>
              </template>
              <new-submenu-list :hasTitle="false" :key="index" :list="item.children"></new-submenu-list>
            </el-menu-item-group>
          </div>
        </el-submenu>
        <el-menu-item style="height: 50px;
    line-height: 50px;text-align: center;" v-else :key="index" :index="item.type==='header'?item.id:(item.path || uniqueId)">
          <template slot="title">
            <div>
              {{item.title}}
            </div>
          </template>
          <span>{{item.title}}</span>
          <i :class="'icon-' +item.icon" style="margin-left: -6px;width: 20px;font-size: 22px;"></i>
        </el-menu-item>
      </template>
    </el-menu>
    <template v-else v-for="(item,index) of list">
      <el-submenu v-if="checkChild(item)" :key="index" :index="item.path || uniqueId">
        <template slot="title">
          <i :class="'icon-'+item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <new-submenu-list :hasTitle="false" :key="index" :list="item.children"></new-submenu-list>
      </el-submenu>
      <el-menu-item v-else :key="index" :index="item.type==='header'?item.id:(item.path || uniqueId)">

        <i :class="'icon-'+item.icon"></i>
        <span>{{item.title}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { uniqueId } from 'lodash';
export default {
  name: 'new-submenu-list',
  components: {},
  props: {
    list: [Array, Object],
    hasTitle: {
      type: Boolean,
      default: false
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    checkChild(val) {
      return val.children && val.children.length > 0;
    },
    checkTitle(t, item) {
      return;
    },
    onMenuSelect(index, indexPath, item) {
      this.$emit('select', index, indexPath, item);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss">
.top-one-level {
  margin-top: 9px;
}
</style>
