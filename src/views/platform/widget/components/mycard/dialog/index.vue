<template>
  <div class="chart">
    <el-dialog
      ref="dialog"
      title
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      top="5vh"
      width="80%"
      class="mycard_dialog"
      @close="closeDialog"
      @open="getFormData"
      append-to-body
    >
      <div class="credit-score" ref="credit_score">
        <div class="credit-score-title wrapper" ref="title">
          <div class="score-title-top">
            我的信用分
            <span>{{creditObj.xyzf}}</span>
          </div>
          <div class="score-title-tip wrapper">
            <div class="left">
              <img src="@/assets/images/mycard/tip.png" />
              期初信用分值为{{creditObj.benchmarkScores}}分，你的信用已累计{{comput(creditObj.xyf)}}分，请继续加油！
            </div>
            <div class="right">
              <el-button type="success" class="btn" plain @click="handler('downExcel')">导出</el-button>
            </div>
          </div>
        </div>
        <div class="table-content" :style="{height:height+'px'}">
          <el-table
            ref="multipleTable"
            :height="height"
            :data="tableData"
            v-loading="loading"
            style="width: 100%"
          >
            <!-- <el-table-column type="selection" align="center"></el-table-column> -->
            <el-table-column align="center" label="单据编号">
              <template slot-scope="scope">
                <el-link @click="routeForm(scope.row)">{{scope.row['单据编号']}}</el-link>
                <!-- <span class="routeForm" @click="routeForm(scope.row['单据编号'])">{{scope.row['单据编号']}}</span> -->
              </template>
            </el-table-column>
            <el-table-column label="信用分值增减" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row['信用分值增减']>=0?'blue':'red'"
                >{{exchCopies(scope.row['信用分值增减'])}}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前信用分值" align="center">
              <template slot-scope="scope">
                <span class="blue">{{scope.row['当前信用分值']}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="操作时间" align="center" label="操作时间"></el-table-column>
            <el-table-column label="明细" width="100" align="center" class="transitRotate">
              <template slot-scope="scope">
                <!-- <el-button
                  type="text"
                  @click="toogleExpand(scope.row)"
                >{{scope.row.expansion ? '收起' : '查看详情'}}</el-button>-->
                <div class="transitRotate">
                  <img
                    @click="toogleExpand(scope.row)"
                    class="transitImg"
                    src="@/assets/images/mycard/close.png"
                    :class="scope.row.expansion?'open':'close'"
                  />
                </div>
              </template>
            </el-table-column>

            <el-table-column type="expand" width="1">
              <template slot-scope="props">
                <el-timeline v-loading="detailLoading">
                  <el-timeline-item
                    v-for="(activity, index) in creditLine"
                    :color="activity.color"
                    :key="index"
                  >
                    <div class="timeLine">
                      <span>信用分:</span>
                      <label :class="activity.cxf>0?'upNum':'downNum'">{{exchCopies(activity.cxf)}}</label>
                    </div>
                    <div class="timeLine">
                      <span>操作节点:</span>
                      <label>{{activity.czNode}}</label>
                    </div>
                    <div class="timeLine">
                      <span>审批意见：</span>
                      <label>{{activity.content}}</label>
                    </div>
                  </el-timeline-item>
                </el-timeline>
                <div class="detail"></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer" ref="footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMx,
  downExcel,
  getMxByDocNumber
} from "@/api/platform/credit/score";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import _ from "lodash";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    creditObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    userNo: {
      type: String,
      default: ""
    }
  },
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      height: 0,
      loading: false,
      detailLoading: false,
      ruleForm: {
        docNumber: ""
      },
      creditLine: [],
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0 //总数
    };
  },
  computed: {
    tableResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.getHeight();
        });
      }, 150);
    }
  },
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  methods: {
    routeForm(row) {
      console.log(row);
      this.ibpsPayable.setPayableParams({
        appId: row.appId,
        instId: row.instId,
        taskId: row.taskId,
        status: "approverQuery"
      });
    },
    exchCopies(num) {
      if (num > 0) {
        return "+" + num;
      } else {
        return num;
      }
    },
    comput(num) {
      let number = Math.abs(num);
      if (num >= 0) {
        return "增涨了" + number;
      } else {
        return "减少了" + number;
      }
    },
    toogleExpand(row) {
      // 加载详情数据
      if (!row.expansion) {
        this.creditLine = [];
        this.detailLoading = true;
        this.getDetail(row["单据编号"]);
      }
      console.log(row);
      let $table = this.$refs.multipleTable;
      this.tableData.map(item => {
        if (row["单据编号"] != item["单据编号"]) {
          $table.toggleRowExpansion(item, false);
          item.expansion = false;
        } else {
          item.expansion = !item.expansion;
        }
      });
      $table.toggleRowExpansion(row);
      console.log(this.tableData, " this.tableData this.tableData");
    },
    getDetail(id) {
      getMxByDocNumber({ docNumber: id })
        .then(res => {
          console.log("res", "这是获取的详情");
          this.detailLoading = false;
          res.data.maps.forEach(item => {
            let obj = {};
            obj.content = item.spyj;
            obj.timestamp = item.date;
            obj.color = "#409EFF";
            obj.cxf = item.cxf;
            obj.czNode = item.czNode;
            this.creditLine.push(obj);
          });
        })
        .catch(err => {
          this.detailLoading = false;
        });
    },
    handler(command) {
      switch (command) {
        case "downExcel":
          // let selection = this.$refs.multipleTable.selection;
          downExcel({ userNo: this.userNo }).then(result => {
            if (result) {
              ActionUtils.exportFile(
                result.data,
                fecha.formatDate("yyyyMMddHHmmss") + ".xls"
              );
            }
          });
          break;
        default:
      }
    },
    closeDialog() {
      this.$emit("update:visible", false);
      window.removeEventListener("resize", this.tableResize);
    },
    btnClose() {
      this.$emit("update:visible", false);
    },
    getFormData() {
      window.addEventListener("resize", this.tableResize);
      this.getTable();
      setTimeout(() => {
        this.getHeight();
      }, 100);
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      getMx({
        userNo: this.userNo,
        page: this.currentPage,
        limit: this.pageSize
      }).then(response => {
        this.loading = false;
        // let obj = {
        //   state: 200,
        //   request: null,
        //   message: "",
        //   cause: "1",
        //   variables: {},
        //   data: [
        //     {
        //       信用分值增减: 0,
        //       操作时间: "2020-05-06",
        //       单据编号: "AM20200429000226",
        //       当前信用分值: 120
        //     }
        //   ]
        // };

        this.tableData = response.data;
        this.totalCount = response.cause == "" ? 0 : parseInt(response.cause);
        if (this.tableData) {
          this.tableData.map(item => {
            item.expansion = false;
          });
        }
      });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTable();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      //  console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTable();
    },
    getHeight() {
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.height =
        clientHeight * 0.9 -
        this.$refs.title.clientHeight -
        this.$refs.footer.clientHeight -
        70;
      // console.log(this.height, "this.heightthis.height");
    }
  },
  components: {},
  destroyed() {
    window.removeEventListener("resize", this.tableResize);
  }
};
</script>
<style lang="scss">
.mycard_dialog {
  .el-dialog__header {
    border-bottom: none;
  }
}
</style>
<style scoped lang="scss">
.credit-score {
  .credit-score-title {
    margin-bottom: 5px;
    .score-title-top {
      font-weight: bold;
      font-size: 20px;
      margin-top: 5px;
      margin-bottom: 10px;
      > span {
        color: #6772d6;
        font-size: 25px;
        font-weight: bold;
      }
    }
    .score-title-tip {
      color: #666;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        > img {
          width: 20px;
          height: 20px;
          margin-right: 2px;
        }
      }
      .right {
        .btn {
          padding: 10px 30px;
        }
      }
    }
    .header-btn {
      height: 60px;
      line-height: 60px;
      padding-left: 10px;
      margin-top: 5px;
      background-color: #f5f5f7;
      border: 1px solid #ebeef5;
      .btn-left {
        float: left;
      }
      .btn-right {
        float: right;
        padding-right: 10px;
      }
    }
    .header-input {
      margin-top: 5px;
      padding: 5px;
      border: 1px solid #ebeef5;
    }
    .footer {
      padding: 5px 0;
      border-top: 1px solid #dcdfe6;
      background: #fff;
    }
  }
}
.wrapper {
  padding: 0 15px 0;
}

.timeLine {
  margin-bottom: 3px;
  > span {
    font-size: 15px;
    font-weight: bold;
    color: #333;
  }
  > label {
    color: #333;
  }
  .upNum {
    color: #6aae60;
  }
  .downNum {
    color: red;
  }
}
.blue {
  color: #36d;
}
.red {
  color: rgb(206, 15, 15);
}
.routeForm {
  color: rgb(41, 61, 107);
  cursor: pointer;
}
/* 箭头 */
.transitRotate {
  display: flex;
  align-items: center;
  justify-content: center;
  .transitImg {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .close {
    transition: all 0.3s;
    transform: rotate(0deg);
  }
  .open {
    transition: all 0.3s;
    transform: rotate(90deg);
  }
}
/deep/ .el-dialog--center .el-dialog__body {
  padding: 5px 15px 10px;
}
/deep/ .el-table th {
  background: #fff !important;
}
/deep/ .el-table__header th.is-leaf {
  font-weight: bold !important;
  font-size: 15px;
  color: #333;
  border-bottom: none !important;
}
</style>
