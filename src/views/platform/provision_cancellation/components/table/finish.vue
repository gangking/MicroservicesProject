<template>
  <div class="tab">
    <div class="btn">
      <!-- <el-button size="mini" plain type="danger" class="elbtn" @click="revocation">
        <i class="iconfont icon-uniE1E0 iconbtn" />
        撤回
      </el-button>-->
      <el-button size="mini" plain type="primary" class="elbtn" @click="copydata">
        <i class="iconfont icon-uniE07E iconbtn" />
        <span class="icontext">生成</span>
      </el-button>
      <div class="rightbtn">
        <el-dialog
          placement="left-start"
          :visible.sync="visible"
          class="selectBox"
          :close-on-click-modal="false"
          :show-close="false"
          :modal="false"
          :append-to-body="true"
          @open="openSel"
          width="40%"
          top="15vh"
        >
          <el-form ref="form" :model="selecForm" label-width="100px">
            <el-form-item label="单据号码:">
              <el-input v-model="selecForm.docNumber"></el-input>
            </el-form-item>
            <el-form-item label="公司代码:">
              <el-input v-model="selecForm.bukrs"></el-input>
            </el-form-item>
            <el-form-item label="发起人:">
              <el-input v-model="selecForm.originator"></el-input>
            </el-form-item>
            <el-form-item label="发起时间:">
              <el-date-picker
                v-model="selectime"
                type="datetimerange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                @change="pickTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="margin5"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="单据状态:">
              <el-select
                v-model="selecForm.doStatus"
                filterable
                placeholder="请选择"
                @change="getSelectVal"
                clearable
              >
                <el-option
                  v-for="(item,index) in select"
                  :key="index"
                  :label="item.STATUS_DESC_"
                  :value="item.STATUS_ID_"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门:">
              <el-input v-model="selecForm.markDepatMent"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="confirm">保存</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-button @click="visiblebtn" plain class="elbtn filter">
          <el-badge :is-dot="dot">
            <i class="iconfont icon-uniE0561 iconbtn filbtn" />
          </el-badge>
        </el-button>
        <el-button is-dot class="elbtn filter othbtn" plain @click="reLoad">
          <i class="iconfont icon-uniE248 iconbtn filbtn" />
        </el-button>
        <el-button class="elbtn filter othbtn" plain @click="confirm">
          <i class="iconfont icon-uniE00A1 iconbtn filbtn" />
        </el-button>
      </div>
    </div>
    <div class="datatable">
      <el-table
        :data="tableData"
        height="100%"
        v-loading="loading"
        element-loading-background="rgba(250, 250, 250, 0.5)"
        :header-cell-style="{color:'#000'}"
        style="width: 100%"
        :default-sort="{prop: 'startTime', order: 'descending'}"
        @selection-change="getRow"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column label="单据号码" prop="docNumber" sortable width="180" align="center">
          <template slot-scope="scope">
            <p class="subject" @click="detailvisible(scope.row)">{{ scope.row.docNumber }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="amoNumber" label="台账号码" sortable align="center" />
        <el-table-column prop="bukrs" label="公司代码" sortable align="center" />
        <el-table-column prop="userno" label="提单人工号" sortable width="110" />
        <el-table-column prop="username" label="提单人姓名" sortable width="110" />
        <el-table-column prop="amoSumWrbtr" label="摊销总额" sortable align="center" />
        <el-table-column prop="amoAlWrbtr" label="已摊金额" sortable align="center" />
        <el-table-column prop="amoReWrbtr" label="待摊金额" sortable header-align="center" />
        <el-table-column
          prop="monthSumWrbtr"
          label="本月待摊金额"
          sortable
          header-align="center"
          width="130"
        />
        <el-table-column prop="amoMontBe" label="摊销起始时间" sortable align="center" width="130" />
        <el-table-column prop="amoMontEn" label="摊销结束时间" sortable align="center" width="130" />

        <!-- 折叠框 -->
        <!-- <el-table-column type="expand" label="更多" width="45">
          <template slot-scope="props">
            <el-form label-position="center" inline class="demo-table-expand">
              <el-form-item label="业务情形">
                <span>{{ props.row.bsiDesc }}</span>
              </el-form-item>
              <el-form-item label="当前节点">
                <span>{{ props.row.curNode }}</span>
              </el-form-item>
              <el-form-item label="公司名称">
                <span>{{ props.row.buTxt }}</span>
              </el-form-item>
              <el-form-item label="部门编号">
                <span>{{ props.row.orgId }}</span>
              </el-form-item>
              <el-form-item label="部门">
                <span>{{ props.row.markDepatMent }}</span>
              </el-form-item>
              <el-form-item label="隶属单位">
                <span>{{ props.row.orgAscripTion }}</span>
              </el-form-item>
              <el-form-item label="组织层级">
                <span>{{ props.row.orgHierarchy }}</span>
              </el-form-item>
              <el-form-item label="所属人">
                <span>{{ props.row.ownerName }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="foot">
      <el-pagination
        :current-page.sync="currentpage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="pageAll.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, COMP_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
import detail from "./detail";
export default {
  components: {
    detail
  },
  props: {
    finidata: {
      type: Array,
      default: () => {
        return [];
      }
    },
    fininum: {
      type: Object,
      default: () => {
        return {};
      }
    },
    appId: {
      type: String
    },
    load: {
      type: Boolean
    }
  },
  data() {
    return {
      total: "",
      copyArr: [],
      tableData: [],
      taskIds: [],
      currentpage: 1,
      dialogTableVisible: false,
      params: {},
      visible: false,
      delIds: [],
      selecForm: {
        docNumber: "",
        bukrs: "",
        originator: "",
        startTime: "",
        endTime: "",
        doStatus: "",
        markDepatMent: ""
      },
      select: [],
      selectime: "",
      pageAll: {},
      loading: false,
      dot: false,
      appIdArr: []
    };
  },
  // provide() {
  //   return {
  //     outerSkin: this
  //   };
  // },
  watch: {
    finidata: {
      handler: function(val, oldVal) {
        this.tableData = [];
        this.tableData = val;
      },
      immediate: true
    },
    fininum: {
      handler: function(val, oldVal) {
        this.pageAll = val;
      },
      immediate: true,
      deep: true
    },
    load: {
      handler: function(val, oldVal) {
        this.loading = val;
      },
      immediate: true
    },
    appId: {
      handler: function(val, oldVal) {
        if (val) {
          this.appIdArr = val.split(",");
        } else {
          this.appIdArr = [];
        }
      },
      immediate: true
    }
  },
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  methods: {
    visiblebtn() {
      this.visible = true;
    },
    pickTime(val) {
      console.log("pickTime", val);
      console.log("selectime", this.selectime);
      this.selecForm.startTime = val ? val[0] : "";
      this.selecForm.endTime = val ? val[1] : "";
    },
    openSel() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/pzwjfz/finfListDoc",
        method: "get"
      }).then(res => {
        console.log("openSel", res);
        this.select = res.data;
      });
    },
    reLoad() {
      this.dot = false;
      Object.keys(this.selecForm).forEach(key => (this.selecForm[key] = ""));
      this.selectime = "";
      this.currentpage = 1;
      console.log("selecForm", this.selecForm);
      this.$emit("reLoad");
    },
    getSelectVal(val) {
      this.selecForm.doStatus = val;
    },
    confirm() {
      // let selForm = Object.values(this.selecForm);
      // selForm.forEach(i => {
      //   if (i != "") {
      //     this.dot = true;
      //   }
      // });
      this.currentpage = 1;
      this.gettableData();
      this.visible = false;
    },
    cancel() {
      this.visible = false;
    },
    reLoadData() {
      this.$emit("getfindata");
    },
    detailvisible(row) {
      console.log("detailvisible", row);
      const { appId, procInstId: instId, taskId } = row;
      this.ibpsPayable.setPayableParams({
        appId,
        instId,
        taskId,
        status: "submitterQuery"
      });
      this.dialogTableVisible = true;
      console.log("params", this.params);
    },
    handleClose() {
      this.dialogTableVisible = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.gettableData();
    },
    getRow(row) {
      this.taskIds = [];
      this.copyArr = [];
      let copyInfo = {};
      row.forEach(item => {
        this.taskIds.push(item.taskId);
        const { appId, bizKey, procInstId } = item;
        copyInfo = { appId, bizKey, procInstId };
        this.copyArr.push(copyInfo);
      });
      this.taskIds = this.taskIds.toString();
    },
    copydata() {
      console.log("111", this.copyArr);
      // return request({
      //   baseURL: BASE_GATEWAY_API,
      //   url: COMP_URL + "/scene/v3/complexService/copyForm",
      //   method: "post",
      //   data: this.copyArr
      // }).then(res => {
      //   console.log("res", res);
      //   if (res.state == 200) {
      //     this.gettableData();
      //     this.$message({
      //       message: "复制成功",
      //       type: "success"
      //     });
      //   } else {
      //    this.$message({
      //       message: "复制失败",
      //       type: "error"
      //     });
      //   }
      // });
    },
    // revocation() {
    //   return request({
    //     baseURL: BASE_GATEWAY_API,
    //     url: FORM_URL + "/bpm/v3/bpm/task/completeBatch",
    //     method: "post",
    //     data: {
    //       parameters: [
    //         { key: "taskIds", value: this.taskIds },
    //         { key: "actionName", value: "revoke" },
    //         { key: "opinion", value: "po" },
    //         { key: "destination", value: "" }
    //       ]
    //     }
    //   }).then(res => {
    //     console.log("res", res);
    //     this.$message({
    //       message: "撤回成功",
    //       type: "success"
    //     });
    //   });
    // },
    // gettableData() {
    //   this.loading = true;
    //   let docNumber = "";
    //   let bukrs = "";
    //   let originator = "";
    //   let markDepatMent = "";

    //   docNumber =
    //     this.selecForm.docNumber != ""
    //       ? "%" + this.selecForm.docNumber + "%"
    //       : "";
    //   bukrs =
    //     this.selecForm.bukrs != "" ? "%" + this.selecForm.bukrs + "%" : "";
    //   originator =
    //     this.selecForm.originator != ""
    //       ? "%" + this.selecForm.originator + "%"
    //       : "";
    //   markDepatMent =
    //     this.selecForm.markDepatMent != ""
    //       ? "%" + this.selecForm.markDepatMent + "%"
    //       : "";
    //   return request({
    //     baseURL: BASE_GATEWAY_API,
    //     url: FORM_URL + "/bpm/v3/bpm/initiated/query/my/completed",
    //     method: "post",
    //     data: {
    //       extraParameters: {
    //         appIds: this.appId,
    //         docNumber: docNumber,
    //         bukrs: bukrs,
    //         originator: originator,
    //         startTime: this.selecForm.startTime,
    //         endTime: this.selecForm.endTime,
    //         doStatus: this.selecForm.doStatus,
    //         markDepatMent: markDepatMent
    //       },
    //       parameters: [],
    //       requestPage: {
    //         pageNo: this.currentpage,
    //         limit: 10,
    //         totalCount: null
    //       },
    //       sorts: []
    //     }
    //   })
    //     .then(response => {
    //       console.log("已完成翻页", response);
    //       this.tableData = response.data.dataResult;
    //       this.tableData.forEach(item => {
    //         item.subject = item.subject.slice(3, -4);
    //       });
    //       this.pageAll = response.data.pageResult;
    //       this.$emit("changenum", this.pageAll);
    //       this.loading = false;
    //     })
    //     .catch(res => {
    //       this.loading = false;
    //     });
    // },
    gettableData() {
      this.loading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/scene/v3/outstandingaccount/createPreservation",
        method: "post",
        data: {
          pageNumber: this.currentpage,
          pageSize: 10,
          appIdList: this.appIdArr
        }
      })
        .then(res => {
          console.log("待摊销台账", res);
          this.tableData = res.data.boAmoHeadPoList;
          this.pageAll.totalCount = res.data.total;
          this.$emit("changenum", this.pageAll);
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/views/platform/processmanage/components/table/table.scss";
</style>
