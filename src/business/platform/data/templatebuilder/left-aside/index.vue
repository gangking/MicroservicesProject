<template>
  <div :style="{ width:`${width}px`,height:`${height}px`}" class="left-aside">
    <el-header :height="'40px'" class="layout-header">
      <div class="layout-header-title">
        数据集
      </div>
    </el-header>
    <el-scrollbar
      :style="{ height:`${height-45}px`}"
      style="width:100%;"
      wrap-class="sidebar-wrapper"
    >
      <el-tree
        :data="datesetTreeData"
        :props="{
          children: 'children',
          label: 'label'
        }"
        default-expand-all
        @node-click="handleClick"
      />
    </el-scrollbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import TreeUtils from '@/utils/tree'

export default {
  data() {
    return {
      width: 220,
      height: 500
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    }),
    datesetTreeData() {
      return TreeUtils.transformToArrayFormat(this.datasets, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.height = window.outerHeight - 80
    })
  },
  methods: {
    handleClick() {

    }
  }
}
</script>

