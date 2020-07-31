<template>
  <div class="layout">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 450px;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
  }
  .center {
    flex: 1;
  }

  .right {
    width: 400px;
    border-left: 1px solid #ccc;
    box-sizing: border-box;
  }
}
</style>