<template>
  <div class="visuaTree">
    <div class="title">
      服务目录分类：
    </div>
    <div class="treebox">
      <div class="btn">
        <el-button type="primary" size="mini" icon="ibps-icon-refresh" @click="treeRefresh"></el-button>
        <el-button type="primary" size="mini" icon="ibps-icon-expand" @click="unFoldAll"></el-button>
        <el-button type="primary" size="mini" icon="ibps-icon-compress" @click="collapseAll"></el-button>
      </div>
      <div class="tree">
        <serviceDirecTree :treeData="treeData" :treeOptions="treeOptions" :expandFlag="expandFlag" @handleNodeClick="handleNodeClick"/>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'ibps/frontVisualizations'
);
import TreeUtils from '@/utils/tree';
import serviceDirecTree from './serviceDirecTree';
export default {
  components:{
    serviceDirecTree
  },
  data() {
    return {
      sourceData: [],
      expandFlag: false
    };
  },
  created() {
    this.treeRefresh();
  },
  computed: {
    treeData() {
      if (!this.sourceData || this.sourceData.length === 0) return [];
      return TreeUtils.transformToArrayFormat(JSON.parse(JSON.stringify(this.sourceData)), {
        idKey: this.treeOptions['node-key'],
        pIdKey: this.pidKey,
        childrenKey: this.treeOptions['props']['children']
      });
    },
    treeOptions() {
      const defaultOptions = {
        rootPId: null,
        'node-key': 'id',
        'pid-key': 'parentId',
        'default-expand-all': false,
        'expand-on-click-node': false,
        'highlight-current': true,
        props: {
          children: 'children',
          label: 'name'
        }
      };
      return Object.assign(defaultOptions, this.options);
    },
    pidKey() {
      return this.treeOptions['pid-key'];
    }
  },
  methods: {
    ...mapActions(['findTreeDataType']),
    handleNodeClick(data) {
      console.log(data);
      if (data.name == '服务目录') {
        data['id'] = '';
      }
      this.$emit('activeType', data);
    },
    treeRefresh() {
      // 获取服务目录分类
      this.findTreeDataType().then(res => {
        console.log('服务目录分类', res);
        this.sourceData = res;
      });
    },
    // 全部展开
    unFoldAll() {
      this.expandFlag = true;
      this.setChidnodes(this.$refs.selectTree.store.root.childNodes, this.expandFlag);
    },
    // 全部折叠
    collapseAll() {
      this.expandFlag = false;
      this.setChidnodes(this.$refs.selectTree.store.root.childNodes, this.expandFlag);
    },
    setChidnodes(list, flag) {
      for (var i = 0; i < list.length; i++) {
        list[i].expanded = flag;
        if (list[i].childNodes) {
          this.setChidnodes(list[i].childNodes, flag);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.visuaTree {
  height: 100%;
  padding: 10px;
  .title {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
  }
  .treebox {
    height: calc(100% - 50px);
    border: 1px solid #ccc;
    border-bottom: 0;
    padding: 0 5px;
    box-sizing: border-box;
    .btn {
      height: 40px;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;
      line-height: 40px;
    }
    .tree {
      height: calc(100% - 40px);
      //   background: red;
      overflow: auto;
      padding-bottom: 30px;
      box-sizing: border-box;
    }
  }
}
</style>