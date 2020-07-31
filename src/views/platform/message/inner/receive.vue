<template>
  <el-card style="height: 100%">
    <template slot="header">
      <p class="header">已收消息列表</p>
    </template>
    <div class="btn">
      <el-input
        v-model="input"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        class="inp margin5"
        clearable
      ></el-input>
      <el-button type="primary" plain class="margin5" @click="loadData">搜索</el-button>
      <el-button type="danger" plain class="margin5" @click="handleRemove">删除</el-button>
      <el-button type="success" plain class="margin5" @click="handleAlreadyRead">标记为已读</el-button>

      <!-- <el-button type="primary" plain>排序</el-button> -->
      <el-popover placement="top" width="500" v-model="visible">
        <div style="margin: 15px 0 15px 30px;">
          <span class="margin5">消息类型:</span>
          <el-select v-model="msgtype" clearable placeholder="请选择" class="margin5">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div style="margin: 0px 0 15px 30px;">
          <span class="margin5">发送时间:</span>
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
        </div>
        <div style="text-align: center;margin-bottom: 15px">
          <el-button type="success" size="mini" plain @click="confirm">确定</el-button>
          <el-button size="mini" type="danger" plain @click="cancel">取消</el-button>
        </div>

        <el-button slot="reference" type="primary" plain class="margin5">筛选</el-button>
      </el-popover>
      <el-button type="success" plain class="margin5" @click="reLoad">重置</el-button>
    </div>
    <div class="msg">
      <el-table
        :data="msglist"
        style="width: 100%"
        height="100%"
        :header-cell-style="{color:'#000'}"
        @selection-change="getRow"
        @expand-change="openRow"
        v-loading="dataloading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="优先级" prop="messageType" width="60">
          <template slot-scope="props">
            <i :class="props.row.iconType" class="el-icon-star-on"></i>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="subject">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.receiverTime==null"
              class="item"
              effect="dark"
              content="未读"
              placement="bottom"
            >
              <i class="ibps-icon-envelope-o" />
            </el-tooltip>
            <el-tooltip v-else class="item" effect="dark" content="已读" placement="bottom">
              <i class="ibps-icon-envelope-open-o" />
            </el-tooltip>
            <span class="sub">您有一条{{scope.row.subject}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="messageType">
          <template slot-scope="props">
            <div :class="props.row.btnType">{{props.row.messageType}}</div>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="createTime" :formatter="dateFormat"></el-table-column>

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="center" inline class="demo-table-expand" v-loading="loading">
              <el-form-item label="单据号">
                <span class="doclink">{{ props.row.docNumber }}</span>
              </el-form-item>
              <el-form-item label="单据类型">
                <span>{{ props.row.bsDescribe }}</span>
              </el-form-item>
              <el-form-item label="提单人">
                <span>{{ props.row.userNo }}-{{ props.row.userName }}</span>
              </el-form-item>
              <el-form-item label="总金额">
                <span>{{ props.row.towrbtr }}</span>
              </el-form-item>
              <el-form-item label="单据事由">
                <span>{{ props.row.doreason }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
import {
  queryReceivePageList,
  remove,
  markRead
} from "@/api/platform/message/innerMessage";
import ActionUtils from "@/utils/action";
import request from "@/utils/request";
import { PLATFORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";

export default {
  data() {
    return {
      input: "",
      totalCount: 0,
      msgtype: "",
      selectime: "",
      starttime: "",
      endtime: "",
      searchicon: "&#xe664 请输入内容",
      visible: false,
      currentPage: 1,
      multipleSelection: [],
      multipleSelectionIds: [],
      instId: "",
      msglist: [],
      loading: false,
      dataloading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      options: [
        {
          value: "",
          label: "全部消息"
        },
        {
          value: "backlog",
          label: "待办"
        },
        {
          value: "remind",
          label: "提醒"
        },
        {
          value: "notice",
          label: "通知"
        }
      ]
    };
  },
  methods: {
    // 加载数据
    loadData() {
      // 未读消息列表
      // return request({
      //   // baseURL: "http://192.168.30.23:5100/ibps",
      //   baseURL: BASE_GATEWAY_API,
      //   url: PLATFORM_URL + "/msg/innerMessage/msgList",
      //   method: "get",
      //   data: {}
      // })
      this.dataloading = true;
      return request({
        url: PLATFORM_URL + "/msg/innerMessage/receive",
        method: "post",
        data: {
          parameters: [
            {
              key: "Q^subject^SL",
              value: this.input
            },
            {
              key: "Q^messageType^SL",
              value: this.msgtype
            },
            {
              key: "Q^beginreceiveTime^DL",
              value: this.starttime
            },
            {
              key: "Q^endreceiveTime^DG",
              value: this.endtime
            }
          ],
          requestPage: {
            pageNo: this.currentpage,
            limit: 20,
            totalCount: null
          },
          sorts: []
        }
      })
        .then(res => {
          this.totalCount = res.data.pageResult.totalCount;
          let msg = [];
          this.msglist = [];
          // console.log("loadData", res);
          msg = res.data.dataResult;
          msg.forEach(item => {
            if (item.messageType == "remind") {
              item.messageType = "提醒";
              item.btnType = "warning";
              item.iconType = "iconwarning";
            } else if (item.messageType == "backlog") {
              item.messageType = "待办";
              item.btnType = "danger";
              item.iconType = "icondanger";
            } else if (item.messageType == "notice") {
              item.messageType = "通知";
              item.btnType = "success";
              item.iconType = "iconsuccess";
            }
          });
          this.msglist = msg;
          // console.log("this.msglist", this.msglist);
          this.dataloading = false;
        })
        .catch(res => {
          this.dataloading = false;
        });
    },
    // 标记为已读
    handleAlreadyRead() {
      markRead({ innerMessageIds: this.multipleSelectionIds })
        .then(response => {
          this.$message({
            message: "标记已读成功",
            type: "success"
          });
          this.loadData();
        })
        .catch(() => {});
    },
    // 删除
    handleRemove() {
      remove({ innerMessageIds: this.multipleSelectionIds })
        .then(response => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.loadData();
        })
        .catch(() => {});
    },
    getRow(val) {
      let ids = [];
      this.multipleSelection = val;
      val.forEach(i => {
        ids.push(i.id);
      });
      this.multipleSelectionIds = ids.toString();
    },
    openRow(row) {
      this.loading = true;
      return request({
        // baseURL: "http://192.168.30.23:5100/ibps",
        baseURL: BASE_GATEWAY_API,
        url: "/bpm/v3/bpm/task/find?instId=" + row.instId,
        method: "get",
        data: {}
      })
        .then(res => {
          let openitem = {};
          const {
            docNumber,
            bsDescribe,
            userNo,
            userName,
            towrbtr,
            doreason
          } = res.data;
          openitem = {
            docNumber,
            bsDescribe,
            userNo,
            userName,
            towrbtr,
            doreason
          };
          this.msglist.forEach(item => {
            if (item.instId == row.instId) {
              item = Object.assign(item, openitem);
            }
          });
          markRead({ innerMessageIds: row.id }).then(response => {});
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
        });
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
    confirm() {
      this.currentpage = 1;
      this.loadData();
      this.visible = false;
    },
    cancel() {
      this.visible = false;
    },
    reLoad() {
      this.input = "";
      this.msgtype = "";
      this.starttime = "";
      this.endtime = "";
      this.selectime = "";
      this.loadData();
    },
    pickTime(val) {
      // console.log("val", val);
      this.starttime = val ? val[0] : "";
      this.endtime = val ? val[1] : "";
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
  }
  .header {
    font-weight: 700;
    font-size: 18px;
    margin: 0;
  }
}
.btn {
  .inp {
    width: 200px !important;
  }
  .margin5 {
    margin: 0 3px;
  }
  margin-bottom: 15px;
}
.msg {
  height: 85%;
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
.warning {
  color: #e6a23c;
  background: #fdf6ec;
  border: 1px solid #f5dab1;
  width: 45px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  text-align: center;
}
.danger {
  color: #f56c6c;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  width: 45px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  text-align: center;
}
.success {
  color: #67c23a;
  background: #f0f9eb;
  border: 1px solid #c2e7b0;
  width: 45px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  text-align: center;
}
.iconwarning {
  font-size: 22px;
  color: #e6a23c;
}
.icondanger {
  font-size: 22px;
  color: #f56c6c;
}
.iconsuccess {
  font-size: 22px;
  color: #67c23a;
}
</style>