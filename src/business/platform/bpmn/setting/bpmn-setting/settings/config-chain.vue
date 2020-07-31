<template>
  <div class="panel-padding panel-body">
    <el-table border :data="tableData" style="width: 100%">
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
      <el-table-column label="业务场景配置文件Id">
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
      <el-table-column label="流程配置文件ID">
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
export default {
  data() {
    return {
      chainNode: "", //最外层结构
      assignPoList: [], // 表单数据
      defId: "", //当前的defid 最外层
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
        // {
        //   bsCode: "BS0002",
        //   bsDescribe: "场景描述1111",
        //   disProfCode: "",
        //   configDescribe: "文件描述",
        //   btnProfCode: "",
        //   profDesc: "",
        //   bingFrom: []
        // },
        // {
        //   bsCode: "BS0003",
        //   bsDescribe: "场景描述22222",
        //   disProfCode: "",
        //   configDescribe: "文件描述",
        //   btnProfCode: "",
        //   profDesc: "",
        //   bingFrom: []
        // }
      ]
    };
  },
  props: {
    nodeId: {
      type: String,
      default: ""
    },
    userTaskData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    nodeId: {
      handler(val, oldVal) {
        setTimeout(() => {
          console.log("nodeId", val);
          console.log("userTaskData", this.userTaskData);
          this.tableData = [];
          console.log("清空数组", this.tableData);

          this.userTaskData.forEach(item => {
            if (item.nodeId === this.nodeId) {
              this.tableData.push(item);
              // this.$set(this.tableData[index], "bingFrom", []);
            }
          });
          console.log("this.tableData", this.tableData);
          // this.tableData.forEach((item, index) => {
          //   this.$set(this.tableData[index], "bingFrom", []);
          // });


        }, 1000);

        // this.assignPoList = this.chainNode.assignPoList;
        // this.defId = this.userTaskData.defId;

        // console.log(this.assignPoList);
        // this.assignPoList.forEach((item, index) => {
        //   this.tableData.push(item);
        //   this.$set(this.tableData[index], "bingFrom", []);
        //   this.tableData[index].nodeId = this.nodeId;
        // });

        //console.log(this.tableData);
      },
      immediate: true
    },
    tableData: {
      handler(val, oldVal) {
        console.log("监测tableData的值", val);
       // this.$emit("splicingForm", this.nodeId, this.tableData);
        console.log("tableData", this.tableData);
      },
      deep: true
    }
  },
  methods: {
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
</style>
