<template>
  <!-- 审计线索 -->
  <div>
    <!-- <el-button type="primary">审计线索</el-button> -->
    <el-table
      :data="tableData"
      :cell-style="tableCellStyle"
      row-key="id"
      @expand-change="getExTable"
      :show-header="true"
      :height="tableHeight"
      ref="table"
    >
      <el-table-column label="操作记录" prop="strResult"></el-table-column>
      <el-table-column type="expand" label="更多" width="45">
        <template slot-scope="scope">
          <el-table
            v-loading="scope.row.loading"
            :data="scope.row.exTable"
            :show-header="false"
            class="exTab"
          >
            <el-table-column label="记录" prop="strResult"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from "@/utils/request";
import { COMP_URL } from "@/api/baseUrl";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapGetters } = createNamespacedHelpers(
  "ibps/compositeBase"
);
export default {
  data() {
    return {
      id: "",
      tableData: [],
      tableHeight: ""
    };
  },
  methods: {
    getTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 240;
    },
    tableCellStyle() {
      return "font-weight:700";
    },
    getHisTable() {
      return request({
        url: COMP_URL + `/scene/v3/bsAuditLog/findHeadList?instId=${this.instId}`,
        method: "get"
      })
        .then(res => {
          if (res.state == 200) {
            let table = res.data;
            table.forEach(item => {
              item.exTable = [];
              item.loading = true;
            });
            this.tableData = table;
          } else {
            this.tableData = [];
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    getExTable(row, expanded) {
      return request({
        url: COMP_URL + `/scene/v3/bsAuditLog/findItemList?pid=${row.id}`,
        method: "get"
      })
        .then(res => {
          if (res.state == 200) {
            row.loading = false;
            row.exTable = res.data;
          } else {
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },
  created() {
    this.getTableHeight();
  },
  mounted() {
    this.getHisTable();
  },
  computed: {
    ...mapState(["steps", "instId", "taskId", "tableHeaderId"])
  },
  props: {
    // instId: {
    //   type: String,
    //   default: "718480007109804032"
    // }
  },
  watch: {
    // instId: {
    //   handler: function(val, oldVal) {
    //     this.id = val;
    //   },
    //   immediate: true
    // },
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-table__expanded-cell {
  padding: 10px 50px;
  p {
    margin: 5px !important;
  }
}
.exTab {
  /deep/ .el-table__row > td {
    border: none !important;
    padding: 0;
  }
}
/deep/ .exTab::before {
  height: 0px !important;
}
</style>

