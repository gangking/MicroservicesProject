<template>
  <div>
    <el-dialog
      title="应用选择"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeDialog"
      center
    >
      <div>
        <menu-tree ref="menuSelect"></menu-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MenuTree from "./components/menu-tree";
export default {
  name: "fssc-menu-select",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  mounted() {},
  methods: {
    /* 确定 */
    handleConfirm() {
      this.diologEmit();
      let selctData = this.$refs.menuSelect.getCheckedNodes();
      this.$emit("selctData", selctData);
    },
    /* 取消 */
    handleCancel() {
      this.diologEmit();
    },
    closeDialog() {
      this.diologEmit();
    },
    /* 关闭dialog */
    diologEmit() {
      this.$emit("close", false);
    }
  },
  components: {
    MenuTree
  }
};
</script>

<style scoped lang="scss">
</style>
