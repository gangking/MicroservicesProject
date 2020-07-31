<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="选择默认显示页面"
    width="50%"
    style="height: 600px;"
    append-to-body
    top="63px"
    :modal="true"
    :show-close="false"
  >
    <div class="info">
      <div class="title">请选单据状态:</div>
      <el-select v-model="value" filterable placeholder="请选择">
        <el-option
          v-for="item in this.inpdef"
          :key="item.value"
          :label="item.bizName"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="foot">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="handleClose">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { SYSTEM_URL } from "@/api/baseUrl";
import { BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  data() {
    return {
      msg1: this.msg,
      dialogFormVisible: false,
      value: "",
      upData: {},
      selName: ""
    };
  },
  methods: {
    closeDialog() {
      this.$emit("handleClose", false);
    },
    handleClose() {
      this.$emit("handleClose", false);
    },
    save() {
      this.inpdef.forEach(item => {
        item.by2 = false;
        if (item.id == this.value) {
          item.by2 = true;
          this.selName = item.bizName;
        }
      });

      this.upData.firstList = this.treeIn;
      this.upData.secList = this.inpdef;

      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/permissionConfig/batchUpdate",
        method: "post",
        data: this.upData
      }).then(response => {
        if (response.state != 200) {
          this.$message({
            message: "保存失败 !",
            type: "warning"
          });
          return false;
        }
        this.$message({
          message: "保存成功 !",
          type: "success"
        });
        this.$emit("handleClose", false, this.selName);
      });
    }
  },
  props: {
    msg: String,
    dialogVisible: Boolean,
    inpdef: {
      type: Array,
      default: () => {
        return [];
      }
    },
    treeIn: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  height: 90% !important;
}

/deep/ .vue-cropper {
  width: 400px !important;
  height: 300px !important;
}
.info {
  position: relative;
  .title {
    margin-bottom: 10px;
    margin-left: 130px;
  }
  .el-select{
    width: 400px;
    margin-left: 130px;
  }
}
.foot {
  margin-top: 20px;
  padding: 0 240px;
  .el-button {
    margin: 0 15px;
  }
}
</style>