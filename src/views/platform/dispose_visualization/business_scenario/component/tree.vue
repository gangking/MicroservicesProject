<template>
  <div class="treeBox">
    <div class="btn">
      <el-button type="primary" size="mini" icon="el-icon-refresh-right" @click="onload">刷新</el-button>
    </div>
    <div class="content">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'ibps/frontVisualizations'
);
export default {
  inject: ['kDispose'],
  props: {
    openDetail: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    openDetail: {
      handler(val) {
        this.onload();
      },
      immediate: true
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  created() {
    // this.data = require('./tree2.json').list;
    // this.data = require('./tree3.json').data;
    this.onload();
  },
  methods: {
    ...mapActions(['businessQueryTree']),
    onload() {
      console.log('查询业务场景配置树', this.kDispose.sceneId);
      this.businessQueryTree({
        bsKey: this.kDispose.sceneId
      }).then(res => {
        console.log('业务场景配置树', res);
        this.data = res;
        this.setTree(this.data, []);
        console.log('业务场景配置树加面包屑', this.data);
      });
    },
    // 遍历树形数据生成面包屑信息
    setTree(list, crumbs) {
      list.forEach(item => {
        var a = JSON.parse(JSON.stringify(item));
        delete a.children;
        var b = JSON.parse(JSON.stringify(crumbs));
        b.push(a);
        // console.log('上一层', crumbs, '这一层', a);
        item['crumbs'] = b;

        for (var key in item) {
          if (key == 'children') {
            // 判断是否还有下级
            if (item['children'] && item['children'].length > 0) {
              this.setTree(item['children'], item.crumbs);
            }
          }
        }
      });
    },
    // 点击节点
    handleNodeClick(data, Node, component) {
      console.log('点击详情左侧树', data, Node, component);
      this.$emit('activePage', data);
    }
  }
};
</script>

<style lang="scss" scoped>
.treeBox {
  width: 100%;
  height: calc(100% - 40px);
  //   background: yellow;
  .btn {
    height: 40px;
    border-bottom: 1px solid #ccc;
    padding: 0 10px;
    box-sizing: border-box;
    line-height: 40px;
  }
  .content {
    height: calc(100% - 40px);
    /deep/ .el-tree {
      .el-tree-node:focus > .el-tree-node__content {
        background-color: #409eff;
        color: white;
        .expanded {
          color: white;
        }
      }
    }
  }
}
</style>