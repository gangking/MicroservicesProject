<template>
  <div id="table">
    <template>
      <div class="header-btn">
        <label>流程名称：</label>
        <el-select
          v-model="defId"
          filterable
          remote
          reserve-keyword
          clearable
          placeholder="请输入流程名称"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="selectNode"
          @focus="selectAll"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        :height="caclHeight"
        highlight-current-row
        @row-click="rowClick"
        style="width: 100%"
      >
        <el-table-column prop="nodeId" label="流程节点ID"></el-table-column>
        <el-table-column prop="name" label="流程节点名称"></el-table-column>
      </el-table>
    </template>
  </div>
</template>
        

<script>
import { bpmnDefinition, getTable } from "@/api/platform/bpmn/bpmDistribute";
export default {
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      tableData: [
        // {
        //   nodeId: "UserStart",
        //   name: "发起人"
        // },
        // {
        //   nodeId: "UserTask_1evmw00",
        //   name: "领导审批"
        // },
        // {
        //   nodeId: "UserTask_1i0h5qy",
        //   name: "共享审核"
        // }
      ],
      defId: "", //选择的值 defId
      options: [], //下拉选择数据
      alloption: [], //全部下拉数据
      loading: false,
      tableLoading: false,
      getIndex: ""
    };
  },
  computed: {
    caclHeight() {
      return this.height - 106;
    }
  },
  created() {},
  mounted() {
    this.getDefinition();
  },
  watch: {
    defId: {
      handler(val, oldVal) {
        if (val !== "") {
          this.tableLoading = true;
          getTable({ defId: val }).then(response => {
            this.tableLoading = false;
            //  console.log("response", response);
            this.tableData = response.data.map(item => {
              return {
                nodeId: item.nodeId,
                name: item.name
              };
            });
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取流程下拉数据
    getDefinition() {
      bpmnDefinition({
        parameters: [{ key: "Q^name_^SL", value: "" }],
        requestPage: { pageNo: 1, limit: 1000 },
        sorts: []
      }).then(response => {
        this.options = response.data.dataResult.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
        this.alloption = this.options;
        console.log(response);
      });
    },
    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.options = this.alloption.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.options = this.alloption;
      }
    },
    selectAll() {
      // this.options = this.alloption;
    },
    selectNode(val) {
      this.$emit("clearTable", val);
     // console.log(val, "改变值");
    },
    rowClick(row, column, event) {
      console.log(this.defId, row.nodeId);
      this.$emit("tableSelect", this.defId, row.nodeId);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.header-btn {
  height: 50px;
  line-height: 50px;
}
/deep/ .el-table__row {
  cursor: pointer;
  color: #000;
}
/deep/ .el-table__body tr.current-row > td {
  background-color: #dbe8f3  !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
/deep/ .el-table__header .cell {
  color: #000;
}
</style>
