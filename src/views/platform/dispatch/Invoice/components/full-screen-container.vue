<template>
  <div class="full-screen-container">
    <!-- <h1>测一测</h1> -->

    <i id="toggleBtn" v-if="!isHiddenFullScreen" class="screent-btn" :class="screenBtnClass" @click="toggle" />

    <div v-if="$slots['screen-header']" class="screen-header">
      <slot name="screen-header" />
    </div>
    <div class="screen-content">
      <slot name="screen-content" />
    </div>
    <div v-if="$slots['screen-footer']" class="screen-footer">
      <slot name="screen-footer" />
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull';
import util from '@/utils/util';
const smallScreenClass = 'icon-suoxiaotuichuquanpingshouhui';
const maxScreenClass = 'icon-quanping';

export default {
  components: {},
  props: {
    isHiddenFullScreen: {
      type: Boolean,
      default: false
    }
  },
  inject: ['outerSkin'],
  data() {
    return {
      parentNode: null,
      zIndex: 0,
      fullscreen: false,
      screenBtnClass: maxScreenClass
    };
  },

  watch: {},
  created() {},
  mounted() {
    this.parentNode = this.$el.parentNode;
    this.zIndex = this.$el.style.zIndex;
  },
  methods: {
    toggle() {
      this.fullscreen = !this.fullscreen;

      if (this.fullscreen) {
        this.setScreenElement();
        screenfull.request();
      } else {
        this.exitFullScreen();
        screenfull.exit();
      }
      this.screenBtnClass = this.fullscreen ? smallScreenClass : maxScreenClass;
    },

    setScreenElement() {
      this.outerSkin.$el.style.display = 'none';
      util.addClass(this.$el, 'el-dialog__wrapper');
      document.body.appendChild(this.$el);
      this.$el.style.zIndex = this.outerSkin.$el.style.zIndex;
    },

    exitFullScreen() {
      this.outerSkin.$el.style.display = '';
      util.removeClass(this.$el, 'el-dialog__wrapper');
      this.parentNode.appendChild(this.$el);
      this.$el.style.zIndex = this.zIndex;
    }
  }
};
</script>
<style lang="scss">
.full-screen-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .screent-btn {
    // position: absolute;
    // right: 5px;
    // top: 5px;
    cursor: pointer;
    text-align: right;
    padding: 5px;
    background: #fff;
    // font-size: 16px;
    // z-index: 100;
  }
  .screen-header {
    flex-basis: 38px;
    line-height: 38px;
    background-color: #fff;
    border-bottom: 2px solid #d4d4de !important;
  }
  .screen-content {
    width: 100%;
    background-color: #fff;

    flex-grow: 1;
    height: 10px;
    overflow: auto;
    // height: calc(100% - 105px);
    .el-table--group::after,
    .el-table::before {
      background-color: #d4d4de;
    }
  }
  .screen-footer {
    flex-basis: 60px;
    // /*  line-height: 59px; */
    // padding: 5px 0;
    // border: 1px solid red;
    background-color: #fff;
    padding-bottom: 10px;
    box-sizing: border-box;
    // border-top: 1px solid #ccc;
  }
}
</style>
