<template>
  <fssc-header-icon :badge-hidden="true" :icon="'icon-'+system.logo">
    <el-menu slot="content" class="header-menu" background-color="#303133" text-color="#fff" active-text-color="#ffd04b" :collapse="false" @select="handleCommand">
      <el-menu-item v-for="(item,index) in sublist" :key="index" :index="index+''">
        <i :class="'icon-'+item.logo"></i>
        <span slot="title" :style="{color:item.id===system.id ? '#ffd04b' :'#fff'}">{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </fssc-header-icon>
  <!--  <el-tooltip effect="dark" placement="bottom">
    <div slot="content">
     

      
    </div>
    <el-button class="btn-text can-hover icontop1  icontop" type="text">
      <i :class="'icon-'+system.logo" />
    </el-button>
  </el-tooltip> -->

</template>

<script>
import FsscHeaderIcon from '../header-menu-icon';
export default {
  components: {
    FsscHeaderIcon
  },
  props: {
    sublist: {
      type: Array,
      default() {
        return [];
      }
    },
    system: Object
  },
  data() {
    return {};
  },
  watch: {
    system: {
      handler(val) {
        console.log('sfjfsfsystem', val, this.sublist);
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    handleCommand(c) {
      let item = this.sublist[c];
      if (item.id != this.system.id) {
        this.$emit('system-hander', this.sublist[c]);
      }
      //console.log('line--1111', );
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.header-menu {
  border: 0px !important;
  .el-menu-item {
    font-size: 12px !important;
    padding-left: 0px 10px !important;
    height: 30px !important;
    line-height: 30px !important;
    .el-submenu__title {
      height: 30px !important;
      line-height: 30px !important;
    }
  }
}
.icontop {
  position: relative;

  font-size: 16px;
}
.icontop1 {
  width: 46px;
  height: 46px;
}
</style>