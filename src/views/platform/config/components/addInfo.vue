<template>
  <div class="info">
    <el-dialog
      :visible.sync="dialogVisible"
      title="添加配置文件"
      width="50%"
      style="height: 600px;"
      append-to-body
      top="63px"
      :modal="true"
      :show-close="false"
      @open="getSelectData"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="流程按钮配置文件ID:">
          <el-input v-model="form.profCode"></el-input>
        </el-form-item>
        <el-form-item label="配置文件描述:">
          <el-input v-model="form.profDesc"></el-input>
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
        profCode: "",
        profDesc: "",
        status: true
      },
      select: ""
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
      // console.log("form", this.form);
      // this.tableInfo.forEach(item=>{
      //   if(this.form.profCode==item.profCode){
      //     this.$message.warning('流程按钮配置文件ID重复')
      //     return false
      //   }
      // })
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/lcandy/save",
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
        if(response.message!="success"){
          this.$message.error(response.message)
          return false
        }
        this.$message({
          message: '保存成功 !',
          type: "success"
        });
        console.log("response", response);
        this.$emit("getAllData");
        this.$emit("handleClose", false);
        
      });
    },

    getSelectVal(val) {
      let selVal = [];
      this.select.forEach(i => {
        if (i.bsCode == val) {
          selVal = i;

          this.form.bsDescribe = selVal.bsDescribe;
          this.form.bsKey = selVal.id;
        }
      });
    },
    getSelectData() {
      // return request({
      //   baseURL: BASE_GATEWAY_API,
      //   url: "/bsBasic/queryAll",
      //   method: "get"
      // }).then(response => {
      //   this.select = response.data;
      //   console.log("selectData", this.select);
      // });
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