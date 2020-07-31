<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="选择业务场景"
      append-to-body
      
      @open="loadData()"
      @close="closeDialog"
    >
      <div class="select-main">
        <el-table
          :data="dataTable"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column label="选择场景" width="80">
            <template slot-scope="scope">
              <el-radio
                :label="scope.row.bizKey"
                v-model="templateRadio"
                @change.native="getTemplateRow(scope.$index,scope.row)"
              >&nbsp</el-radio>
            </template>
          </el-table-column>

          <el-table-column property="name" label="业务场景名称" />
          <el-table-column property="bizKey" label="业务场景主键" />
          <el-table-column property="boDefId" label="业务对象编码" />
        </el-table>
      </div>
      <div slot="footer" class="el-dialog--center">
        <el-button type="primary" @click="handlerConfirm">确定</el-button>
        <el-button @click="handlerCacncel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataTable: {
      type: Array,
      default: () => []
    },
    selectId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      templateRadio: "", //默认选中的
      dialogVisible: false,
      selectData: {}
    };
  },
  computed: {
    // dialogVisible() {
    //   return this.visible;
    // }
  },
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    selectId: {
      handler: function(val, oldVal) {
        this.templateRadio = this.selectId;
      },
      immediate: true
    }
  },
  methods: {
    loadData() {},
    closeDialog() {
      this.$emit("close", false);
    },
    handlerConfirm() {
      this.$emit("selectData", this.selectData);
      this.closeDialog();
    },
    handlerCacncel() {
      this.closeDialog();
    },
    getTemplateRow(index, row) {
      this.selectData = row;
      console.log(row, "当前行的信息");
    },
    handleCurrentChange() {}
  },
  components: {}
};
</script>

<style scoped lang="scss">
/deep/.el-dialog > .el-dialog__body {
  max-height: 410px;
}
</style>
