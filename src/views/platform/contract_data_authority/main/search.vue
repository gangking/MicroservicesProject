<template>
  <div class="searchbox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="合同归档编号">
        <el-input v-model="formInline.contractFilingNo" placeholder="合同归档编号"></el-input>
      </el-form-item>
      <el-form-item label="合同名称">
        <el-input v-model="formInline.contractName" placeholder="合同名称"></el-input>
      </el-form-item>
      <el-form-item label="客商编码">
        <el-input v-model="formInline.supplierCode" placeholder="客商编码"></el-input>
      </el-form-item>
      <el-form-item label="客商名称">
        <el-input v-model="formInline.supplierName" placeholder="客商名称"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        contractFilingNo: '',
        contractName: '',
        supplierCode: '',
        supplierName: ''
      }
    };
  },
  created() {
  },
  methods: {
    onSubmit() {
      console.log('submit!');
      this.$emit('searchForm', this.formInline);
    },
  }
};
</script>

<style lang="scss" scoped>
.searchbox {
  width: 100%;
  // height: 125px;
  background: white;
  border-bottom: 1px solid #ccc;
  padding-top: 8px;
  box-sizing: border-box;
  /deep/ .el-form {
    height: 100%;
    line-height: 10px;
    box-sizing: border-box;
    position: relative;
    // padding-bottom: 30px;
    .el-form-item {
      margin-bottom: 10px;
      margin-right: 0px;

      .bsaList {
        .newSelect {
          width: 200px;
          height: 32px;
          overflow: auto;
          border: 1px dashed #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .el-input__suffix {
          display: none;
        }
      }
      &:last-child {
        // position: absolute;
        // right: 15px;
        // bottom: -5px;
        // padding-left: 10px;
      }
    }
    .el-form-item__label {
      width: 110px;
      overflow: hidden;
      text-align: center;
      text-align: right;
    }
    .el-form-item__content {
      display: inline-block;
      line-height: 10px;
      .el-date-editor {
        width: 200px;
      }
      .el-input {
        width: 200px;
      }
      .el-select {
        width: 200px;
      }
    }
  }
}
</style>