<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成策略定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <el-button type="primary" @click="handler('add')">新增</el-button>
          <!-- <el-button type="primary" @click="handler('save')">保存</el-button> -->
        </div>
        <!-- <div class="btn-right">
          <el-button type="success" @click="send">发送</el-button>
        </div>-->
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="125px">
        <el-form-item label="状态">
          <el-select v-model="ruleForm.status" clearable placeholder="请选择状态">
            <el-option label="停用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="集成策略编码">
          <el-input v-model="ruleForm.STT_CODE" placeholder="请输入系统编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="集成策略描述">
          <el-input v-model="ruleForm.STT_DESC" placeholder="请输入系统描述" clearable></el-input>
        </el-form-item>
        <el-form-item label="策略主业务对象">
          <el-input v-model="ruleForm.BO_CODE" placeholder="请输入系统描述" clearable></el-input>
        </el-form-item>
        <el-form-item label="集成接口">
          <el-input v-model="ruleForm.API_CODE" placeholder="请输入系统描述" clearable></el-input>
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
        <el-table-column prop="sttCode" label="集成策略编码"></el-table-column>
        <el-table-column prop="sttDesc" label="集成策略描述"></el-table-column>

        <el-table-column prop="boCode" label="策略主业务对象"></el-table-column>
        <el-table-column prop="apiCode" label="集成接口"></el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">{{transStatus(scope.row.status)}}</template>
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleBtn('enabled',scope.$index, scope.row)"
            >启用</el-button>
            <el-button size="mini" @click="handleBtn('edit',scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleBtn('stop',scope.$index, scope.row)">停用</el-button>
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
    <integrate-dialog
      :visible.sync="integrateVisible"
      @upTable="search"
      @close="visible=>integrateVisible =visible"
      :integrateData="integrateData"
    />
  </div>
</template>

<script>
import {
  integSysQuery,
  integSysAddEdit,
  integSysRemove
} from "@/api/platform/integrate/strategy";
import integrateDialog from "@/views/platform/integrate/integrateStrategy/components/dialog";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      integrateVisible: false,
      loading: false,
      bgLoading: false,
      ruleForm: {
        STT_CODE: "",
        STT_DESC: "",
        BO_CODE: "",
        API_CODE: "",
        status: ""
      },
      rules: {},
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0,
      integrateData: {} //编辑用到的数据
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
  },
  watch: {},
  methods: {
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "add":
          this.integrateData = {};
          this.integrateVisible = true;
          break;
        default:
          break;
      }
    },
    //按钮处理事件
    handleBtn(command, index, row) {
      switch (command) {
        case "enabled":
          // let exchange = this.changeData(row);
          // exchange["status"] = "1";
          integSysAddEdit({
            id: row.id,
            boCode: row.boCode,
            invokeRule: row.invokeRule,
            status: "1",
            sttCode: row.sttCode,
            sttComments: row.sttComments,
            sttDesc: row.sttDesc,
            sttType: row.sttType,
            apiCode: row.apiCode,
            apiId: row.apiId
          }).then(response => {
            this.search();
            console.log(response, "integSysAddEdit");
          });
          break;
        case "edit":
          this.integrateData = row;
          console.log(this.integrateData,'this.integrateData')
          this.integrateVisible = true;
          break;
        case "stop":
          // let exchangeStop = this.changeData(row);
          // exchangeStop["status"] = "0";
          integSysAddEdit({
            id: row.id,
            boCode: row.boCode,
            invokeRule: row.invokeRule,
            status: "0",
            sttCode: row.sttCode,
            sttComments: row.sttComments,
            sttDesc: row.sttDesc,
            sttType: row.sttType,
            apiCode: row.apiCode,
            apiId: row.apiId
          }).then(response => {
            this.search();
          });
          break;
        case "delete":
          integSysRemove({
            ids: row.id
          }).then(response => {
            this.search();
          });
          break;
        default:
          break;
      }
    },
    // changeData(changeObj) {
    //   let obj = {};
    //   for (const key in this.ruleForm) {
    //     if (this.ruleForm.hasOwnProperty(key)) {
    //       const element = changeObj[key];
    //       //  this.$set(obj, key, element);

    //       obj[key] = element;
    //     }
    //   }
    //   return obj;
    // },
    // 保存数据
    save() {
      this.loading = true;
      saveDiff(this.tableData)
        .then(response => {
          this.getTable();
        })
        .catch(response => {
          this.loading = false;
        });
    },
    transStatus(value) {
      if (value == "0") {
        return "停用";
      } else if (value == "1") {
        return "启用";
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
          if (element) {
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

      integSysQuery(params).then(response => {
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
    integrateDialog
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
