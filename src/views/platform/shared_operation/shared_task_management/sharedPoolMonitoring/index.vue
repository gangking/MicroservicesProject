<template>
  <div class="sharedOperation">
    <div class="titleBox">
      <div class="mianbao">
        <el-breadcrumb>
          <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="tabList">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="未派列表" name="undeliveredList"></el-tab-pane>
        <el-tab-pane label="未派超时列表" name="timeoutList"></el-tab-pane>
        <el-tab-pane label="已派超时列表" name="dispatchedTimeoutList"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 未派列表 -->
    <Layout v-if="activeName == 'undeliveredList'">
      <undeliveredList :isUpdate="isUpdate" slot="content" />
    </Layout>

    <!-- 未派超时列表 -->
    <Layout v-else-if="activeName == 'timeoutList'">
      <timeoutList :isUpdate="isUpdate" slot="content" />
    </Layout>

    <!-- 已派超时列表 -->
    <Layout v-else-if="activeName == 'dispatchedTimeoutList'">
      <dispatchedTimeoutList :isUpdate="isUpdate" slot="content" />
    </Layout>
  </div>
</template>

<script>
import Layout from './layout.vue';
import undeliveredList from './undeliveredList';
import timeoutList from './timeoutList';
import dispatchedTimeoutList from './dispatchedTimeoutList';
export default {
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  components: {
    Layout,
    undeliveredList,
    timeoutList,
    dispatchedTimeoutList
  },
  data() {
    return {
      breadcrumb: [' 共享运营平台', '共享池监控', '未派列表'],
      activeName: 'undeliveredList',
      isUpdate: false
    };
  },
  created() {},
  mounted() {
    this.ibpsPayable.$on("exit-multi-form", this.onEvenReload);
  },
  destroyed() {
    this.ibpsPayable.$off("exit-multi-form", this.onEvenReload);
  },
  methods: {
    onEvenReload(type){
      // console.log('触发未派列表更新',type);
      this.isUpdate = this.isUpdate?false:true;
    },
    handleClick(tab, event) {
      console.log('切换', tab, event);
      switch (tab.name) {
        case 'undeliveredList':
          this.breadcrumb = [' 共享运营平台', '共享池监控', '未派列表'];
          break;
        case 'timeoutList':
          this.breadcrumb = [' 共享运营平台', '共享池监控', '未派超时列表'];
          break;
        case 'dispatchedTimeoutList':
          this.breadcrumb = [' 共享运营平台', '共享池监控', '已派超时列表'];
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sharedOperation {
  width: 100%;
  height: 100%;
  .tabList {
    height: 40px;
    background: white;
    overflow: hidden;
    border-top: 1px solid #ccc;
    box-sizing: border-box;
    /deep/ .el-tabs {
      margin-bottom: 10px;
      .el-tabs__nav-wrap {
        &::after {
          background-color: rgba(0, 0, 0, 0);
        }
      }
      .el-tabs__item {
        padding: 0 20px;
      }
      .el-tabs__active-bar {
        padding: 0 10px;
        left: -10px;
      }
    }
  }
  .titleBox {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: white;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;
    .mianbao {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      text-align: left;
      line-height: 56px;
      padding: 0 10px;
      box-sizing: border-box;
      /deep/ .el-breadcrumb {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>