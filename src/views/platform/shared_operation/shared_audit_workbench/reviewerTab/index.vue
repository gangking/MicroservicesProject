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
        <el-tab-pane label="待调整稽核任务" name="toBeAdjusting"></el-tab-pane>
        <el-tab-pane label="调整中稽核任务" name="adjusting"></el-tab-pane>
      </el-tabs>
    </div>
    <Layout>
      <!-- 待调整稽核任务 -->
      <contentLayout slot="content" v-if="activeName == 'toBeAdjusting'" />
      <!-- 调整中稽核任务 -->
      <adjusting slot="content" v-else />
    </Layout>
    <!-- <Layout>
      <adjusting slot="content" />
    </Layout> -->
  </div>
</template> 

<script>
import Layout from './layout.vue';
import contentLayout from './main';
import adjusting from './main/adjusting.vue';
export default {
  components: {
    Layout,
    contentLayout,
    adjusting
  },
  data() {
    return {
      activeName: 'toBeAdjusting',
      breadcrumb: [' 共享运营平台', '稽核任务調整', '待调整稽核任务']
    };
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      console.log('切换', tab, event);
      this.activeName = tab.name;
      switch (tab.name) {
        case 'toBeAdjusting':
          this.breadcrumb = [' 共享运营平台', '稽核任务調整', '待调整稽核任务'];
          break;
        case 'adjusting':
          this.breadcrumb = [' 共享运营平台', '稽核任务調整', '调整中稽核任务'];
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