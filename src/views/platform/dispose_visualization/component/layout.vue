<template>
  <div class="box">
    <div class="header">
      <div class="demo-input-suffix">
        <span class="title">业务场景管理：</span>
        <el-input placeholder="请输入场景描述" v-model="sceneDescProps">
          <el-button slot="append" icon="el-icon-search" @click="searchVisuaList"></el-button>
        </el-input>
        <el-button type="primary" size="small" icon="ibps-icon-import">导入</el-button>
        <el-button type="primary" size="small" icon="ibps-icon-export">导出</el-button>
      </div>

    </div>
    <div class="content">
      <div class="list">
        <!-- 业务场景列表 -->
        <visuaList @viewDetails="viewDetails" :sceneDescProps="sceneDescProps" :sceneIdProps="sceneIdProps" :isSearch="isSearch" />
      </div>
      <div class="treebox">
        <!-- 业务场景分类树 -->
        <visuaTree @activeType="activeType"/>
      </div>
    </div>
  </div>
</template>

<script>
import visuaList from './visualist';
import visuaTree from './visuatree';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'ibps/frontVisualizations'
);
export default {
  components: {
    visuaList,
    visuaTree
  },
  data() {
    return {
      sceneDescProps: '',
      sceneIdProps: '',
      isSearch: false
    };
  },
  created() {
    // 获取业务场景
    // this.findTreeDataType().then(res => {
    //   console.log('服务目录分类', res);
    //   this.serviceDirecType = res;
    // });
  },
  methods: {
    ...mapActions(['findTreeDataType']),
    viewDetails(info) {
      this.$emit('viewDetails', info);
    },
    // 获取选中类型
    activeType(info) {
      this.sceneIdProps = info.id;
      this.searchVisuaList();
    },
    // 通过场景编码查询列表
    searchVisuaList() {
      this.isSearch = this.isSearch ? false : true;
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: 100%;
  .header {
    height: 50px;
    padding: 10px;
    border-bottom: 2px solid #ccc;
    box-sizing: border-box;
    .demo-input-suffix {
      .title {
        font-size: 20px;
        font-weight: bold;
      }
      .el-input {
        width: 180px;
      }
    }
  }
  .content {
    height: calc(100% - 45px);
    display: flex;
    .list {
      height: 100%;
      width: calc(100% - 250px);
      padding: 10px;
      padding-right: 50px;
      box-sizing: border-box;
    }
    .treebox {
      width: 250px;
      height: 100%;
      border-left: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
}
</style>