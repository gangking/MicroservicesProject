<template>
  <el-card style="height: 100%">
    <template slot="header">
      <div class="redblock"></div>
      <p class="header">流程异常重处理</p>
    </template>
    <div class="btnLiuchengyichang">
      <div class="rightbtn">
        <!-- 刷新列表 -->
        <el-button type="primary" icon="el-icon-star-off" class="elbtn filter" @click="reprocessing">
          异常重处理
        </el-button>
        <el-button type="primary" icon="el-icon-delete" class="elbtn filter" @click="deleteFunc">
          删除
        </el-button>
        <el-button type="primary" icon="icon-uniE00A1" class="elbtn filter" @click="confirm">
          刷新
        </el-button>
      </div>
    </div>
    <div class="msg">
      <el-table border @selection-change="handleSelectionChange" :data="reprocessingList" style="width: 100%" height="100%" :header-cell-style="{color:'#000'}" v-loading="dataloading">
        <el-table-column type="selection" width="45">
        </el-table-column>
        <el-table-column prop="appName" label="业务场景应用名称" align="center" />
        <el-table-column prop="docNumber" label="单据编号" align="center" width="120" />
        <el-table-column prop="bukrs" label="公司代码" align="center" width="80" />
        <el-table-column prop="butxt" label="公司名称" align="center" width="150" />
        <el-table-column prop="orgid" label="部门ID" align="center" width="80" />
        <el-table-column prop="userno" label="发起人" align="center" width="80" />
        <el-table-column prop="bsiDesc" label="业务情形描述" align="center" />
        <el-table-column prop="docDescription" label="单据事由" align="center" />
        <el-table-column prop="cause" label="报错原因">
          <template slot-scope="scope">
            <el-button type="text" @click="msgTxt(scope.row.cause)">报错原因</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" width="85" align="center" />
        <!-- <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="reprocessing(scope.row)" type="text" size="small">
              异常重处理
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div class="foot">
      <el-pagination :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalCount" @current-change="handleCurrentChange" />
    </div>
  </el-card>
</template>

