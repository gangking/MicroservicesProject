<template>
  <div class="titleBox">
    <span></span>
    <div class="text">
      {{titleVal}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleVal: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.titleBox {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  position: relative;
  span {
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -9px;
    width: 5px;
    height: 18px;
    background: red;
  }
  .text {
    display: inline-block;
    margin-left: 15px;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>