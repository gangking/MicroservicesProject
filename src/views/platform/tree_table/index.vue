<template>
  <div class="table">
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      height="100%"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        v-for="(column,index) in columns"
        :key="index+Math.random()"
        :label="column.columnDesc"
        :width="column.columnName==='id'?220:'' "
      >
        <template slot-scope="scope">
          <span v-if="column.columnName==='id'" style="margin-left: 10px">{{ scope.row.partName }}</span>
          <el-input
            v-else-if="column.controlType==='text' "
            :value="computeData(column,scope.row)"
            @input="value=>scope.row[column['columnName']] = value"
            :disabled="column.columnEditable==='r'"
            placeholder=""
            clearable
          ></el-input>
          <el-select
            v-model="scope.row.deviceDunw"
            v-else-if="column.controlType==='select' "
            placeholder="请选择"
          >
            <el-option
              v-for="item in column.initJson"
              :key="item.selectText "
              :label="item.selectText"
              :value="item.selectKey"
            ></el-option>
          </el-select>
          <!-- <span>{{computeData(column,scope.row)}}</span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import table from "./data/data.json";
import columnData from "./data/column.json";
import MinXin from "@/views/platform/tree_table/mixins/formula.js";
export default {
  props: {},
  data() {
    return {
      tableData: table,
      columns: columnData.columnAttrs
    };
  },
  mixins: [MinXin],
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    computeData(column, row) {
      if (!column.rowFormula) {
        return row[column["columnName"]];
      }
      if (column.rowFormula.indexOf("*") != -1) {
        console.log(row);
        let arr = column.rowFormula.split("*");
        console.log(row[arr[0]], row[arr[1]]);
        return row[arr[0]] * row[arr[1]];
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.table {
  height: 100%;
}
</style>
