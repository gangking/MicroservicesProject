<template>
  <div class="treeBBox">
    <p class="title">会计凭证</p>
    <ul class="treeMenu">
      <my-tree v-for="(item,index) in list" :key="index" :nodes="item" @getclickchildren="clickchildren">
      </my-tree>
    </ul>
  </div>
</template>

<script>
import myTree from './my-tree';
import previewApi from '@/api/platform/voucher/preview.js';
export default {
  name: 'treeMenu',
  components: {
    myTree
  },
  props: {
    treeList: {
      type: Array,
      default: []
    }
  },
  data: () => {
    return {};
  },
  computed: {
    list() {
      var arr = this.treeList;
      // console.log('树形数据', arr);
      if (arr.length >= 1) {
        this.$emit('clickchildren', arr[0]);
      }
      return arr;
    }
  },
  methods: {
    clickchildren(info) {
      // console.log('获取树形点击节点值2', info);
      this.$emit('clickchildren', info);
    }
  }
};
</script>

<style lang="scss" scoped>
.treeBBox {
  padding-top: 10px;
  height: calc(100% - 45px);
  box-sizing: border-box;
  overflow: auto;
  .title {
    margin-left: 8px;
    text-align: left;
    margin-top: 0;
  }
  .treeMenu {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    left: 25px;
    top: -2px;
    width: 70%;
    > li {
      margin-left: -10px;
      margin: 10px 0;
      text-align: left;
      &:first-child {
        /deep/ .line2 {
          display: block;
          top: -12px;
          height: calc(100% + 24px);
        }
      }
      &:last-child {
        /deep/ .line {
          display: none;
        }
        /deep/ .line2one {
          display: none;
        }
      }
    }
  }
}
</style>
