<template>
  <el-card>
    <div class="redblock"></div>
    <div class="redblock_title">
      <h3 id="noticetitle">报销指南</h3>
      <a href="#" @click="logvisible ">
        <img class="bigger" src="@/assets/images/desktop/amplification.png" />
      </a>
    </div>
    <div class="block">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="address" label="文档名称">
          <template slot-scope="scope">
            <a :href="scope.row.url">{{ scope.row.filename}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="编写人"></el-table-column>
        <el-table-column prop="date" label="更新时间"></el-table-column>
      </el-table>
    </div>
    <bigger
      :msg="tableData"
      :visible="dialogTableVisible"
      :dialogVisible="dialogTableVisible"
      @handleClose="handleClose"
    ></bigger>
  </el-card>
</template>

<script>
import bigger from "./dialog.vue";
export default {
  data() {
    return {
      dialogTableVisible: false,
      tableData: [
        {
          date: "2019-05-02",
          name: "财务共享中心",
          filename: "共享运营平台操作手册",
          url: "http://www.baidu.com"
        },
        {
          date: "2019-05-04",
          name: "财务共享中心",
          filename: "住房福利政策",
          url: "http://www.baidu.com"
        },
        {
          date: "2019-05-01",
          name: "财务共享中心",
          filename: "财务共享中心员工注意事项",
          url: "http://www.baidu.com"
        },
        {
          date: "2019-05-03",
          name: "财务共享中心",
          filename: "出差申请及报销",
          url: "http://www.baidu.com"
        },
        {
          date: "2019-05-03",
          name: "财务共享中心",
          filename: "共享运营平台操作手册",
          url: "http://www.baidu.com"
        },
        {
          date: "2019-05-03",
          name: "财务共享中心",
          filename: "共享运营平台操作手册",
          url: "http://www.baidu.com"
        },
        {
          date: "2019-05-03",
          name: "财务共享中心",
          filename: "共享运营平台操作手册",
          url: "http://www.baidu.com"
        },
        {
          date: "2019-05-03",
          name: "财务共享中心",
          filename: "共享运营平台操作手册",
          url: "http://www.baidu.com"
        }
      ]
    };
  },
  methods: {
    logvisible() {
      this.dialogTableVisible = true;
    },
    handleClose() {
      this.dialogTableVisible = false;
    }
  },
  components: {
    bigger
  }
};
</script>

<style lang="scss" scoped>
.redblock {
  display: inline-block;
  position: absolute;
  left: 0;
  width: 5px;
  height: 17px;
  background-color: #e61a23;
}
.redblock_title {
  position: relative;
  top: -4px;
  left: -20px;
  margin-bottom: 17px;
  > a {
    position: absolute;
    top: 4px;
    right: -20px;
    display: inline-block;
    width: 15px;
    height: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
#noticetitle {
  width: 200px;
  height: 25px;
  margin-top: 2px !important;
  margin-left: 20px !important;
  font-size: 18px;
  font-family: PingFang SC;
  margin-bottom: 12px;
}
.block {
  height: 215px;
  overflow: hidden;
  /deep/ .el-table .el-table__header {
    tr {
      height: 51px !important;
    }
    th {
      background-color: transparent !important;
      font-size: 14px;
      padding: 8px 0 !important;
    }
  }
  .cell {
    white-space: nowrap !important;
    text-overflow: ellipsis;
    overflow: hidden;
    a {
      text-decoration: none !important;
      color: #606266 !important;
    }
  }
}
</style>