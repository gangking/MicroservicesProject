<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="slcfId" label="单行业务事务编码" width="140">
      </el-table-column>
      <el-table-column prop="describe" label="单行业务事务描述">
      </el-table-column>
      <el-table-column prop="isProcess" label="是否显示处理进度" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.showHandle" active-value="Y" inactive-value="N" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isFormStatus" label="是否显示表单状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.showStatus" active-value="Y" inactive-value="N" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isUpload" label="是否强制上传附件" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.forceUpload" active-value="Y" inactive-value="N" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isRelationUpForm" label="是否关联前置单据" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.relateBills" active-value="Y" inactive-value="N" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tabelData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange',val)
    }
  }
};
</script>

<style lang="scss" scoped>
.tablelist {
  height: calc(100% - 45px);
  box-sizing: border-box;
  // overflow: auto;
  // background: yellow;
}
</style>