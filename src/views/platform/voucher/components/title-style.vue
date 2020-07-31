<template>
  <div class="module">
    <div class="moduletitle">
      <span>{{titleName}}</span>
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'title-style',
  props: {
    titleName: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.module {
  .moduletitle {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    padding-left: 5px;
    box-sizing: border-box;
    span {
      display: inline-block;
      border-left: 5px solid #fa5555;
      padding-left: 10px;
      font-size: 14px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
    }
    > i {
      float: right;
      margin-right: 10px;
      margin-top: 5px;
    }
    /deep/ .el-button {
      font-size: 12px;
      padding: 5px;
      position: relative;
      top: 3px;
    }
  }
}
</style>