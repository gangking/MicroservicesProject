<template>
  <div class="ibps-container-full">
    <div v-if="$slots.header" ref="header" :class="{
        'ibps-container-full__header_background_color':headerBackgroundColor
      }" class="ibps-container-full__header">
      <slot name="header" />
    </div>
    <div ref="body" class="ibps-container-full__body">
      <slot />
    </div>
    <div v-if="$slots.footer" ref="footer" :class="{
        'ibps-container-full__footer_background_color':footerBackgroundColor
      }" class="ibps-container-full__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import scroll from './mixins/normal';
export default {
  name: 'ibps-container-full',
  mixins: [scroll],
  mounted() {
    // 增加滚动事件监听
    this.addScrollListener();
  },
  beforeDestroy() {
    // 移除滚动事件监听
    this.removeScrollListener();
  }
};
</script>

<style lang="scss" scoped>
.ibps-container-full {
  height: 100%;
  .ibps-container-full__body {
    height: 100%;
  }
}
</style>
