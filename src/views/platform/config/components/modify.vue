<template>
  <div class="info">
    <el-dialog
      :visible.sync="modDialog"
      title="修改配置文件"
      width="50%"
      style="height: 600px;"
      append-to-body
      top="63px"
      :modal="true"
      :show-close="false"
    >
      <el-form ref="form" :model="modifyform" label-width="150px">
        <el-form-item label="流程按钮配置文件ID:">
          <el-input v-model="modifyform.profCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="配置文件描述:">
          <el-input v-model="modifyform.profDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import { SYSTEM_URL } from "@/api/baseUrl";
import { BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  data() {
    return {
      name: "",
      msg1: this.msg,
      modifyDialog: false,
      modifyform: {
        id: "",
        profCode: "",
        profDesc: "",
        status: true
      },
      select: "",
      selectInfo: []
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
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/lcandy/save",
        method: "post",
        data: this.modifyform
      }).then(response => {
        if (response.cause != "") {
          this.$message({
            message: response.cause,
            type: "warning"
          });
          return false;
        }
        this.$message({
          message: "保存成功 !",
          type: "success"
        });
        console.log("response", response);
        this.$emit("getAllData");
        this.$emit("handleClose", false);
      });
    },

    // getSelectVal(val) {
    //   let selVal = [];
    //   this.select.forEach(i => {
    //     if (i.bsCode == val) {
    //       selVal = i;
    //       console.log("selVal", selVal);
    //       this.form.bsDescribe = selVal.bsDescribe;
    //       this.form.bsKey = selVal.id;
    //     }
    //   });
    // },
    getSelectInfo() {
      let pro = this.selectInfo[0] ? this.selectInfo[0].profCode : "";
      this.$set(this.modifyform, "profCode", pro);
      let desc = this.selectInfo[0] ? this.selectInfo[0].profDesc : "";
      this.$set(this.modifyform, "profDesc", desc);

      this.modifyform.id = this.selectInfo[0] ? this.selectInfo[0].id : "";
      this.modifyform.status=true
    }
  },
  created() {
    // this.getData()
  },
  mounted() {},
  components: {},
  props: {
    msg: String,
    modDialog: Boolean,
    tableInfo: {
      type: Array,
      default: () => {
        return [];
      }
    },
    selInfo: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    selInfo: {
      handler: function(val) {
        this.selectInfo = val;
        this.getSelectInfo();
      },
      immediate: true,
      deep:true
    },
    modifyform: {
      handler: function(val) {
        console.log("watchmodifyform", this.modifyform);
      },
      immediate: true,
      deep: true
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
</style>