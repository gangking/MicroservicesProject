<template>
  <!-- <div class="logo-group-icon waves-effect waves-block"> -->
  <div>
    <div class="newicon">
      <!--  svg 方式 -->
      <div v-if="system.logoType ==='svg'" class="logo-group-icon">
        <ibps-icon-svg :size="logoSize" :name="system.logo||'logo'" :title="system.name" />
        <div v-if="!asideCollapse" class="logo-title ibps-ellipsis" style="width:1.4rem;">>{{ system.name }}</div>
        <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
      </div>
      <!--  icon 方式  -->
      <div v-else class="logo-group-icon waves-effect waves-block">
        &nbsp;&nbsp;&nbsp;&nbsp;
        <ibpsIconNew :name="system.logo||'logo'" :info="subsystemList[0]" :size="logoSize" :title="system.name" />
        <div v-if="!asideCollapse" class="logo-title ibps-ellipsis" style="width:140px;">{{ system.name }}</div>
        <!-- <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" /> -->
      </div>
      <!-- 图片方式
           <img v-if="asideCollapse" :src="logoIconOnly">
      <img v-else :src="logoIconAll">-->
      <!-- <transition name="fade-slide">
      <img v-if="asideCollapse" class="logo-normal " :src="logoNormal"
      />
      <img v-else class="logo-single " :src="logoSingle" />
      </transition>-->

      <!-- 新的icon -->

      <!-- <div v-else class="logo-group-icon waves-effect waves-block"> -->
      <!-- 修改去掉logo点击 -->
      <div v-else class="logo-group-icon">
        <!-- 文思logo -->
        <i class="iconfont icon-pactera icontop"></i>  
        <!-- 国网logo -->
        <!-- <i class="iconfont icon-guowang icontop guowang"></i> -->
        <!-- <i class="iconfont icon-sanylogobig icontop"></i> -->

        <!-- <span class="sanytitle">三一重工</span> -->
        <!-- 去掉缩进消失 v-if="!asideCollapse" -->
        <span class="logo-title ibps-ellipsis" style="width:140px; margin-top: -7px;">
          <!-- <p class="sanytitlech">三一集团财务共享服务中心</p> 
          <p class="sanytitleen">SANY GROUP FINANCIAL SHARING SERVICE CENTER</p> -->
          <img v-if="$store.state.ibps.theme.activeName=='light-white'" src="../../../assets/images/header/topWord1.svg" alt="" srcset="">
          <!-- 文思logo -->
          <img v-else src="../../../assets/images/header/topWord1white.svg" alt="" srcset="">
          <!-- 国网logo -->
          <!-- <img v-else src="../../assets/images/header/topWord1white3.svg" alt="" srcset=""> -->
          <!-- <img v-else src="../../../assets/images/header/topWord1white2.svg" alt="" srcset=""> -->
        </span>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapState } from "vuex";
// import logoNormal from '@/assets/images/company/logo-normal.svg'
// import logoSingle from '@/assets/images/company/logo-single.svg'
import { rem } from '@/assets/js/rem.js';
import ibpsIconNew from './ibpsIconNew.vue'
export default {
  components:{
    ibpsIconNew
  },
  props: {
    system: Object,
    asideCollapse: Boolean,
    subsystemList: Array
  },
  data() {
    return {
      // logoNormal:logoNormal,
      // logoSingle:logoSingle
    };
  },
  methods: {
    remmeth() {
      rem();
    }
  },
  computed: {
    // ...mapState("ibps", {
    //   asideCollapse: state => state.menu.asideCollapse
    // }),
    logoSize() {
      return this.asideCollapse ? 20 : 16;
    }
  }
};
</script>
<style lang="scss" scoped>
// @import '~@/assets/images/company/icomoon/style.css';
.logo-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 50px;
}
.logo-toggle .logo-normal {
  width: 44px;
  height: 44px !important;
}
.logo-toggle .logo-single {
  width: 150px;
}
.ibps-layout-header-aside-group .ibps-layout-header-aside-content .ibps-theme-header .logo-group {
  padding: 0rem;
  margin-top: 3px;
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
.newicon {
  position: fixed;
  left: 0;
  top: 0;
  width: 700px;
  // margin-top: 0.05rem;
  height: 47px;
  line-height: 47px;
}
.logo-toggle.waves-effect.waves-block {
  position: relative;
}
</style>
