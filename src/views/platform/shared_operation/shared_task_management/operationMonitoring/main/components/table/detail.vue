<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="detail"
      width="768px"
      :before-close="handleClose"
      style="height: 600px;"
      append-to-body
      top="63px"
    >
      <!-- <button @click="reLoadData()">测试</button> -->
      <compform :params="getParams" />
    </el-dialog>
  </div>
</template>

<script>
import compform from "@/views/platform/dispatch/Invoice/payable/index";
export default {
  components: {
    compform
  },
  props: {
    // avaimg: String,
    dialogVisible: Boolean,
    getParams: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      dialogTableVisible: false
    };
  },
  watch: {
    getParams: {
      handler: function(val, oldVal) {
        console.log("params1", val);
      },
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.$emit("handleClose", false);
    },
    reLoadData() {
      this.$emit("uncomData");
      this.$emit("underData");
      this.$emit("finishData");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
