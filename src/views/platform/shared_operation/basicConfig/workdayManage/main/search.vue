<template>
  <div class="searchbox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="编号">
        <el-input v-model="formInline.nameOrCode" placeholder="编号"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.status" placeholder="状态">
          <el-option label="全部" value="all"></el-option>
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
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
        nameOrCode: '',
        status: 'all'
      }
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
};
</script>

<style lang="scss" scoped>
.searchbox {
  width: 100%;
  height: 50px;
  background: white;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  /deep/ .el-form {
    height: 100%;
    line-height: 50px;
    box-sizing: border-box;
    .el-form-item__content {
      display: inline-block;
      line-height: 50px;
    }
  }
}
</style>