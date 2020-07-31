<template>
  <div class="mainLayout">
    <div class="leftTree">
      <slot name="treeBox"></slot>
    </div>
    <div class="rightContair">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    isSwarch:{
      type:Boolean,
      default:true
    }
  }
};
</script>

<style lang="scss" scoped>
.mainLayout {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  .leftTree {
    // width: 250px;
    height: 100%;
    // border: 1px solid #ccc;
    // padding: 31px 0;
    box-sizing: border-box;
    background: white;
  }
  .rightContair {
    flex: 1;
    width: calc(100% - 250px);
    height: 100%;
    background: white;
    padding: 0 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
}
</style>