<template>
  <div class="tree">
    <div class="title">
      <div class="redblock"></div>
      <p>我的发起流程</p>
    </div>
    <el-table
      :data="treeInfo"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      height="90%"
      border
      default-expand-all
      :header-cell-style="{color:'#000'}"
      :highlight-current-row="true"
      @row-click="getRowId"
      :tree-props="{children: 'nodes'}"
    >
      <el-table-column prop="name" label="业务场景应用树"></el-table-column>
      <el-table-column prop="key" label="发起" width="50" align="center">
        <template slot-scope="scope">
          <span class="jump" v-show="scope.row.key!=null?true:false" @click="detailvisible(scope.row)">
            <i class="iconfont icon-uniE24E iconbtn" />
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <detail
      :visible="dialogTableVisible"
      :dialog-visible="dialogTableVisible"
      :get-params="params"
      @handleClose="handleClose"
    /> -->
  </div>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API, COMP_URL } from "@/api/baseUrl";
// import detail from "./table/detail";
export default {
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  data() {
    return {
      treeInfo: [],
      appIds: "",
      dialogTableVisible: false,
      params: {}
    };
  },
  methods: {
    detailvisible(row) {
      // console.log("detailvisible9999-------9", row);
      const { key:appId } = row;
       this.ibpsPayable.setPayableParams({
        appId,
        status:"submitterProcess"
      })
      this.dialogTableVisible = true;
      // console.log("params", this.params);
    },
    handleClose() {
      this.dialogTableVisible = false;
    },
    getTreeInfo() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/scene/v3/bpmBsRel/buildBsaTree?type=TTT",
        method: "get",
        data: {}
      }).then(res => {
        this.treeInfo = res.data;
        //  console.log("getTreeInfo", res);
      });
    },
    getRowId(val) {
      // console.log("getRowId", val);
      let id = [];
      // 递归查询树
      if (val.nodes != null) {
        function recursion(appid) {
          for (let i = 0; i < appid.length; i++) {
            id.push(appid[i].key);
            const childs = appid[i].nodes;
            if (childs && childs.length != null) {
              recursion(childs);
            }
          }
        }
        recursion(val.nodes);
        this.appIds = id.filter(key => key).toString();
      } else {
        this.appIds = val.key;
      }
      // console.log("appIds", this.appIds);
      this.$emit("getKey", this.appIds);
    }
  },
  created() {
    this.getTreeInfo();
  },
};
</script>

<style lang="scss" scoped>
.tree {
  height: 100%;
  .title {
    position: relative;
    height: 38px;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
    border-bottom: 2px solid #ccc;
    .redblock {
      position: absolute;
      top: 8px;
      display: inline-block;
      width: 5px;
      height: 17px;
      background-color: #e61a23;
    }
    p {
      position: absolute;
      height: 100%;
      left: 20px;
      top: 0;
      line-height: 35px;
      margin: 0;
      width: 150px;
    }
  }
  .jump {
    cursor: pointer;
    font-size: 16px;
  }
  .iconbtn{
    color:#409eff 
  }
}
</style>