<template>
  <div class="fullscreenClass" style="height: 100%;">
    <i id="toggleBtn" :class="screenBtnClass" @click="toggle" />
    <div class="fullscreenContenT">

      <slot name="stabcontent"></slot>

    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull';
import util from '@/utils/util';
// const smallScreenClass = 'icon-suoxiaotuichuquanpingshouhui'
const smallScreenClass = 'icon-quanping';
export default {
  name: 'fullscreen-content',
  data() {
    return {
      screenBtnClass: smallScreenClass,
      parentNode: null,
      zIndex: 0,
      fullscreen: false
    };
  },
  inject: ['outerSkin'],
  mounted() {
    this.parentNode = this.$el.parentNode;
    this.zIndex = this.$el.style.zIndex;
  },
  methods: {
    toggle() {
      this.fullscreen = !this.fullscreen;
      console.log('this.$el', this.outerSkin.$el);
      // this.$emit('handleClose', false) //关闭头部
      if (this.fullscreen) {
        this.setScreenElement();
        screenfull.request();
      } else {
        this.exitFullScreen();
        screenfull.exit();
      }
      this.screenBtnClass = this.fullscreen
        ? 'icon-suoxiaotuichuquanpingshouhui'
        : smallScreenClass;
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

<style lang="scss" >
// /deep/ main .tabboxs .tabbox{
//     height: calc(87vh - 79px) ;
// }
.fullscreenClass {
  position: relative;
  right: -1px;
  height: 100%;
  box-sizing: border-box;
  background: white !important;
  z-index: 99999 !important;
  #toggleBtn {
    // position: absolute;
    // right: 10px;
    // top: 5px;
    cursor: pointer;
    // font-size: 16px;
    // z-index: 1000;
    display: block;
    text-align: right;
    padding: 10px;
  }
  .fullscreenContenT {
    display: flex;
    flex-direction: column;
    height: 100%;
    // overflow: auto;
    header {
        // flex: 0.1;
      //   border-bottom: 2px solid #e4e4e4;
      // background: red;
    }
    main {
        // height: 100%;
      //  flex: 1;
      // overflow-y: auto;
      // background: yellow;
    }
    footer {
        // flex: 0.1;
      // background: rgb(71, 71, 71);
    }

    // .tabboxs .footer .sany-message{
    //     height: 79px;
    // }
  }
}
</style>

