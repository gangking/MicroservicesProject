<template>
  <div class="btnlist">
    <el-button @click="btnClick(item)"  :type="item.type" size="mini" v-for="(item,index) in tableBtnList" :key="index" :icon="item.incon">{{item.label}}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    tableBtnList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods:{
    btnClick(info) {
      this.$emit('btnClick',info)
    }
  }
};
</script>

<style lang="scss" scoped>
.btnlist {
  height: 45px;
  //   padding-top: 5px;
  line-height: 45px;
  // border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  //   background: red;
  text-align: right;
}
</style>