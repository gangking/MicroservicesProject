<template>
  <div class="profiles">
    <div class="title">
      <div class="redblock"></div>
      <p>配置文件定义</p>
    </div>
    <div class="btnBox">
      <el-button type="primary" class="elbtn" plain @click="dialogVisible">+增加</el-button>

      <!-- <el-button type="danger" class="elbtn" plain @click="markDelete()">标记删除</el-button> -->
      <!-- @click="deleteRow()" -->
      <el-button type="text" @click="open">
        <el-button type="danger" class="elbtn" plain>删除</el-button>
      </el-button>
      <el-button type="success" class="elbtn" plain @click="copyRow()">复制</el-button>

      <el-select
        v-model="val"
        filterable
        placeholder="请选择"
        @change="getSelVal"
        clearable
        @clear="reloadTable()"
      >
        <el-option
          v-for="(item,index) in inputSelData"
          :key="index"
          :label="item.bsDescribe"
          :value="item.bsKey"
        ></el-option>
      </el-select>

      <!-- <el-button type="success" class="elbtn" plain @click="reloadTable()">重置</el-button> -->
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        :border="true"
        height="100%"
        :header-cell-style="{color:'#000'}"
        v-loading="loading"
        element-loading-text="正在加载, 请稍后..."
        :highlight-current-row="true"
        @selection-change="getRow"
        @row-click="getRowId"
      >
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <!-- <el-table-column prop="bsCode" label="业务场景" sortable width="150"></el-table-column> -->
        <!-- <el-table-column prop="bsDescribe" label="业务场景描述" sortable></el-table-column> -->
        <!-- <el-table-column prop="bsiCode" label="业务情形编码" sortable></el-table-column>
        <el-table-column prop="bsiDescribe" label="业务情形描述" sortable></el-table-column>-->
        <el-table-column prop="configCode" label="配置文件ID" sortable width="130"></el-table-column>
        <el-table-column prop="configDescribe" label="配置文件描述" sortable></el-table-column>
      </el-table>
      <!-- <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="50"
      ></el-pagination>-->
    </div>
    <addInfo
      :msg.sync="parentMsg"
      :tableInfo="selData"
      :visible="dialogTableVisible"
      :dialogVisible="dialogTableVisible"
      @handleClose="handleClose"
      @getAllData="getAllData"
    ></addInfo>
    <copyInfo
      :msg.sync="parentMsg"
      :tableInfo="form"
      :visible="copydialogTableVisible"
      :copydialogTableVisible="copydialogTableVisible"
      @handleClose="handleClose"
      @getAllData="getAllData"
    ></copyInfo>
  </div>
</template>

