<template>
  <el-tree class="el-voucher-wrapper" :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
    <template v-slot:default='slotProps'>
      <span>
        <span class="el-tree-node__label">{{ slotProps.data.name }}</span>
        <span v-if="!slotProps.data.nodes">
          <el-tooltip popper-class="tooltips" v-if="slotProps.data.postMessage" :content="slotProps.data.postMessage" placement="right">
            <span>
              <i :class="slotProps.data.className" :style="{'background':slotProps.data.color}"></i>
            </span>
          </el-tooltip>
          <span v-else>
            <i :class="slotProps.data.className" :style="{'background':slotProps.data.color}"></i>
          </span>
        </span>
      </span>
    </template>
  </el-tree>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'nodes',
        label: 'name'
      }
    };
  },
  watch: {},
  computed: {
    treeData() {
      let list = this.checkTreeData(this.data);
      //最终处理的tree
      console.log('最终处理的tree', list);
      return list ? list : [];
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    checkTreeData(treeList) {
      if (treeList && treeList.length > 0) {
        const _tmpTreeList = treeList.map(it => {
          let item = { ...it };
          const { postStatus = null, simStatus = null, nodes = [] } = item;
          let style1 = this.setStyle(postStatus);
          item.color = style1.color;
          item.className = style1.className;
          let style2 = this.setStyle(simStatus);
          item.color2 = style2.color;
          item.className2 = style2.className;
          item.nodes = this.checkTreeData(nodes);
          return item;
        });
        return _tmpTreeList;
      }
      return false;
    },
    // 设置节点图标及颜色
    // 设置节点图标及颜色
    setStyle(status) {
      var style = {};
      switch (status) {
        case '00':
          // 未模拟
          style.color = '#ccc';
          style.className = 'uniE252';
          break;
        case '01':
          // 模拟报错
          style.color = '#E78C07';
          style.className = 'uniE1AE';
          break;
        case '02':
          // 模拟成功
          style.color = '#2B7D2B';
          style.className = 'uniE1AB';
          break;
        case '04':
          // 已冲销
          style.color = '#BB0000';
          style.className = 'uniE1AC';
          break;
        case '10':
          // 未生成
          style.color = '#ccc;';
          style.className = 'uniE252';
          break;
        case '11':
          // 生成报错
          style.color = '#E78C07';
          style.className = 'uniE1AE';
          break;
        case '12':
          // 生成成功
          style.color = '#2B7D2B';
          style.className = 'uniE1AB';
          break;
        case '14':
          // 已冲销
          style.color = '#BB0000';
          style.className = 'uniE1AC';
          break;
      }
      return style;
    }
  }
};
</script>
<style lang="scss" >
.el-voucher-wrapper {
  .el-tooltip__popper.is-dark.tooltips {
    background: #f56c6c;
    .popper__arrow::after {
      border-right-color: #f56c6c;
    }
    .popper__arrow {
      border-right-color: #f56c6c;
    }
  }
}
</style>