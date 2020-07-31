<template>
  <div class="tree">
    <div class="title">
      <div class="redblock"></div>
      <el-button class="btnPzmode" size="mini" type="primary" plain>
        <i class="iconfont icon-uniE0411"></i>
        凭证模拟
        </el-button>
      <el-button type="danger" size="mini" plain>
        <i class="iconfont icon-uniE1BB"></i>
        生成凭证
        </el-button>
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
      <el-table-column prop="name" label="会计凭证"></el-table-column>
      <el-table-column prop="key" label="" width="50" align="center">
        <template slot-scope="scope">
          <span class="jump" v-show="scope.row.key!=null?true:false" @click="detailvisible(scope.row)">
            <i class="iconfont icon-uniE1AC iconbtn" />
          </span>
          <!-- <span class="jump" v-show="scope.row.key!=null?true:false" @click="detailvisible(scope.row)">
            <i class="iconfont icon-uniE1AB iconbtn" />
          </span> -->
        </template>
      </el-table-column>
    </el-table>
   
  </div>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API, COMP_URL } from "@/api/baseUrl";

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
      this.treeInfo = [{"id":"1000","parentId":null,"type":"BUKRS","key":"1000","name":"1000","simStatus":null,"postStatus":null,"nodes":[{"id":"1000201908","parentId":"1000","type":"PERIO","key":"201908","name":"2019-08","simStatus":null,"postStatus":null,"nodes":[{"id":"1000201908BT01","parentId":"1000201908","type":"MLBT","key":"BT01","name":"商旅预定","simStatus":null,"postStatus":null,"nodes":[{"id":"642017999141732352","parentId":"1000201908BT01","type":"ACCL","key":"642017999141732352","name":"001","simStatus":"01","postStatus":"00","nodes":null},{"id":"638824896805208064","parentId":"1000201908BT01","type":"ACCL","key":"638824896805208064","name":"002","simStatus":"01","postStatus":"00","nodes":null}]}]}]},{"id":"2000","parentId":null,"type":"BUKRS","key":"2000","name":"2000","simStatus":null,"postStatus":null,"nodes":[{"id":"2000201908","parentId":"2000","type":"PERIO","key":"201908","name":"2019-08","simStatus":null,"postStatus":null,"nodes":[{"id":"2000201908BT02","parentId":"2000201908","type":"MLBT","key":"BT02","name":"商旅报销","simStatus":null,"postStatus":null,"nodes":[{"id":"642017999141111111","parentId":"2000201908BT02","type":"ACCL","key":"642017999141111111","name":"001","simStatus":"02","postStatus":"01","nodes":null}]}]},{"id":"2000201909","parentId":"2000","type":"PERIO","key":"201909","name":"2019-09","simStatus":null,"postStatus":null,"nodes":[{"id":"2000201909BT02","parentId":"2000201909","type":"MLBT","key":"BT02","name":"商旅报销","simStatus":null,"postStatus":null,"nodes":[{"id":"642017999141222222","parentId":"2000201909BT02","type":"ACCL","key":"642017999141222222","name":"001","simStatus":"02","postStatus":"01","nodes":null}]}]}]}]
      
      // return request({
      //   baseURL: BASE_GATEWAY_API,
      //   url: COMP_URL + "/scene/v3/bpmBsRel/buildBsaTree?type=TTT",
      //   method: "get",
      //   data: {}
      // }).then(res => {
      //   this.treeInfo = res.data;
      //   //  console.log("getTreeInfo", res);
      // });
      this.getIcon(this.treeInfo)
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
        this.getIcon(val.simStatus,val.postStatus)
      } else {
        this.appIds = val.key;
      }
      console.log("appIds", this.appIds);
      this.$emit("getKey", this.appIds);
    },
    getIcon(sim,sap){
      console.log(``,sim,sap);
      var icon = 'iconfont icon-'
      var txtColr = ""
      var title = ""
      switch (sim) {
        case '00':
            icon += 'uniE252'
            txtColr = '#000'
            title = '未模拟'
            break
        case '01':
            icon += 'uniE1AE'
            txtColr = '#E78C07'
            title = '模拟报错'
            break
        case '02':
            icon += 'uniE1AB'
            txtColr = '#2b7D2B'
            
            title = '模拟成功'
            break
        case '04':
            icon += 'uniE1AC'
            txtColr = '#BB0000'
            title = '已冲销'
            break
      }
    },
    getIconSap(sim,sap){
      console.log(``,sim,sap);
      var icon = 'iconfont icon-'
      var txtColr = ""
      var title = ""
      switch (sap) {
        case '00':
            icon += 'uniE019'
            txtColr = '#000'
            title = '未模拟'
            break
        case '01':
            icon += 'uniE1AE'
            txtColr = '#E78C07'
            title = '模拟报错'
            break
        case '02':
            icon += 'uniE1AB'
            txtColr = '#2b7D2B'
            title = '模拟成功'
            break
        case '04':
            icon += 'uniE1AC'
            txtColr = '#BB0000'
            title = '已冲销'
            break
      }
    }

  },
  created() {
    this.getTreeInfo();
  }
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
      left: 20px;
      top: 6px;
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
  .iconbtn2{
    color:#ff4040 
  }
  .btnPzmode{
    margin-left: 10px;
    margin-top: 3px;
  }
 
}
</style>