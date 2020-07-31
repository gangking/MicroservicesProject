<template>
  <div class="config-box">
    <div class="title">
      <span>业务对象</span>
    </div>
    <div class="config-tree" >
      <el-tree
      
        :data.sync="boTreeData"
        :props="{
                  children: 'children',
                  label: 'name'
               }"
        default-expand-all
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
  </div>
</template>

<script>
import TreeUtils from "@/utils/tree";
import { buildTree } from "@/api/platform/form/formDef";
export default {
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      boData: [],
      boTreeData: [] //对象树结构
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    treeData: {
      handler(val, oldVal) {
        this.boTreeData = TreeUtils.transformToArrayFormat(val, {
          idKey: "id",
          pIdKey: "parentId"
        });
      },
      immediate: true
    }
  },
  methods: {
    handleNodeClick(row) {
      console.log('点击的节点',row)
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.config-box {
  overflow: hidden;
  height: 100%;
  border: 1px solid #ccc;
  .title {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    padding-left: 5px;
    box-sizing: border-box;
    span {
      display: inline-block;
      border-left: 5px solid #fa5555;
      padding-left: 10px;
      font-size: 13px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
    }
  }
  .config-tree {
    height: calc(100vh - 40px);
    overflow: auto;
  }
}
</style>
