<template>
  <div class="dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      style="height: 100%;"
      append-to-body
      top="63px"
      :modal="false"
      width="94%"
    >
      <div class="redblock"></div>
      <div class="redblock_title">
        <h3 id="noticetitle">报销指南</h3>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="address" label="文档名称">
          <template slot-scope="scope">
            <a :href="scope.row.url">{{ scope.row.filename}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="编写人"></el-table-column>
        <el-table-column prop="date" label="更新时间"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.tableData);
  },
  data() {
    return {
      tableData: this.msg,
      dialogTableVisible: false,
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleClose() {
      // console.log("关闭");
      this.$emit("handleClose", false);
    }
  },
  props: {
    msg: Array,
    dialogVisible: Boolean
  }
};
</script>

<style lang="scss" scoped>
.redblock {
  display: inline-block;
  position: absolute;
  left: 0;
  width: 5px;
  height: 17px;
  background-color: #e61a23;
}
.redblock_title {
  position: relative;
  top: -4px;
  left: -20px;
  margin-bottom: 17px;
  > a {
    position: absolute;
    top: 4px;
    right: -20px;
    display: inline-block;
    width: 15px;
    height: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
#noticetitle {
  width: 200px;
  height: 25px;
  margin-top: 2px !important;
  margin-left: 20px !important;
  font-size: 18px;
  font-family: PingFang SC;
  margin-bottom: 12px;
}
/deep/ .el-dialog__header {
  padding: 0 !important;
}
/deep/ .el-dialog {
  height: 91% !important;
  margin-left: 80px;
}
a {
  text-decoration: none !important;
  color: #606266 !important;
}
</style>