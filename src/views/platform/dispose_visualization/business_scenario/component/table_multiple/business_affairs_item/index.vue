<template>
  <!-- 多行业务事务 -->
  <div class="box">
    <leftColumn v-if="showPageFlag == 0" />
    <businessType v-else />
  </div>
</template>

<script>
import tabBox from '../../tab_box';
import businessType from './businessType';
import leftColumn from './leftColumn';
export default {
  props: {
    showPageFlag: {
      type: Number,
      default: 0
    }
  },
  components: {
    tabBox,
    businessType,
    leftColumn
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>