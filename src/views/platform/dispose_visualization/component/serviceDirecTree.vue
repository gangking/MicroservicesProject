<template>
  <el-tree ref="selectTree" :data="treeData" v-bind="treeOptions" :default-expand-all="expandFlag" @node-click="handleNodeClick">
    <span slot-scope="scope" class="ibps-custom-tree-node">
      <span>{{ scope.node.label }}</span>
    </span>
  </el-tree>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    treeOptions: {
      type: Object,
      default: () => {
        return {};
      }
    },
    expandFlag: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$emit('handleNodeClick', data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>