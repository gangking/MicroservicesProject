<template>
  <div>
    <el-dialog title="请选择业务场景"
               :visible.sync="dialogTableVisible"
               width="600px"
               append-to-body>
      <el-table :data="gridData"
                highlight-current-row
                @current-change="handleCurrentChange">
        <el-table-column label="选择场景"
                         width="100">
          <template slot-scope="scope">
            <input type="radio"
                   name="changjing"
                   :id="'radio'+scope.row.bizKey" />
          </template>
        </el-table-column>
        <el-table-column property="name"
                         label="业务场景名称" />
        <el-table-column property="bizKey"
                         label="业务场景主键" />
        <el-table-column property="boDefId"
                         label="业务对象编码" />
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="btnClick('cancellation')">取 消</el-button>
        <el-button type="primary"
                   @click="btnClick('confirm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'scenario-dialog',
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: []
    }
  },
  watch: {
    dataList (val) {
      this.gridData = val;
    }
  },
  data () {
    return {
      gridData: [],
      selectScenario: [],
      list: [],
      radio: '1'
    }
  },
  methods: {
    // 单选事件
    handleCurrentChange (val) {
      console.log('选中行信息', val)
      this.selectScenario = [val];
      var id = 'radio'+val.bizKey;
      var dom = document.getElementById(id);
      console.log('选中行所在单选按钮',dom)
      dom.click();
    },
    // 弹窗按钮事件
    btnClick (key) {
      switch (key) {
        case 'cancellation':
          this.$emit('dialogVisible', false);
          break;
        case 'confirm':
          if (this.selectScenario.length > 0) {
              this.$emit('getScenario', this.selectScenario);
              this.$emit('dialogVisible', false);
          } else {
            this.$message.error('请选择一个业务场景！');
          }
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  height: 300px;
}
</style>