<template>
  <div class="layout">
    <div class="left">
      <slot name="title"></slot>
      <slot name="tree"></slot>
    </div>
    <div class="right">
      <slot name="tablayout"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: calc(100% - 35px);
  display: flex;
  box-sizing: border-box;
  .left {
    width: 250px;
    height: 100%;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    overflow: auto;
    padding-bottom: 30px;
    box-sizing: border-box;
  }
  .right {
    width: calc(100% - 250px);
    height: 100%;
  }
}
</style>