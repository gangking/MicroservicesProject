<template>
  <div class="fyall">
    <div class="title">
      费用
      <a href="#">查看</a>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="date" label="日期" sortable></el-table-column>
      <el-table-column prop="name" label="费用类型"></el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="approvedmonye" label="已审批金额"></el-table-column>
    </el-table>
    <div class="foot">
      <div class="zje">
        <p>总金额</p>
        <div>CNY 3,000.00</div>
      </div>
      <div class="zje">
        <p>审批总额</p>
        <div>CNY 3,000.00</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "差旅费_公交大巴",
          money: "CNY 1,500.00",
          approvedmonye: "CNY 1,500.00"
        },
        {
          date: "2018-05-02",
          name: "住宿费",
          money: "CNY 1,500.00",
          approvedmonye: "CNY 1,500.00"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.fyall {
  width: 100%;
  height: 100%;
  .title {
    margin-bottom: 10px;
    a {
      position: absolute;
      right: 45px;
      color: #409EFF;
      font-size: 12px;
    }
  }
  .foot {
    position: absolute;
    bottom: 15px;
    right: 3px;
    padding-top: 3px;
    border-top: 2px solid #ccc;
    width: 100%;
    .zje {
      float: right;
      width: 30%;
      margin-right: 4%;
      p {
        font-size: 12px;
        text-align: right;
      }
      div {
        font-size: 16px;
        font-weight: 600;
        text-align: right;
      }
    }
  }
}
</style>