<template>
  <div class="panel-padding panel-body">
    <div class="header-btn">
      <el-button type="primary" plain style="float:right" @click="saveData">保存</el-button>
    </div>
    <el-table border :data="tableData" style="width: 100%" :height="caclHeight" v-loading="loading">
      <el-table-column label="业务场景" width>
        <template slot-scope="scope">
          <span>{{ scope.row.bsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务场景描述" width>
        <template slot-scope="scope">
          <span>{{ scope.row.bsDescribe }}</span>
        </template>
      </el-table-column>

      <el-table-column label="业务情形编码">
        <template slot-scope="scope">
          <span>{{ scope.row.bsiCode }}</span>

          <!-- <el-select
            v-model="scope.row.bsiCode"
            @change="sceneChangeId(scope.row.bsiCode,scope.$index,scope.row)"
            @focus="sceneFocus(scope.$index, scope.row)"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in scope.row.sceneFrom"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>-->
        </template>
      </el-table-column>
      <el-table-column label="业务情形描述" width>
        <template slot-scope="scope">
          <span>{{ scope.row.bsiDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column label="业务场景配置文件ID" width="120">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.disProfCode"
            @change="businesChangeId(scope.row.disProfCode,scope.$index,scope.row)"
            @focus="businesFocus(scope.$index, scope.row)"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in scope.row.bingFrom"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="显示状态配置文件描述" width>
        <template slot-scope="scope">
          <span>{{ scope.row.configDescribe}}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程配置文件ID" width="120">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.btnProfCode"
            @change="processChange(scope.row.btnProfCode,scope.$index,scope.row)"
            @clear="processClear(scope.$index)"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in profFrom"
              :key="item.name+index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="流程按钮配置文件描述" width>
        <template slot-scope="scope">
          <span>{{ scope.row.profDesc }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getProcessSelect,
  getBussitionSelect,
  saveBusiness
} from "@/api/platform/bpmn/bpmConfigChain";

import { queryTable, queryScene } from "@/api/platform/bpmn/bpmDistribute";
import { saveConfig } from "@/api/platform/bpmn/bpmConfigChain";
export default {
  data() {
    return {
      loading: false,
      chainNode: "", //最外层结构
      assignPoList: [], // 表单数据
      profFrom: [
        // { name: 1, label: 1 },
        // { name: 2222, label: 22222 },
        // { name: 33333, label: 33333 }
      ],
      tableData: [
        // {
        //   bsCode: "BS0001",
        //   bsDescribe: "场景描述1111",
        //   disProfCode: "",
        //   configDescribe: "文件描述",
        //   btnProfCode: "",
        //   profDesc: "",
        //   bingFrom: []
        // },
      ]
    };
  },
  props: {
    nodeId: {
      type: String,
      default: ""
    },
    clear: {
      type: Number,
      default: 0
    },
    defId: {
      type: String,
      default: ""
    },
    userTaskData: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number
    }
  },
  computed: {
    caclHeight() {
      return this.height - 106;
    }
  },
  watch: {
    nodeId: {
      handler(val, oldVal) {
       // this.getDetail();
      },
      immediate: true
    },
    tableData: {
      handler(val, oldVal) {
        // console.log("监测tableData的值", val);
        // this.$emit("splicingForm", this.nodeId, this.tableData);
        // console.log("tableData", this.tableData);
      },
      deep: true
    },
    clear: {
      handler(val, oldVal) {
        // this.tableData = [];
      },
      immediate: true
    }
  },
  methods: {
    getDetail() {
      this.loading = true;
      queryTable({ defId: this.defId, nodeId: this.nodeId }).then(response => {
        console.log("右侧表格", response);
        this.loading = false;
        this.tableData = response.data.map(i => {
          return {
            id: i.id,
            defId: this.defId,
            nodeId: this.nodeId,
            bsDescribe: i.bsDescribe,
            configDescribe: i.configDescribe,
            profDesc: i.profDesc,
            bsId: i.bsId,
            bsCode: i.bsCode,
            disProfCode: i.disProfCode,
            btnProfCode: i.btnProfCode,
            bsiCode: i.bsiCode,
            bsiDesc: i.bsiDesc
          };
        });
      });
    },
    /*  业务情形选择*/
    sceneChangeId(val, index, row) {
      let currentIndex = this.tableData[index].sceneFrom.findIndex(item => {
        return item.name == val;
      });
      if (currentIndex != -1) {
        this.$set(
          this.tableData[index],
          "bsiDesc",
          this.tableData[index].sceneFrom[currentIndex].bsiDesc
        );
      }
    },

    // /* 业务情形选择下  拉框 */
    // sceneFocus(index, row) {
    //   console.log(this.tableData);
    //   console.log(index);
    //   console.log("当前行的第一列name值，发送请求", this.tableData[index].bsId);
    //   console.log("bsId", this.tableData[index].bsId);
    //   queryScene({
    //     bsKey: row.bsId
    //   }).then(res => {
    //     console.log(res);
    //     let copyArr = res.data.map(item => {
    //       return {
    //         label: item.bsiCode,
    //         name: item.bsiCode,
    //         bsiDesc: item.bsiDesc
    //       };
    //     });
    //     console.log(copyArr);
    //     this.$set(this.tableData[index], "sceneFrom", []);
    //     copyArr.forEach(item => {
    //       this.tableData[index].sceneFrom.push(item);
    //     });
    //   });
    // },

    /*  业务场景选择*/
    businesChangeId(val, index, row) {
      let currentIndex = this.tableData[index].bingFrom.findIndex(item => {
        return item.name == val;
      });
      if (currentIndex != -1) {
        this.$set(
          this.tableData[index],
          "configDescribe",
          this.tableData[index].bingFrom[currentIndex].configDescribe
        );
      }
    },

    /* 业务场景配置文件 选择下拉框 */
    businesFocus(index, row) {
      console.log(this.tableData);
      console.log(index);
      console.log("当前行的第一列name值，发送请求", this.tableData[index].bsId);
      console.log("bsId", this.tableData[index].bsId);
      getProcessSelect({
        bsKey: row.bsId,
        // bsiCode: row.bsiCode,
        status: "1"
      }).then(res => {
        console.log(res);
        let copyArr = res.data.map(item => {
          return {
            label: item.configCode,
            name: item.configCode,
            configDescribe: item.configDescribe
          };
        });
        console.log(copyArr);
        this.$set(this.tableData[index], "bingFrom", []);
        copyArr.forEach(item => {
          this.tableData[index].bingFrom.push(item);
        });
      });
    },
    /* 获取流程配置文件id */
    getBtnProfCode() {
      getBussitionSelect({ status: "true" }).then(res => {
        this.profFrom = res.data.map(item => {
          return {
            label: item.profCode,
            name: item.profCode,
            profDesc: item.profDesc
          };
        });
        //  console.log("流程配置文件ID", res);
      });
    },
    /* 下拉选择流程配置 */
    processChange(val, index, row) {
      console.log(val);
      console.log(index);
      console.log(row);
      console.log(this.profFrom);
      let currentIndex = this.profFrom.findIndex(item => {
        return item.name == val;
      });
      console.log(currentIndex);
      if (currentIndex != -1) {
        this.$set(
          this.tableData[index],
          "profDesc",
          this.profFrom[currentIndex].profDesc
        );
      }
    },
    /* 清空流程配置 连带描述清空 */
    processClear(index) {
      this.$set(this.tableData[index], "profDesc", "");
      //console.log(this.tableData);
    },
    saveData() {
      saveConfig(this.tableData).then(response => {
        console.log(response, "保存流程");
        this.$message({
          message: "保存成功",
          type: "success"
        });

        this.getDetail();
      });
    }
  },
  mounted() {
    this.getBtnProfCode();
  }
};
</script>
<style lang="scss" scoped>
.panel-padding {
  padding: 0 10px;
}
.header-btn {
  height: 50px;
  line-height: 50px;
}
/deep/ .el-table {
  color: #000;
}
/deep/ .el-table__header .cell {
  color: #000;
}
</style>
