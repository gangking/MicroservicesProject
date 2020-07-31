<template>
  <div class="person-selector">
    <el-dialog
      ref="dialog"
      title="人员选择器"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="dialog"
      @close="closeDialog"
      @open="loadData"
      append-to-body
    >
      <div>
        <div class="header-btn" ref="headerBtn">
          <div class="btn-wrapper">
            <div class="btn-left">
              <el-button type="primary" @click="handler('search')">查询</el-button>
            </div>
          </div>
        </div>
        <div class="header-input" ref="headerInput">
          <el-form
            :inline="true"
            :model="formInline"
            class="form-content"
            ref="ruleForm"
            label-width="80px"
          >
            <el-form-item label="员工姓名">
              <el-input v-model="formInline.NAME_" placeholder="员工姓名"></el-input>
            </el-form-item>
            <el-form-item label="员工工号">
              <el-input v-model="formInline.USERNO_" placeholder="员工工号"></el-input>
            </el-form-item>
            <el-form-item label="公司描述">
              <el-input v-model="formInline.BUTXT" placeholder="公司描述"></el-input>
            </el-form-item>
            <el-form-item label="部门描述">
              <el-input v-model="formInline.ORGTXT" placeholder="部门描述"></el-input>
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
            @selection-change="selection"
            style="width: 100%"
          >
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column prop="name" label="员工姓名" width="120"></el-table-column>
            <el-table-column prop="userno" label="员工工号" width="180"></el-table-column>
            <el-table-column prop="butxt" label="公司描述"></el-table-column>
            <el-table-column prop="orgtxt" label="部门描述"></el-table-column>
            <!-- <el-table-column prop="domainAccount" label="域账号"></el-table-column> -->
          </el-table>
        </div>
        <div class="footer" ref="footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          ></el-pagination>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { personSelector } from "@/api/platform/quato/quato";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    balanceObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectData: [],
      height: 300,
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 100, // 每页多少条
      totalCount: 0, //总数
      dialogVisible: false,

      compon: "",
      loading: false,
      formInline: {
        NAME_: "",
        USERNO_: "",
        BUTXT: "",
        ORGTXT: ""
      }
    };
  },
  computed: {},
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
    handler(command) {
      switch (command) {
        case "search":
          this.getTable();
          break;
        default:
          break;
      }
    },
    selection(data) {
      this.selectData = data;
      console.log(data);
    },

    selectPerson(data) {},
    closeDialog() {
      this.$emit("update:visible", false);
    },
    confirm() {
      this.closeDialog();
      //   console.log(this.selectData, "selectData");
      this.$emit("selectHandle", this.selectData);
    },
    loadData() {
      this.getTable();
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

      for (const key in this.formInline) {
        if (this.formInline.hasOwnProperty(key)) {
          const element = this.formInline[key];
          params.parameters.push({
            key: `Q^${key}^SL`,
            value: element
          });
        }
      }

      personSelector(params).then(response => {
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
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  .el-dialog__body {
    padding: 5px !important;
  }
}
.dialog-footer {
  text-align: center;
}
</style>
