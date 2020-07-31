<template>
  <el-card style="height: 100%">
    <template slot="header">
      <div class="redblock"></div>
      <p class="header">流程异常监控表</p>
    </template>
    <div class="btn">
      <div class="rightbtn">
        <el-dialog
          placement="left-start"
          :visible.sync="visible"
          class="selectBox"
          :close-on-click-modal="false"
          :show-close="false"
          :modal="false"
          :append-to-body="true"
          width="40%"
          top="15vh"
        >
          <el-form ref="form" :model="selecForm" label-width="100px">
            <el-form-item label="单据号码:">
              <el-input v-model="selecForm.docNumber"></el-input>
            </el-form-item>
            <el-form-item label="公司代码:">
              <el-input v-model="selecForm.bukrs"></el-input>
            </el-form-item>
            <el-form-item label="发起人:">
              <el-input v-model="selecForm.username"></el-input>
            </el-form-item>
            <el-form-item label="报错时间:">
              <el-date-picker
                v-model="selectime"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="pickTime"
                value-format="yyyy-MM-dd"
                class="margin5"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="部门:">
              <el-input v-model="selecForm.orgid"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="confirm">保存</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-button @click="visiblebtn" plain class="elbtn filter">
          <el-badge :is-dot="dot">
            <i class="iconfont icon-uniE0561 iconbtn filbtn" />
          </el-badge>
        </el-button>
        <el-button class="elbtn filter" plain @click="reLoad">
          <i class="iconfont icon-uniE248 iconbtn filbtn" />
        </el-button>
        <el-button class="elbtn filter" plain @click="confirm">
          <i class="iconfont icon-uniE00A1 iconbtn filbtn" />
        </el-button>
      </div>
    </div>
    <div class="msg">
      <el-table
        :data="msglist"
        style="width: 100%"
        height="100%"
        :header-cell-style="{color:'#000'}"
        @selection-change="getRow"
        v-loading="dataloading"
      >
        <el-table-column prop="bsDesc" label="业务场景应用" align="center" width="130"/>
        <el-table-column prop="bsiDesc" label="业务情形" align="center" width="90"/>
        <el-table-column prop="docNumber" label="单据编号" align="center" width="160"/>
        <el-table-column prop="docDescription" label="单据描述" align="center" width="160"/>
        <el-table-column prop="bukrs" label="公司代码" align="center" width="70"/>
        <el-table-column prop="orgid" label="部门ID" align="center" width="90"/>
        <el-table-column prop="username" label="发起人" align="center" width="70"/>
        <el-table-column prop="nodeId" label="当前节点" align="center" width="130"/>
        <el-table-column prop="createBy" label="节点处理人" align="center" width="80"/>
        <!-- <el-table-column prop="docStatus" label="单据状态" align="center" /> -->
        <el-table-column prop="createTime" label="报错时间" :formatter="dateFormat" width="85" align="center"/>
        <el-table-column prop="exceptionMessage" label="错误信息" />
      </el-table>
    </div>
    <div class="foot">
      <el-pagination
        :current-page="currentPage"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";

export default {
  data() {
    return {
      input: "",
      totalCount: 0,
      visible: false,
      currentPage: 1,
      multipleSelection: [],
      multipleSelectionIds: [],
      msglist: [],
      loading: false,
      dataloading: false,
      selecForm: {
        docNumber: "",
        bukrs: "",
        username: "",
        startTime: "",
        endTime: "",
        orgid: ""
      },
      select: [],
      selectime: "",
      dot: false
    };
  },
  methods: {
    // 加载数据
    loadData() {
      this.dataloading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/proc/exception/log/query",
        method: "post",
        data: {
          parameters: [
            {
              key: "Q^DOC_NUMBER^S",
              value: this.selecForm.docNumber
            },
            {
              key: "Q^BUKRS^SL",
              value: this.selecForm.bukrs
            },
            {
              key: "Q^USERNAME^SL",
              value: this.selecForm.username
            },
            {
              key: "Q^CREATE_TIME_^DL",
              value: this.selecForm.startTime
            },
            {
              key: "Q^CREATE_TIME_^DG",
              value: this.selecForm.endTime
            },
            {
              key: "Q^ORGID^SL",
              value: this.selecForm.orgid
            }
          ],
          requestPage: {
            pageNo: this.currentPage,
            limit: 20,
            totalCount: null
          },
          sorts: []
        }
      })
        .then(res => {
          console.log("resssssss", res);
          this.totalCount = res.data.pageResult.totalCount;
          this.msglist = res.data.dataResult;
          this.dataloading = false;
        })
        .catch(res => {
          this.dataloading = false;
        });
    },
    // 删除
    handleRemove() {
      this.$message({
        message: "删除成功",
        type: "success"
      });
    },
    getRow(val) {
      let ids = [];
      this.multipleSelection = val;
      val.forEach(i => {
        ids.push(i.id);
      });
      this.multipleSelectionIds = ids.toString();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentpage = val;
      this.loadData();
    },
    // 时间过滤器
    dateFormat: function(row, column) {
      var t = new Date(row.createTime);
      var year = t.getFullYear(),
        month = t.getMonth() + 1,
        day = t.getDate(),
        hour = t.getHours(),
        min = t.getMinutes(),
        sec = t.getSeconds();
      var newTime =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day) +
        " " +
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (min < 10 ? "0" + min : min) +
        ":" +
        (sec < 10 ? "0" + sec : sec);
      return newTime;
    },
    visiblebtn() {
      this.visible = true;
    },
    confirm() {
      let selForm = Object.values(this.selecForm);
      selForm.forEach(i => {
        if (i != "") {
          this.dot = true;
        }
      });
      this.currentpage = 1;
      this.loadData();
      this.visible = false;
    },
    cancel() {
      this.visible = false;
    },
    reLoad() {
      this.dot = false;
      Object.keys(this.selecForm).forEach(key => (this.selecForm[key] = ""));
      this.selectime = "";
      this.currentpage = 1;
      this.loadData();
    },
    pickTime(val) {
      this.selecForm.startTime = val ? val[0] : "";
      this.selecForm.endTime = val ? val[1] : "";
    }
  },
  created() {
    this.loadData();
    // console.log(this.listData);
  },
  watch: {
    // msglist: {
    //   handler: function(val, oldVal) {
    //     this.msglist = val;
    //     console.log("watch", val);
    //   },
    //   immediate: true,
    //   deep: true
    // }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  /deep/ .el-card__header {
    padding: 8px 20px;
  }
  /deep/ .el-card__body {
    height: 90%;
    padding-top: 0px;
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
.btn {
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
    right: 72px;
    top: 3px;
    height: 40px;
    .selectBox {
      position: absolute;
      right: 0;
      top: 0;
    }

    .filter {
      position: relative;
      border: none !important;
      font-size: 17px;
      padding: 3px !important;
      margin-right: 5px !important;
      width: 25px;
      height: 25px;
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
  height: 90%;
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
    // /deep/ .doclink {
    //   color: #419efb;
    //   cursor: pointer;
    // }
  }
}
.foot {
  width: 560px;
  margin: 13px auto;
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