<template>
  <div class="btnbox">
    <span v-for="(item,index) in btnList" :key="index">
      <el-button v-if="item.func !='isduty'" type="primary" @click="btnClick(item)" if>{{item.label}}</el-button>
      <el-switch @change="isDuty" v-else style="display: block" v-model="item.value" :active-text="item.value==1?'在岗':'离岗'" inactive-text="" :active-value="1" :inactive-value="0">
      </el-switch>
    </span>

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
  methods: {
    btnClick(info) {
      if (info.label == '关闭' || info.label == '返回') {
        this.$emit('closeBox');
      } else {
        this.$emit('btnClick', info.label);
      }
    },
    isDuty(val) {
      this.$emit('isDuty',val)
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
  > span {
    margin: 0 5px;
    &:first-child {
      margin-left: 0;
    }
  }
  /deep/ .el-button {
    padding: 5px 10px;
  }
  /deep/ .el-switch {
    display: inline-block!important;
  }
}
</style>