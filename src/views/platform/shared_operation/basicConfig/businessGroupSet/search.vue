<template>
  <div class="searchbox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="业务组编号">
        <el-input v-model="formInline.number" placeholder="业务组编号"></el-input>
      </el-form-item>
      <el-form-item label="业务组名称">
        <el-input v-model="formInline.name" placeholder="业务组名称"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.status" placeholder="状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="停用" value="deleted"></el-option>
          <el-option label="启用" value="actived"></el-option>
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
        number: '',
        name:'',
        status: ''
      }
    };
  },
  methods: {
    onSubmit() {
      // console.log('submit!');
      this.$emit('searchFormFunc',this.formInline)
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