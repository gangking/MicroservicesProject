<template>
  <div class="tableBox">
    <!-- <div class="title">
      {{tbaleTitle}}
    </div> -->
    <div class="table">
      <tableBtnList :tableBtnList="tableBtnList" @btnClick="btnClick" />
      <slot name="table"></slot>
    </div>
  </div>
</template>

<script>
import tableBtnList from './table_btn_list';
export default {
  components: {
    tableBtnList
  },
  props: {
    tbaleTitle: {
      type: String,
      default: ''
    },
    tableBtnList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    btnClick(info) {
      this.$emit('btnClick', info);
    }
  }
};
</script>

<style lang="scss" scoped>
.tableBox {
  height: 100%;
  .title {
    height: 30px;
    font-size: 18px;
    font-weight: bold;
    padding: 0 0 5px 10px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .table {
    height: calc(100% - 30px);
    overflow: hidden;
    margin: 0;
  }
}
</style>