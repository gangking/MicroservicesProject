<template>
  <div class="integrate">
    <el-dialog ref="dialog" title="NC余额" center :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" class="dialog" width="50%" @close="closeDialog" @open="getTable" append-to-body>
      <div>
        <!--  -->
        <div class="table-content">
          <el-table ref="multipleTable" :data="tableData" border highlight-current-row v-loading="loading" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="bscode" label="客商类型"></el-table-column>
            <el-table-column prop="bscode" label="客商性质"></el-table-column>
            <el-table-column prop="bscode" label="公司"></el-table-column>
            <el-table-column prop="bscode" label="公司代码"></el-table-column>
            <el-table-column prop="bscode" label="人员编码"></el-table-column>
            <el-table-column prop="bscode" label="客商代码"></el-table-column>
            <el-table-column prop="bscode" label="客商编码"></el-table-column>

            <el-table-column prop="bscode" label="客商代码"></el-table-column>
            <el-table-column prop="bscode" label="科目名称"></el-table-column>
            <el-table-column prop="bscode" label="NC会计科目名称"></el-table-column>

            <el-table-column prop="bscode" label="科目编码"></el-table-column>
            <el-table-column prop="bscode" label="NC会计科目"></el-table-column>
            <el-table-column prop="bscode" label="借贷标志"></el-table-column>

            <el-table-column prop="bscode" label="BALANCE"></el-table-column>
          </el-table>
        </div>
        <div class="footer" ref="footer">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">确 认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAssBalance } from '@/api/platform/account_balance/balance';
import { showLoading, hideLoading } from '@/utils/loading';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('ibps/compositeDolog');
export default {
  name: 'invoice-nc-balance',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    itemVal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(['isHasFormExceptions'])
  },
  data() {
    return {
      dialogVisible: true,
      loading: false,
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 100
    };
  },
  created() {},
  mounted() {
    this.getTable();
  },
  watch: {},
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    confirm() {
      this.closeDialog();
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      let params = {
        headId: this.itemVal.headId,
        tableName: this.itemVal.tableName
      };

      console.log(params, 'paramsparamsparamsparams');
      //this.computedHeight();
      queryAssBalance(params).then(response => {
        this.loading = false;
        this.tableData = response.data;
        this.totalCount = response.data.length;
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
.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
</style>
