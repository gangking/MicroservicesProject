<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <el-button type="primary" @click="handler('save')">保存</el-button>
          <el-button type="primary" @click="handler('open')">批量启用</el-button>
          <el-button type="danger" @click="handler('close')">批量关闭</el-button>
        </div>
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :rules="rules" :inline="true" ref="ruleForm" label-width="125px">
        <el-form-item label="业务场景应用">
          <el-input v-model="ruleForm.bpmKey" placeholder="请输入业务场景应用" clearable></el-input>
        </el-form-item>
        <el-form-item label="业务场景应用描述">
          <el-input v-model="ruleForm.bpmDes" placeholder="请输入业务场景应用描述" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="信用体系描述">
          <el-input v-model="ruleForm.CREDIT_DESCRIBE_" placeholder="请输入信用体系描述" clearable></el-input>
        </el-form-item>-->
      </el-form>
    </div>
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        :height="height"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        highlight-current-row
        v-loading="loading"
        element-loading-text="加载中...请等待"
        tooltip-effect="dark"
        @section-change="selection"
        style="width: 100%"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="bpmKey" label="业务场景应用"></el-table-column>
        <el-table-column prop="describe" label="业务场景应用描述"></el-table-column>
        <el-table-column label="信用体系">
          <template slot-scope="scope">
            <el-select v-model="scope.row.creditSystemId" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in creditSystemList"
                :key="item.name+index"
                :label="item.label"
                :value="item.name"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="启用状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.exStatus"
              active-color="#13ce66"
              inactive-color="#ccc"
              @change="statusSwitch(scope.row,scope.$index)"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- <el-table-column label=" 状态">
          <template slot-scope="scope">{{transStatus(scope.row.status)}}</template>
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
</template>

