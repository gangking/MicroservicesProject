<template>
  <div class="info">
    <el-dialog
      :visible.sync="dialogVisible"
      title="添加配置文件"
      width="50%"
      style="height: 420px;"
      append-to-body
      top="63px"
      :modal="true"
      :show-close="false"
      @open="getSelectData"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="业务场景:">
          <el-select
            v-model="form.bsCode"
            filterable
            placeholder="请选择"
            @change="getSelectVal"
            clearable
          >
            <el-option
              v-for="(item,index) in select"
              :key="index"
              :label="item.bsCode"
              :value="item.bsCode"
            ></el-option>
          </el-select>
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
        </el-form-item> -->
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
      form: {
        id: "",
        bsCode: "",
        bsDescribe: "",
        configCode: "",
        configDescribe: "",
        bsKey: "",
        status: "1",
        // bsiCode: "",
        // bsiDescribe: ""
      },
      select: "",
      monselect: []
    };
  },
  props: {
    msg: String,
    dialogVisible: Boolean,
    tableInfo: {
      type: Array,
      default: () => {
        return [];
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
      // if ((this.form.bsiCode != "") & (this.form.configCode != "")) {
        return request({
          baseURL: BASE_GATEWAY_API,
          url: "/bsConfigFile/save",
          method: "post",
          data: this.form
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
          this.$emit("getAllData");
          this.$emit("handleClose", false);
        });
      // } else {
      //   this.$message.error('请填写完整');
      //   return false;
      // }
    },

    getSelectVal(val) {
      this.form.bsDescribe = "";
      // this.form.bsiCode = "";
      // this.form.bsiDescribe = "";
      let selVal = [];
      this.select.forEach(i => {
        if (i.bsCode == val) {
          selVal = i;
          this.form.bsDescribe = selVal.bsDescribe;
          this.form.bsKey = selVal.id;
        }
      });
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/bsBsi/query?bsKey=" + this.form.bsKey,
        method: "get"
      }).then(response => {
        this.monselect = response.data;
      });
    },
    getMonSelectVal(val) {
      let selVal = [];
      this.monselect.forEach(i => {
        if (i.bsiCode == val) {
          selVal = i;
          this.form.bsiDescribe = selVal.bsiDesc;
        }
      });
    },
    getSelectData() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/bsBasic/queryAll",
        method: "get"
      }).then(response => {
        this.select = response.data;
      });
    }
  },
  created() {
    // this.getData()
  },
  mounted() {},
  components: {}
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