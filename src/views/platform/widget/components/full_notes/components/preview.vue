<template>
  <el-dialog ref="dialog" title="全屏" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" :fullscreen="fullscreen" class="desktop-preview-dialog" @close="closeDialog" @open="loadComponent" append-to-body>
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
    </div>-->
    <!-- <div>7897979</div> -->
    <div class="note-alias">
      <component :is="compon" />
    </div>
  </el-dialog>
</template>
<script>
import { dynamicImport } from '@/utils/dynamic-import';
export default {
  props: {
    alias: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      fullscreen: false,
      init: false,
      compon: ''
    };
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  methods: {
    // isScreen(refs) {
    //   this.$nextTick(() => {
    //     if (this.screen) {
    //       refs["dialog"].$el.childNodes[0].childNodes[1].style.height =
    //         100 + "%";
    //     }
    //   });
    // },
    closeDialog() {
      this.$emit('update:visible', false);
    },
    btnClose() {
      this.$emit('update:visible', false);
    },
    loadComponent() {
      this.compon = dynamicImport(`@/views/platform/widget/components/${this.alias}`);
      setTimeout(() => {
        document.querySelector('.note-alias .fullscreen').style.display = 'none';
      }, 100);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  width: 100% !important;
  margin: 0 auto !important;
  height: 100% !important;
  padding: 0 !important;
}
/deep/ .el-dialog__body {
  height: calc(100vh - 10px) !important;
  .note-alias {
    height: 100%;
  }
  .el-card__body {
    height: 100%;
  }
}

/deep/ ul,
li {
  list-style: none;
}
</style>

