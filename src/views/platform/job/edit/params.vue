<template>
  <div>
    <el-button type="primary" icon="ibps-icon-add" @click="handleAdd">添加参数</el-button>
    <el-table
      :data="tableData"
      empty-text="请添加参数"
      height="160px"
      border
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column
        label="参数名称"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.paramsName" @change="data => scope.row.paramsName = data" />
        </template>
      </el-table-column>
      <el-table-column
        label="参数值"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.paramValue" @change="data => scope.row.params = data" />
        </template>
      </el-table-column>
      <el-table-column label="管理" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="ibps-icon-delete"
            @click="handleDelete(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    handleAdd() {
      const rowParams = {
        paramsName: '',
        paramValue: ''
      }
      this.tableData.push(rowParams)
    },
    getData() {
      return this.tableData
    },
    initData() {
      this.tableData = []
    },
    handleDelete(index, row) {
      row.splice(index, 1)
    }
  }
}
</script>
