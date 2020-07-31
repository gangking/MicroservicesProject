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
            <span>我的余额明细</span>
            金额为正数表示有欠款，金额为负数表示有余额，当存在日常欠款时需要冲账
          </div>
          <div class="score-title-tip wrapper">
            <div class="left">
              <img src="@/assets/images/mycard/tip.png" />
              您当前日常欠款：100.00RMB | 95.00USD | 4,500.00 JPY | 600.00 GBP
            </div>
          </div>
          <div class="score-title-tip wrapper">
            <div class="left">
              <img src="@/assets/images/mycard/tip.png" />
              您当前特殊欠款：120.00RMB | 65.00USD | 47500.00 JPY | 500.00 GBP
            </div>
          </div>
        </div>
        <div class="header-btn" ref="headerBtn">
          <div class="btn-wrapper">
            <div class="btn-left">
              <el-button type="primary" plain @click="handler('search')">查询</el-button>
              <el-button type="success" plain @click="handler('export')">导出</el-button>
            </div>
            <!-- <div class="btn-right">
              <el-button type="success" @click="send">发送</el-button>
            </div>-->
          </div>
        </div>
        <div class="header-input" ref="headerInput">
          <el-form
            :inline="true"
            :model="formInline"
            class="form-content"
            ref="ruleForm"
            label-width="100px"
          >
            <el-form-item label="是否清账">
              <el-radio-group v-model="formInline.a">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">已清</el-radio>
                <el-radio :label="2">未清</el-radio>
              </el-radio-group>
              <!-- <el-select v-model="formInline.a" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
            </el-form-item>
            <el-form-item label="选择日期">
              <el-date-picker
                v-model="formInline.b"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
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
            <el-table-column prop="a1" align="center" sortable label="是否清账"></el-table-column>
            <el-table-column prop="a1" align="center" sortable label="公司代码"></el-table-column>
            <el-table-column prop="a1" align="center" sortable label="关联编号"></el-table-column>
            <el-table-column prop="a1" align="center" sortable label="金额"></el-table-column>
            <el-table-column prop="a1" align="center" sortable label="币种"></el-table-column>
            <el-table-column prop="a1" align="center" sortable label="凭证日期"></el-table-column>
            <el-table-column prop="a1" align="center" sortable label="凭证文本"></el-table-column>
            <el-table-column prop="a1" align="center" sortable label="业务范围描述"></el-table-column>
            <!-- <el-table-column label="信用分值增减" align="center">
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
            </el-table-column>-->
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
    userNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      height: 0,
      loading: false,
      detailLoading: false,
      formInline: {
        a: 0,
        b: []
      },
      options: [
        { label: "未清", value: 0 },
        { label: "已清", value: 1 },
        { label: "全部", value: 2 }
      ],
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
    handler(command) {
      switch (command) {
        case "downExcel":
          // let selection = this.$refs.multipleTable.selection;
          downExcel().then(result => {
            if (result) {
              ActionUtils.exportFile(
                result.data,
                fecha.formatDate("yyyyMMddHHmmss") + ".xls"
              );
            }
          });
          break;
        case "search":
          this.getTable();
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
      // this.loading = true;
      // getMx({
      //   userNo: this.userNo,
      //   page: this.currentPage,
      //   limit: this.pageSize
      // }).then(response => {
      //   this.loading = false;
      //   this.tableData = response.data;
      //   this.totalCount = response.cause == "" ? 0 : parseInt(response.cause);
      //   if (this.tableData) {
      //     this.tableData.map(item => {
      //       item.expansion = false;
      //     });
      //   }
      // });
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
        this.$refs.headerBtn.clientHeight -
        this.$refs.headerInput.clientHeight -
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
    color: #666;
    .score-title-top {
      margin-top: 5px;
      margin-bottom: 10px;
      > span {
        font-weight: bold;
        font-size: 20px;
        color: #000;
        margin-right: 10px;
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
