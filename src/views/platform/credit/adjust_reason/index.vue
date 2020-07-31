<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <el-button type="primary" @click="handler('add')">新增</el-button>
          <!-- <el-button type="primary" @click="handler('importExcel')">导入</el-button> -->
          <el-button type="primary" @click="handler('downExcel')">导出</el-button>
        </div>
        <div class="btn-right">
          <el-button type="success" @click="handler('back')">返回</el-button>
        </div>
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :rules="rules" :inline="true" ref="ruleForm" label-width="100px">
        <el-form-item label="编号">
          <el-input v-model="ruleForm.SERIAL_NUMBER_" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="调整原因">
          <el-input v-model="ruleForm.CAUSE_DESCRIBE_" placeholder="请输入调整原因" clearable></el-input>
        </el-form-item>
        <el-form-item label="调整类型">
          <el-input v-model="ruleForm.ADJUST_TYPE" placeholder="请输入调整类型" clearable></el-input>
        </el-form-item>
        <el-form-item label="调整类型描述">
          <el-input v-model="ruleForm.ADJUST_DES" placeholder="请输入调整类型描述" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.STATUS_" clearable placeholder="请选择状态">
            <el-option label="停用" :value="statusClose"></el-option>
            <el-option label="启用" :value="statusOpen"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--  -->
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        :height="height"
        :data="tableData"
        border
        highlight-current-row
        v-loading="loading"
        tooltip-effect="dark"
        @section-change="selection"
        style="width: 100%"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="serialNumber" label="编号"></el-table-column>
        <el-table-column prop="causeDescribe" label="调整原因"></el-table-column>
        <el-table-column prop="adjustType" label="调整类型代码"></el-table-column>
        <el-table-column prop="adjustDes" label="调整类型描述"></el-table-column>
        <el-table-column prop="resizeScore" label="调整分值"></el-table-column>
        <el-table-column label=" 状态">
          <template slot-scope="scope">{{transStatus(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleBtn('edit',scope.$index, scope.row)">编辑</el-button>

            <el-button
              size="mini"
              type="danger"
              @click="handleBtn('delete',scope.$index, scope.row)"
            >删除</el-button>
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
    <!-- 新增 编辑 -->
    <credit-dialog
      :visible.sync="creditVisible"
      @upTable="search"
      @close="visible=>creditVisible =visible"
      :title="title"
      :adjustType="adjustType"
      :creditData="creditData"
    />
  </div>
</template>

<script>
import {
  creditQuery,
  creditSave,
  creditEdit,
  creditRemove,
  downExcel
} from "@/api/platform/credit/adjust_reason";
import creditDialog from "@/views/platform/credit/adjust_reason/components/dialog";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      statusOpen: 1,
      statusClose: 0,
      creditVisible: false,
      loading: false,
      bgLoading: false,
      ruleForm: {
        SERIAL_NUMBER_: "",
        STATUS_: "",
        CAUSE_DESCRIBE_: "",
        ADJUST_DES: "",
        ADJUST_TYPE: ""
      },
      rules: {},
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0,
      title: "",
      creditData: {} //编辑用到的数据
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
    this.getTable();
    setTimeout(() => {
      this.getHeight();
    }, 100);
  },
  watch: {},
  methods: {
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "add":
          this.creditData = {};
          this.creditVisible = true;
          this.title = "新增";
          break;
        case "downExcel":
          let idsDown = ActionUtils.getSelectedIds(
            this.$refs.multipleTable.selection
          );
          if (idsDown.length == 0) {
            this.$message({
              message: "至少选择一条数据",
              type: "warning"
            });
            return;
          }
          downExcel({ ids: idsDown })
            .then(response => {
              console.log(response);
              if (response) {
                ActionUtils.exportFile(
                  response.data,
                  fecha.formatDate("yyyyMMddHHmmss") + ".xls"
                );
              }
            })
            .catch(req => {
              console.log("下载失败");
            });

          break;
        case "back":
          this.$router.push({
            path: "/ResolutionCenter/xygl/xytzlxwh"
          });
        default:
          break;
      }
    },

    //  按钮处理事件
    handleBtn(command, index, row) {
      switch (command) {
        case "edit":
          this.creditData = row;
          this.title = "编辑";
          this.creditVisible = true;
          break;
        case "delete":
          creditRemove({ ids: row.id }).then(response => {
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
                message: "删除不成功，请重试",
                type: "warning"
              });
            }
          });
          break;
        default:
          break;
      }
    },
    //搜索
    search() {
      this.getTable();
    },
    transStatus(value) {
      if (value == "0") {
        return "停用";
      } else if (value == "1") {
        return "启用";
      }
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      let params = {
        parameters: [
          {
            key: "Q^ADJUST_TYPE^SL",
            value: this.$route.query.type
          }
        ],
        requestPage: {
          limit: this.pageSize || limit,
          pageNo: this.currentPage || pageno
        },
        sorts: [
          {
            field: "SERIAL_NUMBER_",
            order: "SERIAL_NUMBER_"
          }
        ]
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
      creditQuery(params).then(response => {
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
        this.$refs.header_btn.clientHeight -
        this.$refs.header_input.clientHeight -
        this.$refs.footer.clientHeight;
    }
  },
  components: {
    creditDialog
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