<script>
import {
  creditQuery,
  editStatus,
  CreditService,
  CreditBpmService
} from "@/api/platform/credit/apply_management";
import ActionUtils from "@/utils/action";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      creditSystemList: [],
      loading: false,
      bgLoading: false,
      ruleForm: {
        bpmKey: "",
        bpmDes: ""
      },
      rules: {},
      tableData: [], //数据
      currentPage: 1, //当前页
      clickCurrentPage: 1, //记录当时第几页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0
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
  mounted() {
    window.addEventListener("resize", this.tableResize);
    this.getTable();
    setTimeout(() => {
      this.getHeight();
    }, 100);
    this.initData();
  },
  watch: {},
  methods: {
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "save":
          this.save();
          break;
        case "open":
          this.changeStatus(1);
          break;
        case "close":
          this.changeStatus(0);
          break;
        case "delete":
          ActionUtils.selectedRecord(this.$refs.multipleTable.selection)
            .then(data => {
              creditRemove({ id: data.id }).then(response => {
                if (response.state == 200) {
                  this.$message({
                    showClose: true,
                    message: "成功",
                    type: "success"
                  });
                  this.getTable();
                } else {
                  this.$message({
                    showClose: true,
                    duration: 6000,
                    message: "不成功，请重试",
                    type: "warning"
                  });
                }
              });
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    },
    save() {
      let selectData = this.$refs.multipleTable.selection;
      if (selectData.length == 0) {
        this.$message({
          message: "至少选择一条数据",
          type: "warning"
        });
        return;
      }
      let sendArr = [];
      selectData.forEach(list => {
        let creditDescribe = "";
        if (list.creditSystemId) {
          let index = this.creditSystemList.findIndex(item => {
            return item.name == list.creditSystemId;
          });
          creditDescribe = this.creditSystemList[index].label;
        }
        let obj = {
          bpmKey: list.bpmKey,
          creditDescribe: creditDescribe,
          creditSystemId: list.creditSystemId,
          describe: list.describe,
          id: list.id,
          status: list.exStatus == true ? 1 : 0
        };
        sendArr.push(obj);
      });
      this.saveData(sendArr);
    },
    changeStatus(status) {
      let selectData = this.$refs.multipleTable.selection;
      if (selectData.length == 0) {
        this.$message({
          message: "至少选择一条数据",
          type: "warning"
        });
        return;
      }
      let findIndex = selectData.findIndex(item => !item.creditSystemId);
      console.log(findIndex, "findIndexfindIndex");
      if (status == 1 && findIndex != -1) {
        this.$message({
          showClose: true,
          message: "选择的数据中有未选择信用体系的数据",
          type: "warning"
        });
        return;
      }
      let sendArr = [];
      selectData.forEach(list => {
        let creditDescribe = "";
        if (list.creditSystemId) {
          let index = this.creditSystemList.findIndex(item => {
            return item.name == list.creditSystemId;
          });
          creditDescribe = this.creditSystemList[index].label;
        }
        let obj = {
          bpmKey: list.bpmKey,
          creditDescribe: creditDescribe,
          creditSystemId: list.creditSystemId,
          describe: list.describe,
          id: list.id,
          status: status
        };
        sendArr.push(obj);
      });
      this.saveData(sendArr);
    },
    initData() {
      CreditService().then(res => {
        this.creditSystemList = res.data.map(item => {
          return {
            label: item.creditDescribe,
            name: item.id
          };
        });
      });
    },
    statusSwitch(data, index) {
      console.log(data);
      if (!data.creditSystemId && data.exStatus) {
        this.$message({
          showClose: true,
          message: "请选择对应的信用体系",
          type: "warning"
        });

        this.$set(data, "exStatus", false);
        return;
      }
      let creditDescribe = "";
      if (data.creditSystemId) {
        let index = this.creditSystemList.findIndex(item => {
          return item.name == data.creditSystemId;
        });
        creditDescribe = this.creditSystemList[index].label;
      }

      let Arr = [
        {
          bpmKey: data.bpmKey,
          creditDescribe: creditDescribe,
          creditSystemId: data.creditSystemId,
          describe: data.describe,
          id: data.id,
          status: data.status == 0 ? 1 : 0
        }
      ];
      this.saveData(Arr);
    },
    //搜索
    search() {
      this.getTable();
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //保存数据
    saveData(sendArr) {
      CreditBpmService(sendArr).then(response => {
        if (response.state == 200) {
          this.$message({
            showClose: true,
            message: "成功",
            type: "success"
          });
          this.getTable();
        } else {
          this.$message({
            showClose: true,
            duration: 6000,
            message: "不成功，请重试",
            type: "warning"
          });
        }
      });
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.currentPage = 1;
      this.loading = true;
      // let params = {
      //   parameters: [],
      //   requestPage: {
      //     limit: this.pageSize || limit,
      //     pageNo: this.currentPage || pageno
      //   },
      //   sorts: []
      // };
      // for (const key in this.ruleForm) {
      //   if (this.ruleForm.hasOwnProperty(key)) {
      //     const element = this.ruleForm[key];
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
      creditQuery(this.ruleForm).then(response => {
        this.loading = false;
        this.tableData = response.data.dataResult;
        response.data.dataResult.forEach((item, index) => {
          if (item.status == 1) {
            this.$set(this.tableData[index], "exStatus", true);
          } else {
            this.$set(this.tableData[index], "exStatus", false);
          }
        });
        this.totalCount = response.data.pageResult.totalCount;
        this.handleCurrentChange(this.clickCurrentPage);
      });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      // this.getTable();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.clickCurrentPage = val;
      // this.getTable();
    },
    getHeight() {
      this.height =
        this.$refs.main.clientHeight -
        this.$refs.header_btn.clientHeight -
        this.$refs.header_input.clientHeight -
        this.$refs.footer.clientHeight;
    }
  },
  components: {},
  destroyed() {
    window.removeEventListener("resize", this.tableResize);
  }
};
</script>

<style scoped lang="scss">
.bg {
  height: 100%;
  background: #fff;
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
    padding: 5px;
    border: 1px solid #ebeef5;
  }
  .footer {
    padding: 5px 0;
    border-top: 1px solid #dcdfe6;
    background: #fff;
  }
}
.checkBox /deep/ .el-form-item__content {
  width: 220px;
}
// /deep/ .el-loading-spinner .circular {
//   width: 80px;
//   height: 80px;
// }
</style>
