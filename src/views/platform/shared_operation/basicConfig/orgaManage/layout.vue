<template>
  <div class="sharedOperation">
    <div class="titleBox">
      <div class="mianbao">
        <el-breadcrumb>
          <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!-- 基础设置 -->
    <div class="content">
      <Layout>
        <contentLayout slot="content"/>
      </Layout>
    </div>
  </div>
</template>

<script>
import Layout from '../components/layout.vue';
import contentLayout from './index';
export default {
  components: {
    Layout,
    contentLayout,
  },
  data() {
    return {
      treeData: [], // 组织树数据
      breadcrumb: [' 共享运营平台', '组织管理'],
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
  .content {
      height: calc(100% - 50px);
  }
}
</style>