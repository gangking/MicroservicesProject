<template>
  <div class="btnbox">
    <el-button v-for="(item,index) in btnList" :key="index" type="primary" @click="clickType(item)">{{item.label}}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    btnList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      list: [
        {
          label: '新增',
          func: ''
        },
        {
          label: '导入',
          func: ''
        },
        {
          label: '导出',
          func: ''
        },
        {
          label: '批量删除',
          func: ''
        },
        {
          label: '批量冻结',
          func: ''
        }
      ]
    };
  },
  methods: {
    clickType(info) {
      this.$emit('clickType', info);
    }
  }
};
</script>

<style lang="scss" scoped>
.btnbox {
  height: 50px;
  line-height: 49px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  /deep/ .el-button {
    padding: 5px 10px;
  }
}
</style>