<script>
import request from '@/utils/request';
import { FORM_URL, BASE_GATEWAY_API } from '@/api/baseUrl';
import indexApi from '@/api/exception_reprocessing/index.js';
export default {
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      auditIds: '',
      dataloading: false,
      reprocessingList: [], // 流程数据列表
      multipleSelection: [], // 选中行数组
    };
  },
  created() {
    this.getReprocessingList();
    // console.log(this.listData);
  },
  methods: {
    msgTxt(txt) {
      console.log('报错原因', txt, typeof txt);
      this.$message({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: `<strong><div style="max-height: 400px;overflow: auto;">${
          txt + ''
        }</div></strong>`,
        type: 'error',
      });
    },
    // 删除deleteReprocessing
    deleteFunc() {
      this.auditIdsSet();
      if (!this.auditIds) {
        this.$message.error('请选择要删除的数据.');
      }
      indexApi
        .deleteReprocessing({
          auditIds: this.auditIds,
        })
        .then((res) => {
          console.log('异常重处理删除', res);
          if (res.state == 200) {
            this.$message({
              message: '恭喜您，流程错误删除成功。',
              type: 'success',
            });
          } else {
            this.$message.error('删除失败。');
          }
          // 刷新列表
          this.confirm();
          this.dataloading = false;
        })
        .catch((res) => {
          this.dataloading = false;
        });
    },
    // ----------------
    // 获取流程异常重处理表格数据
    getReprocessingList() {
      // -----------------模拟数据
      // var testList = require('./test.json').data.dataResult;
      // this.reprocessingList = testList;
      // this.totalCount = require('./test.json').data.pageResult.totalCount;
      // ------------------模拟数据
      this.dataloading = true;
      indexApi
        .reprocessingList({
          parameters: [],
          requestPage: {
            pageNo: this.currentpage,
            limit: 10,
            totalCount: null,
          },
          sorts: [],
        })
        .then((res) => {
          console.log('获取流程异常重处理表格数据', res);
          this.reprocessingList = res.data.dataResult;
          this.totalCount = res.data.pageResult.totalCount;
          this.dataloading = false;
        })
        .catch((res) => {
          this.dataloading = false;
        });
    },
    // 异常重处理
    reprocessing() {
      this.auditIdsSet();
      if (!this.auditIds) {
        this.$message.error('请选择要处理的数据.');
      }
      indexApi
        .exceptionReprocessing({
          auditIds: this.auditIds,
        })
        .then((res) => {
          console.log('异常重处理', res);
          if (res.state == 200) {
            this.$message({
              message: '恭喜您，流程错误处理成功。',
              type: 'success',
            });
          } else {
            this.$message.error('您还有流程错误还未处理，请及时处理。');
          }
          // 刷新列表
          this.confirm();
          this.dataloading = false;
        })
        .catch((res) => {
          this.dataloading = false;
        });
      // console.log('异常重处理', arg);
    },
    auditIdsSet() {
      var auditIds = '';
      this.dataloading = true;
      for (var i = 0; i < this.multipleSelection.length; i++) {
        var item = this.multipleSelection[i];
        if (i == this.multipleSelection.length - 1) {
          auditIds += item.id;
        } else {
          auditIds += item.id + ',';
        }
      }
      this.auditIds = auditIds;
    },
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log('选中行', val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentpage = val;
      this.getReprocessingList();
    },
    // 时间过滤器
    dateFormat: function (row, column) {
      var t = new Date(row.createTime);
      var year = t.getFullYear(),
        month = t.getMonth() + 1,
        day = t.getDate(),
        hour = t.getHours(),
        min = t.getMinutes(),
        sec = t.getSeconds();
      var newTime =
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (day < 10 ? '0' + day : day) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (min < 10 ? '0' + min : min) +
        ':' +
        (sec < 10 ? '0' + sec : sec);
      return newTime;
    },
    // 刷新
    confirm() {
      this.currentpage = 1;
      this.getReprocessingList();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  /deep/ .el-card__header {
    padding: 8px 20px;
  }
  /deep/ .el-card__body {
    height: 90%;
    padding-top: 0;
    padding-bottom: 0;
    box-sizing: border-box;
  }
  .header {
    font-weight: 700;
    font-size: 18px;
    margin: 0;
  }
  /deep/ .redblock {
    position: absolute;
    top: 10px;
    left: 1px;
    display: inline-block;
    width: 5px;
    height: 17px;
    background-color: #e61a23;
  }
}
.btnLiuchengyichang {
  position: relative;
  height: 32px;
  width: 100%;
  .inp {
    width: 200px !important;
  }
  .margin5 {
    margin: 0 3px;
  }
  .rightbtn {
    position: absolute;
    // left: 72px;
    top: 3px;
    height: 40px;
    .selectBox {
      position: absolute;
      right: 0;
      top: 0;
    }

    .filter {
      position: relative;
      font-size: 12px;
      padding: 3px !important;
      margin-right: 5px !important;
      /deep/ .is-dot {
        width: 8px !important;
        height: 8px !important;
      }
      .filbtn {
        display: inline-block;
        color: #006397;
      }
    }
  }
}

.msg {
  height: calc(100% - 74px);
  overflow: hidden;
  .sub {
    margin-left: 5px;
  }
  .demo-table-expand {
    font-size: 0;
    background-color: #f5f5f6;
    padding: 15px 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin: 0 0 0 8%;
    width: 40%;
    /deep/ .el-form-item__label {
      margin-right: 20px !important;
      width: 80px;
      padding-right: 0;
      text-align: left;
    }
  }
}
.foot {
  width: 100%;
  height: 42px;
  padding-top: 10px;
  box-sizing: border-box;
  text-align: center;
  /deep/ .el-pagination {
    display: inline-block;
    text-align: center;
  }
}
/deep/ .el-dialog__header {
  padding: 0 !important;
}
/deep/ .el-dialog {
  /deep/ .el-input--small {
    .el-input__inner {
      width: 350px !important;
    }
  }
}
</style>