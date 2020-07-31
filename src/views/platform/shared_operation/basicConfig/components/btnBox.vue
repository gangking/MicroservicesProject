<template>
  <div class="box">
    <div class="btnbox">
      <h4>财务共享中心</h4>
      <el-button v-if="btnType!='Automatic'" size="small" type="primary" plain @click="btnClickType('Automatic')">自动规则</el-button>
      <el-button v-else-if="btnType=='Automatic'" size="small" type="primary" @click="btnClickType('Automatic')">自动规则</el-button>
      <br />
      <el-button v-if="btnType!='Manual'" size="small" type="primary" plain @click="btnClickType('Manual')">手动规则</el-button>
      <el-button v-else-if="btnType=='Manual'" size="small" type="primary" @click="btnClickType('Manual')">手动规则</el-button>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    titleVal: {
      type: String,
      default: '业务组管理'
    },
    treeData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      btnType:"Automatic"
    };
  },
  methods: {
    btnClickType(type) {
      // console.log('基础设置选中树节点',data);
      this.$emit('btnClickType', type);
      this.btnType = type;
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 180px;
  padding: 10px;
  box-sizing: border-box;
  line-height: 50px;
  .btnbox {
    width: 95px;
    margin: 0 auto;
    text-align: right;
    h4{
      text-align: left;
    }
  }
}
</style>