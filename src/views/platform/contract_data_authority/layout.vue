<template>
  <div class="mainLayout">
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