<script>
import addInfo from "./addInfo";
import copyInfo from "./copyInfo";
import request from "@/utils/request";
import { SYSTEM_URL } from "@/api/baseUrl";
import { BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  mounted() {
    this.getData();
  },
  data() {
    return {
      parentMsg: "test",
      dialogTableVisible: false,
      copydialogTableVisible: false,
      value: "",
      val: "",
      tableData: [],
      inputSelData: [],
      selData: [],
      selectData: [],
      selectDataOld: [],
      loading: false,
      multipleSelection: [],
      name: "",
      busDes: "",
      conId: "",
      conDes: "",
      currentPage4: 4,
      treeInfo: [],
      selDefInfo: [],
      inputInfo: "",
      form: {},
      isSave: false
    };
  },
  methods: {
    open() {
      this.$confirm("此操作将永久删除该配置文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.deleteRow();
        })
        .catch(() => {});
    },
    getAllData() {
      this.getData();
    },
    getData() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/bsConfigFile/queryPageList",
        method: "post",
        data: {
          parameters: [
            {
              key: "Q^STATUS_^SL",
              value: "1"
            }
          ],
          requestPage: {
            limit: 1000,
            pageNo: 1
          },
          sorts: [
            {
              field: "ID_",
              order: "desc"
            }
          ]
        }
      }).then(response => {
        this.tableData = response.data.dataResult;
        // 去重
        let data = response.data.dataResult;
        let obj = {};
        this.inputSelData = data.reduce((cur, next) => {
          if (!obj[next.bsDescribe]) {
            obj[next.bsDescribe] = true;
            cur.push(next);
          }
          return cur;
        }, []);
        console.log("tableData", this.tableData);
      });
    },
    getRow(val) {
      this.multipleSelection = val;
      console.log("multipleSelection", this.multipleSelection);
    },

    dialogVisible() {
      this.dialogTableVisible = true;
    },
    handleClose() {
      this.dialogTableVisible = false;
      this.copydialogTableVisible = false;
    },
    deleteRow() {
      let val = this.multipleSelection;
      val.forEach((value, index) => {
        return request({
          baseURL: BASE_GATEWAY_API,
          url: "/bsConfigFile/delete",
          method: "post",
          data: [
            {
              id: value.id,
              configCode: value.configCode
            }
          ]
        }).then(response => {
          if (response.cause != "") {
            this.$message({
              message: response.cause,
              type: "warning"
            });
            return false;
          }
          this.$message({
            message: "删除成功 !",
            type: "success"
          });
          this.getData();
          this.$emit("getTreeInfo", []);
        });
      });
      this.$refs.multipleTable.clearSelection();
    },
    copyRow() {
      if (this.multipleSelection.length == 1) {
        const {
          bsCode,
          bsDescribe,
          configCode,
          configDescribe,
          bsKey,
          status
        } = this.multipleSelection[0];
        this.form = {
          id: "",
          bsCode,
          bsDescribe,
          configCode,
          configDescribe,
          bsKey,
          status
        };
        this.copydialogTableVisible = true;
      } else {
        this.$message.error("请选择一条数据复制");
      }
    },
    reloadTable() {
      this.val = "";
      this.getData();
    },
    markDelete() {
      let val = this.multipleSelection;
      val.forEach((value, index) => {
        return request({
          baseURL: BASE_GATEWAY_API,
          url: "/bsConfigFile/markDelete",
          method: "post",
          data: [
            {
              id: value.id,
              status: "0",
              configCode: value.configCode
            }
          ]
        }).then(response => {
          if (response.cause != "") {
            this.$message({
              message: response.cause,
              type: "warning"
            });
            return false;
          }
          this.$message({
            message: "删除成功 !",
            type: "success"
          });
          this.getData();
          this.$emit("getTreeInfo", []);
        });
      });
      //清除选中状态
      this.$refs.multipleTable.clearSelection();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    getSelVal(val) {
      console.log("11111", val);

      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/bsConfigFile/queryPageList",
        method: "post",
        data: {
          parameters: [
            {
              key: "Q^STATUS_^S",
              value: "1"
            },
            {
              key: "Q^BS_KEY_^S",
              value: val
            }
          ],
          requestPage: {
            limit: 0,
            pageNo: 20
          },
          sorts: [
            {
              field: "ID_",
              order: "1"
            }
          ]
        }
      }).then(response => {
        this.tableData = [];
        this.tableData = response.data.dataResult;
        // console.log("tableData", this.tableData);
      });
    },
    getRowId(row) {
      console.log("row", row);

      this.loading = true;
      this.selectData = row;
      this.isSave = true;
      if (this.selectDataOld != this.selectData) {
        this.selectDataOld = this.selectData;
      } else {
        this.loading = false;
        return false;
      }

      // 遍历所有树状结构,如果有不一样再提示保存
      // if(){
      // if (this.isSave) {
      //   this.$alert("请先保存!", {
      //     confirmButtonText: "确定"
      //   });
      //   return false;
      // }
      // }
      this.getTreeInfo();
      this.$emit("getSelInfo", row);
      this.$emit("getLoading", true);
    },
    getTreeInfo() {
      return request({
        // baseURL: "http://192.168.30.26:5100/ibps",
        baseURL: BASE_GATEWAY_API,
        url: "/permissionConfig/queryList",
        method: "post",
        data: {
          bsKey: this.selectData.bsKey,
          // defId: this.selectData.defId,
          // nodeId: "",
          configFileId: this.selectData.configCode
        }
      })
        .then(response => {
          console.log("treeinfo", response);
          this.treeInfo = response.data.firstList;
          this.selDefInfo = response.data.secList;
          this.$emit("getTreeInfo", this.treeInfo);
          this.$emit("getSelDefInfo", this.selDefInfo);
          response.data.secList.forEach(item => {
            if (item.by2 == true) {
              this.inputInfo = item.bizName;
            } else {
              this.input = "";
            }
          });
          this.$emit("getInputInfo", this.inputInfo);
          this.loading = false;
          this.$emit("getLoading", false);
          this.isSave = false;
          // 递归查询树的radio值
          // let id=[]
          // if (response.data.firstList.nodes != null) {
          //   function recursion(appid) {
          //     for (let i = 0; i < appid.length; i++) {
          //       id.push(appid[i].key);
          //       const childs = appid[i].nodes;
          //       if (childs && childs.length != null) {
          //         recursion(childs);
          //       }
          //     }
          //   }
          //   recursion(val.nodes);
          //   this.appIds = id.filter(key => key).toString();
          // } else {
          //   this.appIds = val.key;
          // }
        })
        .catch(res => {
          this.$emit("getTreeInfo", []);
          this.loading = false;
          this.$emit("getLoading", false);
        });
    }
  },
  components: {
    addInfo,
    copyInfo
  },
  props: {}
};
</script>

<style lang="scss" scoped>
.profiles {
  width: 100%;
  height: 100%;
  .title {
    position: relative;
    top: -8px;
    height: 26px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
    border-bottom: 2px solid #ccc;
    .redblock {
      position: absolute;
      top: 1px;
      display: inline-block;
      width: 5px;
      height: 17px;
      background-color: #e61a23;
    }
    p {
      position: absolute;
      left: 15px;
      top: 0px;
      height: 18px;
      line-height: 20px;
      margin: 0;
      width: 200px;
    }
  }
  .btnBox {
    width: 550px;
    position: static;
    height: auto;
    margin: 0;
    padding: 0;
    margin-top: -12px;
    .el-select {
      margin-left: 5px;
      width: 200px;
    }
    .elbtn {
      // margin: 0 5px;
      padding: 8px 15px !important;
    }
    .selSearch {
      margin-top: 10px;
    }
  }
  .table {
    margin-top: -2px;
    height: 88%;
  }
}
</style>