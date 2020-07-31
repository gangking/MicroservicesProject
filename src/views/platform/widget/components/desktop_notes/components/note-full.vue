<template>
  <div class="note-full" v-if="hidden">
    <div class="note-main">
      
        <!-- <div slot="header" class="clearfix">
          <span>全屏查看</span>
          <button
            type="button"
            style="float: right; padding: 3px 0"
            @click="btnClose"
            aria-label="Close"
            class="el-message-box__headerbtn"
          >
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div> -->
        <div class="note-alias" id="full_note">
          <component :is="compon" />
        </div>
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alias: {
      type: String,
      required: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    hidden: {
      handler(n) {
        if (n) {
        }
      }
      //immediate: true
    }
  },
  components: {},
  data() {
    return {
      compon: ""
    };
  },
  methods: {
    btnClose() {
      this.$emit("update:hidden", false);
    },
    loadComponent() {
      this.compon = () =>
        import("@/views/platform/widget/components/full_notes");
      // setTimeout(() => {
      //   document.querySelector(".note-alias .fullscreen").style.display =
      //     "none";
      // }, 100);
      alert(99);
    }
  },
  mounted() {
    this.loadComponent();
  }
};
</script>

<style scoped lang="scss">
.note-full {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: #fff;
  z-index: 999;
}
.note-main {
  // position: fixed;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // top: 0;
  // background: #fff;
  // z-index: 999;
  .note-alias {
    height: 100%;
  }
  /deep/ .el-tabs--bottom .el-tabs__header.is-bottom {
    margin-top: 0px;
  }
  /deep/ .note-swiper {
    width: 100% !important;
    .swiper-container {
      width: 100% !important;
    }
  }
  // /deep/ .note-swiper
}
</style>
