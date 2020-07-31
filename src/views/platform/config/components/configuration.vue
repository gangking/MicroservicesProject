<template>
  <div class="tree">
    <div class="title">
      <div class="redblock"></div>
      <p>配置文件赋值</p>
    </div>
    <div class="setDef">
      <div class="right">
        <el-button size="mini" type="success" class="elbtn" plain @click="saveConfig">保存</el-button>
      </div>
    </div>
    <div class="treeTable">
      <el-table
        :data="tableData"
        style="width: 100%;"
        height="100%"
        border
        default-expand-all
      >
        <el-table-column prop="buttonName" label="流程按钮" align="center"></el-table-column>
        <el-table-column label="开启状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#DCDFE6"
              @change="switchChange"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="statusId" label="单据状态" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.statusId" clearable placeholder="请选择">
              <el-option
                v-for="item in inputInfo"
                :key="item.STATUS_ID_"
                :label="item.STATUS_DESC_"
                :value="item.STATUS_ID_"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.$index===0"
              @click="moveUp(scope.$index,scope.row)"
            >
              <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button
              size="mini"
              :disabled="scope.$index===(tableData.length-1)"
              @click="moveDown(scope.$index,scope.row)"
            >
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import { SYSTEM_URL } from "@/api/baseUrl";
import { BASE_GATEWAY_API } from "@/api/baseUrl";
import seldef from "./selectdefault";
export default {
  data() {
    return {
      SelectInfo: {},
      inputInfo: [],
      tableData: [],
      parentMsg: "test",
      dialogTableVisible: false,
      rowId: "",
      inputSelDef: [],
      upadateData: {},
      upDateInfo: [],
      profCode: {}
    };
  },
  methods: {
    handleEdit(index, row) {
      this.rouId = row.id;
      console.log("row", row);
    },
    handleClose(val1, val2) {
      this.dialogTableVisible = false;
      this.input = val2;
    },
    changeRadio(value) {
      console.log("选择的是:", value);
      // this.getTreeInfo.radio=value
    },
    saveConfig() {
      let upInfo = {};
      this.upDateInfo = [];

      for (var item of this.tableData) {
        if ((item.status == true) & (item.statusId == "")) {
          this.$message.error("请选择开启按钮的单据状态");
          return;
        } else if (item.statusId != "") {
          const {
            buttonCode,
            buttonName,
            profCode,
            sn,
            statusId,
            status
          } = item;
          upInfo = {
            buttonCode,
            buttonName,
            id: "",
            profCode: this.profCode.profCode,
            sn,
            statusId,
            status
          };
          this.upDateInfo.push(upInfo);
        } else if (this.upDateInfo == "") {
          this.upDateInfo.push(this.profCode);
        }
      }
      console.log("upDateInfo", this.upDateInfo);

      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/pzwjfz/save",
        method: "post",
        data: this.upDateInfo
      }).then(response => {
        this.$message({
          message: "保存成功 !",
          type: "success"
        });
      });
    },

    // getInpInfo() {
    //   this.input = this.getInputInfo;
    // },
    switchChange(val) {
      console.log("switchChange", val);
    },

    moveUp(index, row) {
      var that = this;
      // console.log("上移", index, row);
      // console.log(that.tableData[index]);
      if (index > 0) {
        let upDate = that.tableData[index - 1];
        that.tableData.splice(index - 1, 1);
        that.tableData.splice(index, 0, upDate);
      } else {
        alert("已经是第一条，不可上移");
      }
    },

    moveDown(index, row) {
      var that = this;
      // console.log("下移", index, row);
      if (index + 1 === that.tableData.length) {
        alert("已经是最后一条，不可下移");
      } else {
        // console.log(index);
        let downDate = that.tableData[index + 1];
        that.tableData.splice(index + 1, 1);
        that.tableData.splice(index, 0, downDate);
      }
    }
  },
  components: {
    seldef
  },
  props: {
    getSelectInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    getTreeInfo: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    getSelDefInfo: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    getselectData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    getInputInfo: {
      type: String
    }
  },
  watch: {
    getTreeInfo: {
      handler: function(val) {
        this.tableData = val;
        console.log("tableData", this.tableData);
      },
      immediate: true
    },
    getselectData: {
      handler: function(val) {
        this.profCode.profCode = val.profCode;
        console.log("profCode", this.profCode);
      },
      immediate: true
    },
    getInputInfo: {
      handler: function(val) {
        this.input = val;
      },
      immediate: true
    },
    getSelDefInfo: {
      handler: function(val) {
        this.inputInfo = val;
        console.log("inputInfo", this.inputInfo);
      },
      immediate: true
    }
  },
  created() {
    // this.getInpInfo();
  }
};
</script>

<style lang="scss" scoped>
.tree {
  width: 100%;
  height: 100%;
  .title {
    position: relative;
    height: 30px;
    top: 0;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    .redblock {
      position: absolute;
      top: 2px;
      display: inline-block;
      width: 5px;
      height: 17px;
      background-color: #e61a23;
    }
    p {
      position: absolute;
      left: 15px;
      top: 0;
      height: 18px;
      line-height: 18px;
      margin: 0;
    }
  }
  .setDef {
    position: relative;
    height: 55px;
    padding: 10px 0;
    box-sizing: border-box;
    text-align: right;
    .text {
      display: inline-block;
      margin-left: 10px;
      margin-right: 20px;
      font-size: 14px;
      font-weight: 550;
      color: #909399;
    }
    /deep/ .el-input {
      width: 200px;
    }
  }
  .treeTable {
    height: calc(100% - 55px - 30px);
  }
}
</style>