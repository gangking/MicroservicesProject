<template>
  <el-table
   :data="tableData"
   style="width: 100%"
   :default-sort="{prop: 'date', order: 'descending'}"
  >
    <el-table-column prop="number" label="单据编号" sortable ></el-table-column>
    <el-table-column prop="name" label="单据名称" ></el-table-column>
    <el-table-column prop="money" label="金额" ></el-table-column>
    <el-table-column prop="person" label="提单人" ></el-table-column>
    <el-table-column prop="date" label="提单日期" ></el-table-column>
    <el-table-column prop="status" label="到达日期" ></el-table-column>
  </el-table>
  
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          number: "23471025",
          date: "2016-05-12",
          money: "313.00",
          person: "AAA",
          name: "2号车间XXX用...",
          status: "2016-05-13"
        },
        {
          number: "22071147",
          date: "2016-05-04",
          money: "433.00",
          person: "BBB",
          name: "1号车间XXX用...",
          status: "2016-05-05"
        },
        {
          number: "29771025",
          date: "2016-05-01",
          money: "512.00",
          person: "CCC",
          name: "3号车间XXX用...",
          status: "2016-05-02"
        },
        {
          number: "38611390",
          date: "2016-05-03",
          money: "698.00",
          person: "DDD",
          name: "4号车间XXX用...",
          status: "2016-05-04"
        }
      ]
    };
  },
  methods: {
    formatter(row, column) {
      return row.address;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .cell{
  font-size: 14px;
}

/deep/ .is-leaf{
  background: #fff!important;
}
.el-table /deep/ .cell {
  white-space: nowrap !important;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>