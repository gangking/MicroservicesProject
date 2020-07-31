<template>
  <div class="sharedOperation">
    <div class="titleBox">
      <div class="mianbao">
        <el-breadcrumb>
          <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!-- 任务分配 -->
    <!-- <Layout v-if="basicSetting == '任务分配'">
      <contentLayout slot="content" :pageType="pageType" @getGroupGoPage="getGroupGoPage" />
    </Layout> -->
    <Layout>
        <taskPrioritySetting slot="content"/>
    </Layout>
  </div>
</template>

<script>
import Layout from '../components/layout.vue';
import taskPrioritySetting from './index.vue';
export default {
  components: {
    Layout,
    taskPrioritySetting
  },
  data() {
    return {
      pageType: 'organization', // 要展示的页面类型 organization，sharedPool，businessGroup
      basicSetting: '主页面', // 组员管理，任务分配，派单策略
      breadcrumb: [' 共享运营平台', '任务优先级设置']
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.sharedOperation {
  width: 100%;
  height: 100%;
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