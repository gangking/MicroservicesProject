<template>
  <div class="bg">
    <div class="header">
      <div class="tip">选择模版类型:</div>
      <el-radio-group v-model="radio" size="small" @change="selectRadio">
        <el-radio label="A" border>1已预付未拿发票报账的业务</el-radio>
        <el-radio label="B" border>2已提供发票报账并挂账但尚未付款</el-radio>
        <el-radio label="C" border>3合同-已提供发票报账并挂账但尚未付款</el-radio>
        <el-radio label="D" border>4在建工程已进行预转固但尚未提供发票报账</el-radio>
        <el-radio label="E" border>5有效期中的合同</el-radio>
      </el-radio-group>
    </div>
    <div class="btn">
      <div class="tip">附件上传和模版下载:</div>
      <el-button type="primary" @click="templateDown">模版下载</el-button>
      <!-- <el-button type="success" @click="excelUp">导入数据</el-button> -->
      <el-upload
        class="upload-file"
        drag
        action
        :http-request="uploadFile"
        :beforeUpload="beforeAvatarUpload"
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传XLS或XLSX文件</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import {
  uploadContract,
  exportContract
} from "@/api/platform/period_import/index";
import { FINANCE_URL, BASE_URL } from "@/api/baseUrl";
import request from "@/utils/request";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";

export default {
  props: {},
  data() {
    return {
      radio: "A"
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    selectRadio(value) {
      console.log(value);
    },
    getFileName(name) {
      let objMatch = {
        A: "已预付未拿发票报账的业务",
        B: "已提供发票报账并挂账但尚未付款",
        C: "合同-已提供发票报账并挂账但尚未付款",
        D: "在建工程已进行预转固但尚未提供发票报账",
        E: "有效期中的合同"
      };
      return objMatch[name];
    },
    templateDown() {
      exportContract(this.radio)
        .then(response => {
          console.log(response);
          if (response) {
            let fileName = this.getFileName(this.radio);
            ActionUtils.exportFile(
              response.data,
              //fecha.formatDate("yyyyMMddHHmmss") + ".xls"
              fileName + ".xls"
            );
          }
        })
        .catch(req => {
          console.log("下载失败");
        });
    },
    uploadFile(param) {
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("file", fileObject);
      let url =
        BASE_URL +
        FINANCE_URL +
        "/TboCmmdHeadService/uploadContract" +
        this.radio;
      return request({
        url: url,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(response => {
          if (response.message == "excel数据保存成功！") {
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(message => {
          this.$message.error("上传失败，请联系管理员");
        });
    },
    //上传类型判断
    beforeAvatarUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 2MB!",
          type: "warning"
        });
      }
      return extension || (extension2 && isLt2M);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.bg {
  padding: 10px;
  background: #fff;
  height: 100%;
  .header {
  }
  /deep/ .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0px;
    margin-bottom: 8px;
  }
  .tip {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
  }
}
</style>
