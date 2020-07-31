<template>
  <div class="tree">
    <div class="title">
      <div class="redblock"></div>
      <p>配置文件赋值</p>
    </div>
    <div class="setDef">
      <div class="left">
        <div class="text">默认显示:</div>
        <el-input placeholder="请在保存后选择" v-model="this.input" :disabled="true"></el-input>
      </div>
      <div class="right">
        <el-button type="success" class="elbtn" plain @click="saveStree">保存</el-button>
      </div>
    </div>
    <div class="tree">
      <el-table
        :data="TreeInfo"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        height="100%"
        border
        :header-cell-style="{color:'#000'}"
        v-loading="loading"
        @row-click="getRowId"
        element-loading-text="正在加载, 请稍后..."
        :tree-props="{children: 'permissionConfigPoList'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="bizName" label="Description Hierarchy" width="260"></el-table-column>
        <!-- 宽度335 -->
        <el-table-column label="PC端显示状态规则" align="left">
          <template slot-scope="scope">
            <!-- <div>选择的是:{{scope.row.radio}}按钮</div> -->
            <el-radio-group v-model="scope.row.radio" @change="changeRadio" align="left">
              <el-radio label="hide" v-show="scope.row.hide">隐藏</el-radio>
              <el-radio label="display" v-show="scope.row.display">显示</el-radio>
              <el-radio label="edit" v-show="scope.row.edit">编辑</el-radio>
              <el-radio label="required" v-show="scope.row.required">必填</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>

        <!-- 移动端 -->
        <el-table-column label="移动端显示状态规则" align="left">
          <template slot-scope="scope">
            <!-- <div>选择的是:{{scope.row.radio}}按钮</div> -->
            <el-radio-group v-model="scope.row.moveRadio" @change="changeRadio" align="left">
              <el-radio label="hide" v-show="scope.row.moveHide">隐藏</el-radio>
              <el-radio label="display" v-show="scope.row.moveDisplay">显示</el-radio>
              <el-radio label="edit" v-show="scope.row.moveEdit">编辑</el-radio>
              <el-radio label="required" v-show="scope.row.moveRequired">必填</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="initialDisplay" label="是否默认初始显示" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.by2"
              @change="handleEdit(scope.$index, scope.row)"
              v-show="scope.row.initialDisplay"
            ></el-checkbox>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <seldef
      :msg.sync="parentMsg"
      :visible="dialogTableVisible"
      :dialogVisible="dialogTableVisible"
      :inpdef="inputSelDef"
      :treeIn="this.getTreeInfo"
      @handleClose="handleClose"
    ></seldef>
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
      TreeInfo: [],
      input: "",
      parentMsg: "test",
      dialogTableVisible: false,
      // inputdef: [],
      rowId: "",
      inputSelDef: [],
      upadateData: {},
      loading: false
    };
  },
  methods: {
    getRowId(row) {
      console.log("row", row);
    },
    handleEdit(index, row) {
      this.rouId = row.id;
    },
    handleClose(val1, val2) {
      this.dialogTableVisible = false;
      this.input = val2;
    },
    changeRadio(value) {
      console.log("radio", value);
    },
    saveStree() {
      this.upadateData.firstList = this.getTreeInfo;
      console.log("this.getTreeInfo", this.getTreeInfo);
      this.upadateData.secList = this.getSelDefInfo;

      return request({
        // baseURL: "http://192.168.30.26:5100/ibps",
        baseURL: BASE_GATEWAY_API,
        url: "/permissionConfig/batchUpdate",
        method: "post",
        data: this.upadateData
      }).then(response => {
        console.log("saveStree", response);

        // if (response.state != 200) {
        //   this.$message({
        //     message: "保存失败 !",
        //     type: "warning"
        //   });
        //   return false;
        // }
        // this.$message({
        //   message: "保存成功 !",
        //   type: "success"
        // });

        this.reGetTreeInfo();
      });
    },
    reGetTreeInfo() {
      return request({
        // baseURL: "http://192.168.30.26:5100/ibps",
        baseURL: BASE_GATEWAY_API,
        url: "/permissionConfig/queryList",
        method: "post",
        data: {
          bsKey: this.getSelectInfo.bsKey,
          // defId: this.getSelectInfo.defId,
          nodeId: "",
          configFileId: this.getSelectInfo.configCode
        }
      })
        .then(response => {
          console.log("reGetTreeInfo", response);

          this.inputSelDef = [];
          response.data.secList.forEach(item => {
            if (item.radio != "hide") {
              this.inputSelDef.push(item);
            }
          });
          this.dialogTableVisible = true;
        })
        .catch(res => {});
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
    getInputInfo: {
      type: String
    },
    getLoadingInfo: {
      type: Boolean
    }
  },
  watch: {
    getTreeInfo: {
      handler: function(val) {
        this.TreeInfo = val;
      },
      immediate: true
    },
    getInputInfo: {
      handler: function(val) {
        this.input = val;
      },
      immediate: true
    },
    getLoadingInfo: {
      handler: function(val) {
        console.log("getLoadingInfo", val);
        this.loading = val;
      },
      immediate: true
    },
    getSelDefInfo: {
      handler: function(val) {},
      immediate: true
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.tree {
  width: 100%;
  height: 93.5%;
  .title {
    position: relative;
    top: -8px;
    height: 26px;
    font-size: 16px;
    font-weight: 700;
    // margin-bottom: 4px;
    border-bottom: 2px solid #ccc;
    background-color: #fff;
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
      top: 0;
      height: 18px;
      line-height: 18px;
      margin: 0;
      width: 200px;
    }
  }
  .setDef {
    position: relative;
    height: 33px;
    margin-bottom: 8px;
    background: #fff;
    .left {
      width: 600px;
      .el-input {
        width: 400px !important;
      }
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
    .right {
      position: absolute;
      top: 0;
      right: 10px;
      .elbtn {
        padding: 8px 15px !important;
      }
    }
  }
}
/deep/ .el-radio:nth-child(n + 3) {
  margin-top: 6px;
}
</style>