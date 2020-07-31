<template>
  <div class="module">
    <div class="title">
      <span>{{titleName}}</span>
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
  .title {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    padding-left: 5px;
    box-sizing: border-box;
    span {
      display: inline-block;
      border-left: 5px solid #fa5555;
      padding-left: 10px;
      font-size: 13px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
    }
  }
}
</style>