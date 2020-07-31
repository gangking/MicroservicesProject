<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="请等待">
    <div class="redblock_title" ref="title">
      <label>我的余额明细</label>
    </div>
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        :height="height"
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection"></el-table-column> -->
        <el-table-column prop="docnumber" label="单据编号" align="center" sortable width="140"></el-table-column>
        <el-table-column prop="bsDesc" label="业务场景" align="center" sortable></el-table-column>
        <el-table-column prop="docDescription" label="单据描述" align="center" sortable></el-table-column>
        <el-table-column label="完成时间" align="center" width="140">
          <template slot-scope="scope">{{transformTime(scope.row.completionTime)}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button
              plain
              v-if="!scope.row.grade"
              @click="handleBtn('evaluate',scope.$index, scope.row)"
            >写评价</el-button>-->
            <span
              class="text"
              v-if="!scope.row.grade"
              @click="handleBtn('evaluate',scope.$index, scope.row)"
            >写评价</span>
            <!-- <el-button v-else type="info" plain>查看评价</el-button> -->
            <span class="text" v-else @click="handleBtn('look',scope.$index, scope.row)">查看评价</span>
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
        layout="total, prev, pager, next"
        :total="totalCount"
      ></el-pagination>
    </div>
    <!-- 新增 编辑 -->
    <servey-dialog
      :visible.sync="serveyVisible"
      @upTable="search"
      @close="visible=>serveyVisible =visible"
      :serveyData="serveyData"
      :title="title"
    />
    <!-- 搜索 -->
    <search-dialog
      :visible.sync="searchVisible"
      @upTable="search"
      @formFiled="searchForm"
      @close="visible=>searchVisible =visible"
    />
  </div>
</template>

<script>
import { docQuery } from "@/api/platform/servey/servey";
import { getUserNo } from "@/api/platform/assets/assets";
import serveyDialog from "@/views/platform/widget/components/servey/components/dialog";
import searchDialog from "@/views/platform/widget/components/servey/components/search";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      serveyVisible: false,
      searchVisible: false,
      loading: false,
      bgLoading: false,
      USERNO: "",
      userid: this.$store.getters.userId,
      ruleForm: {
        docnumber: ""
        // USERNO: ""
      },
      rules: {},
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0,
      title: "",
      serveyData: {} //编辑用到的数据
    };
  },
  computed: {
    tableResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.getHeight();
        });
      }, 150);
    },
    adjustType() {
      return this.$route.query.type;
    }
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.tableResize);
    this.getUser();
    setTimeout(() => {
      this.getHeight();
    }, 100);
  },
  watch: {},
  methods: {
    getUser() {
      getUserNo({ subPid: this.userid }).then(result => {
        //this.ruleForm.USERNO = result.data.userId;
        this.getTable();
      });
    },
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "openSearch":
          this.searchVisible = true;
          break;
        default:
          break;
      }
    },
    searchForm(form) {
      // this.loading = true;
      // let params = {
      //   parameters: [],
      //   requestPage: {
      //     limit: this.pageSize || limit,
      //     pageNo: this.currentPage || pageno
      //   },
      //   sorts: []
      // };
      // for (const key in form) {
      //   if (form.hasOwnProperty(key)) {
      //     const element = form[key];
      //     if (element || element == "0") {
      //       var strKey = "Q^";
      //       var strValue = "";
      //       if (Array.isArray(element)) {
      //         strKey = strKey + key + "^SIN";
      //         strValue = element.join(",");
      //       } else {
      //         strKey = strKey + key + "^SL";
      //         strValue = element;
      //       }
      //       params.parameters.push({
      //         key: strKey,
      //         value: strValue
      //       });
      //     }
      //   }
      // }
      // docQuery(params).then(response => {
      //   this.loading = false;
      //   this.tableData = response.data.dataResult;
      //   this.totalCount = response.data.pageResult.totalCount;
      // });
    },
    // 时间转换
    transformTime(timestamp) {
      if (timestamp) {
        var oDate = new Date(timestamp),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oSen = oDate.getSeconds(),
          oTime =
            oYear +
            "-" +
            this.addZero(oMonth) +
            "-" +
            this.addZero(oDay) +
            " " +
            this.addZero(oHour) +
            ":" +
            this.addZero(oMin) +
            ":" +
            this.addZero(oSen);
        return oTime;
      } else {
        return "";
      }
    },
    //添0操作
    addZero(num) {
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },
    //  按钮处理事件
    handleBtn(command, index, row) {
      switch (command) {
        case "evaluate":
          this.serveyData = row;
          this.title = "评价";
          this.serveyVisible = true;
          break;
        case "look":
          this.serveyData = row;
          this.title = "查看评价";
          this.serveyVisible = true;
          console.log("查看评价");
          break;
        default:
          break;
      }
    },
    //搜索
    search() {
      this.getTable();
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      let params = {
        parameters: [],
        requestPage: {
          limit: this.pageSize || limit,
          pageNo: this.currentPage || pageno
        },
        sorts: []
      };
      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          if (element || element == "0") {
            var strKey = "Q^";
            var strValue = "";
            if (Array.isArray(element)) {
              strKey = strKey + key + "^SIN";
              strValue = element.join(",");
            } else {
              strKey = strKey + key + "^SL";
              strValue = element;
            }
            params.parameters.push({
              key: strKey,
              value: strValue
            });
          }
        }
      }
      docQuery(params).then(response => {
        this.loading = false;
        this.tableData = response.data.dataResult;
        this.totalCount = response.data.pageResult.totalCount;
      });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTable();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTable();
    },
    getHeight() {
      this.height =
        this.$refs.main.clientHeight -
        this.$refs.title.clientHeight -
        // this.$refs.header_input.clientHeight -
        this.$refs.footer.clientHeight;
    }
  },
  components: {
    serveyDialog,
    searchDialog
  },
  destroyed() {
    window.removeEventListener("resize", this.tableResize);
  }
};
</script>

<style scoped lang="scss">
.bg {
  height: 100%;
  background: #fff;
  .redblock_title {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    .search {
      cursor: pointer;
      font-size: 18px;
      color: #36d;
    }
    .redblock {
      display: inline-block;
      width: 5px;
      height: 17px;
      background-color: #e61a23;
      margin-right: 15px;
    }
    > label {
      display: inline-block;
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .header-btn {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
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
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid #ebeef5;
    > div {
      margin-left: 5px;
      margin-right: 10px;
    }
  }
  .footer {
    padding: 5px 0;
    background: #fff;
    /deep/.el-pagination {
      text-align: center;
    }
  }
}
.text {
  cursor: pointer;
  color: #36c;
  text-decoration: underline;
  transition: all 0.3s;
}
.text:hover {
  color: rgb(51, 74, 119);
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
