<template>
  <div>
    <el-dialog
      title="返回字段关联"
      :visible.sync="remoteDialogCopy"
      width="45%"
      class="remote"
      @close="closeDialog"
      custom-class="remote-dialog"
      center
      append-to-body
       v-dialogDrag
    >
      <div>
        <el-table :data="dataSource" style="width: 100%">
          <el-table-column label="返回字段">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.label }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="表单字段">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.select"
                @change="selectChange"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in bingFrom"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="合并显示">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
              <el-switch v-model="scope.row.status" @change="switchChange"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="强制更新">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.update"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handelCancel">取 消</el-button>
        <el-button type="primary" @click="handelSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    remoteDialog: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    bingFrom: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      remoteDialogCopy: this.remoteDialog // dialog弹出框
    };
  },
  mounted() {},
  watch: {
    remoteDialog: {
      handler: function(val, oldVal) {
        this.remoteDialogCopy = this.remoteDialog;
      },
      immediate: true
    },
    bingFrom: {
      handler: function(val, oldVal) {
       // console.log(val);
      },
      immediate: true
    },
    dataSource: {
      handler: function(val, oldVal) {
        // this.copySource = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true
    }
    // copySource: {
    //   handler: function(val, oldVal) {
    //     console.log(val);
    //   },
    //   immediate: true
    // }
  },
  methods: {
    handelCancel() {
      this.$emit("close", false);
    },
    handelSure() {
      this.$emit("close", false);
    },
    closeDialog() {
      this.$emit("close", false);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    /* 选择值的变化 */
    selectChange(val) {
      // console.log(this.dataSource);
    },
    switchChange(val) {
      // console.log(this.dataSource);
    }
  },
  components: {}
};
</script>
<style >
.remote-dialog .el-dialog__body {
  max-height: 500px;
}
</style>

<style scoped lang="scss">
.remote {
  z-index: 9999;
}
</style>
