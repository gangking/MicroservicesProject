<template>
  <div class="info">
    <el-dialog
      :visible.sync="copydialogTableVisible"
      title="复制配置文件"
      width="50%"
      style="height: 600px;"
      append-to-body
      top="63px"
      :modal="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="业务场景:">
          <el-input v-model="form.bsCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务场景描述:">
          <el-input v-model="form.bsDescribe" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="业务情形:">
          <el-select
            v-model="form.bsiCode"
            filterable
            placeholder="请选择"
            @change="getMonSelectVal"
            clearable
          >
            <el-option
              v-for="(item,index) in monselect"
              :key="index"
              :label="item.bsiCode"
              :value="item.bsiCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务情形描述:">
          <el-input v-model="form.bsiDescribe" disabled></el-input>
        </el-form-item>-->
        <el-form-item label="配置文件ID:">
          <el-input v-model="form.configCode"></el-input>
        </el-form-item>
        <el-form-item label="配置文件描述:">
          <el-input v-model="form.configDescribe"></el-input>
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
  computed: {},
  watch: {},
  data() {
    return {
      name: "",
      msg1: this.msg,
      dialogFormVisible: false,
      form: {},
      select: "",
      monselect: [],
      oldConfigCode: ""
    };
  },
  props: {
    msg: String,
    copydialogTableVisible: Boolean,
    tableInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("handleClose", false);
    },
    handleClose() {
      this.$emit("handleClose", false);
    },
    save() {
      console.log("saveform", this.form);
      console.log("this.oldConfigCode", this.oldConfigCode);
      if (this.form.configCode != "") {
        return request({
          baseURL: BASE_GATEWAY_API,
          url: "/permissionConfig/copyList",
          method: "post",
          data: {
            bsKey: this.form.bsKey,
            oldConfigFileId: this.oldConfigCode,
            configFileId: this.form.configCode
          }
        })
          .then(response => {
            this.saveTree();
          })
          .catch(res => {
            this.$message.error(res);
          });
      } else {
        this.$message.error("请填写完整");
        return false;
      }
    },
    saveTree() {
      return request({
        // baseURL: "http://192.168.30.26:5100/ibps",
        baseURL: BASE_GATEWAY_API,
        url: "/bsConfigFile/save",
        method: "post",
        data: this.form
      }).then(response => {
        if (response.cause != "") {
              this.$message.error(response.cause);
              return false;
            }
            this.$message({
              message: "复制成功 !",
              type: "success"
            });
        console.log("saveStree", this.form);
        this.$emit("getAllData");
        this.$emit("handleClose", false);
      });
    }
  },
  created() {
    // this.getData()
  },
  mounted() {},
  components: {},
  watch: {
    tableInfo: {
      handler: function(val) {
        this.oldConfigCode = val.configCode;
        this.form = val;
        console.log("this.form111", this.form);
        console.log("this.oldConfigCode", this.oldConfigCode);
      },
      immediate: true
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