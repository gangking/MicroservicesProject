<template>
  <div class="managetable">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="计提待处理" name="first" style="height: 100%">
        <undispose
          ref="undisref"
          :undisdata="undisposedata"
          :undisnum="undisposenum"
          :appId="appId"
          :load="undisLoad"
          @getunddata="reLoadAllData"
          @reLoad="getundisdata"
          @changenum="changeundisnum"
        />
      </el-tab-pane>
      <el-tab-pane label="计提已处理" name="second" style="height: 100%">
        <revocation
          ref="revocref"
          :revocdata="revocationdata"
          :revocnum="revocationnum"
          :appId="appId"
          :load="revocLoad"
          @getrevdata="reLoadAllData"
          @reLoad="getrevocdata"
          @changenum="changerevocnum"
        />
      </el-tab-pane>
      <el-tab-pane label="异常待处理" name="third" style="height: 100%">
        <dispose
          ref="disporef"
          :dispodata="disposedata"
          :disponum="disposenum"
          :appId="appId"
          :load="dispoLoad"
          @getdispodata="reLoadAllData"
          @reLoad="getdisposedata"
          @changenum="changedisponum"
        />
      </el-tab-pane>
      <el-tab-pane label="异常已处理" name="fourth" style="height: 100%">
        <unchecked
          ref="uncheref"
          :unchedata="uncheckdata"
          :unchenum="unchecknum"
          :appId="appId"
          :load="uncheLoad"
          @getdispodata="reLoadAllData"
          @reLoad="getunchedata"
          @changenum="changeunchenum"
        />
      </el-tab-pane>
      <el-tab-pane label="摊销待处理" name="five" style="height: 100%">
        <finish
          ref="finiref"
          :finidata="finishdata"
          :fininum="finishnum"
          :appId="appId"
          :load="finishLoad"
          @getfindata="reLoadAllData"
          @reLoad="getfinishdata"
          @changenum="changefininum"
        ></finish>
      </el-tab-pane>
    </el-tabs>
    <div class="num unc">
      <!-- 计提待处理 -->
      <el-badge :value="undisposenum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num und">
      <!-- 计提已处理 -->
      <el-badge :value="revocationnum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num rev">
      <!-- 异常待处理 -->
      <el-badge :value="disposenum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num dis">
      <!-- 异常已处理 -->
      <el-badge :value="unchecknum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num fin">
      <el-badge :value="finishnum.totalCount?finishnum.totalCount:0" :max="99" class="item"></el-badge>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { COMP_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
import undispose from "./table/undispose";
import revocation from "./table/revocation";
import dispose from "./table/dispose";
import unchecked from "./table/unchecked";
import finish from "./table/finish";
export default {
  components: {
    undispose,
    revocation,
    dispose,
    unchecked,
    finish
  },
  data() {
    return {
      activeName: "first",
      undisposedata: [],
      undisposenum: {},
      revocationdata: [],
      revocationnum: {},
      disposedata: [],
      disposenum: {},
      uncheckdata: [],
      unchecknum: {},
      finishdata: [],
      finishnum: {},
      appId: "",
      undisLoad: false,
      revocLoad: false,
      dispoLoad: false,
      uncheLoad: false,
      finishLoad: false,
      appIdArr: []
    };
  },
  methods: {
    changeundisnum(val) {
      console.log("1待处理翻页", val);
      this.undisposenum = val;
    },
    changerevocnum(val) {
      console.log("2可撤销翻页", val);
      this.revocationnum = val;
    },
    changedisponum(val) {
      console.log("3已处理翻页", val);
      this.disposenum = val;
    },
    changeunchenum(val) {
      console.log("4待审阅翻页", val);
      this.unchecknum = val;
    },
    changefininum(val) {
      console.log("5摊销台账", val);
      this.finishnum = val;
    },
    getAllData() {
      this.getundisdata();
      this.getrevocdata();
      this.getdisposedata();
      this.getunchedata();
      this.getfinishdata();
    },
    reLoadAllData() {
      this.$refs.undisref.confirm();
      this.$refs.revocref.confirm();
      this.$refs.disporef.confirm();
      this.$refs.uncheref.confirm();
      this.$refs.finiref.confirm();
    },
    handleClick(tab, event) {
      console.log(tab.name, tab);
      switch (tab.name) {
        case "first":
          this.$refs.undisref.confirm();
          break;
        case "second":
          this.$refs.revocref.confirm();
          break;
        case "third":
          this.$refs.disporef.confirm();
          break;
        case "fourth":
          this.$refs.uncheref.confirm();
          break;
        case "five":
          this.$refs.finiref.confirm();
          break;
        default:
          break;
      }
    },
    // 计提待处理
    getundisdata() {
      // // 模拟数据
      // var testdata = require('../test.json');
      // console.log('计提待处理', testdata);
      // this.undisposedata = testdata.data.dataResult;
      // this.undisposenum = testdata.data.pageResult;

      this.undisLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/scene/v3/bsAccdoc/queryPending",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 100 },
          sorts: []
        }
      })
        .then(response => {
          console.log("计提待处理", response);
          this.undisposedata = response.data.dataResult;
          this.undisposenum = response.data.pageResult;
          this.undisLoad = false;
        })
        .catch(res => {
          this.undisLoad = false;
        });
    },
    // 计提已处理
    getrevocdata() {
      // // 模拟数据
      // var testdata = require('../test.json');
      // console.log('计提待处理', testdata);
      // this.revocationdata = testdata.data.dataResult;
      // this.revocationnum = testdata.data.pageResult;

      this.revocLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/scene/v3/bsAccdoc/queryProcessed",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: null },
          sorts: []
        }
      })
        .then(response => {
          console.log("计提已处理", response);
          this.revocationdata = response.data.dataResult;
          this.revocationnum = response.data.pageResult;
          this.revocLoad = false;
        })
        .catch(res => {
          this.revocLoad = false;
        });
    },
    // 异常待处理
    getdisposedata() {
      // // 模拟数据
      // var testdata = require('../test.json');
      // console.log('计提待处理', testdata);
      // this.disposedata = testdata.data.dataResult;
      // this.disposenum = testdata.data.pageResult;

      this.dispoLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/scene/v3/bsAccdoc/queryAbnormal",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 45 },
          sorts: []
        }
      })
        .then(response => {
          console.log("异常待处理", response);
          this.disposedata = response.data.dataResult;
          this.disposenum = response.data.pageResult;
          this.dispoLoad = false;
        })
        .catch(res => {
          this.dispoLoad = false;
        });
    },
    // 异常已处理
    getunchedata() {
      // // 模拟数据
      // var testdata = require('../test.json');
      // console.log('计提待处理', testdata);
      // this.uncheckdata = testdata.data.dataResult;
      // this.unchecknum = testdata.data.pageResult;

      this.dispoLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/scene/v3/bsAccdoc/queryAbnormalHandle",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 45 },
          sorts: []
        }
      })
        .then(response => {
          console.log("异常已处理", response);
          this.uncheckdata = response.data.dataResult;
          this.unchecknum = response.data.pageResult;
          this.dispoLoad = false;
        })
        .catch(res => {
          this.dispoLoad = false;
        });
    },
    // 待摊销台账
    getfinishdata() {
      this.dispoLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/scene/v3/outstandingaccount/createPreservation",
        method: "post",
        data: {
          pageNumber: 1,
          pageSize: 10,
          appIdList: this.appIdArr
        }
      })
        .then(res => {
          console.log("待摊销台账", res);
          this.finishdata = res.data.boAmoHeadPoList;
          this.finishnum.totalCount = res.data.total;
          this.dispoLoad = false;
        })
        .catch(error => {
          this.dispoLoad = false;
        });
    }
  },
  props: {
    keyId: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  watch: {
    keyId: {
      handler: function(val) {
        this.appId = val;
        if (val) {
          this.appIdArr = val.split(",");
        } else {
          this.appIdArr = [];
        }
        console.log("appId1111", this.appId);
        this.getAllData();
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.managetable {
  height: 98%;
  position: relative;
  background-color: #fff;
  /deep/ .tabs {
    height: 100% !important;
  }
  /deep/ .el-tabs {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    height: 94%;
  }
  /deep/ .el-tabs__nav {
    left: 40px !important;
  }
  /deep/ .el-tabs__header {
    margin: 0 0 8px !important;
  }
  /deep/ .el-tabs__item {
    padding: 0 15px !important;
    width: 120px;
    text-align: center;
  }
  /deep/ .el-tabs__active-bar {
    height: 3px !important;
  }
  .num {
    position: absolute;
    top: -3px;
  }
  .unc {
    left: 134px;
  }
  .und {
    left: 254px;
  }
  .rev {
    left: 374px;
  }
  .dis {
    left: 494px;
  }
  .fin {
    left: 614px;
  }
}
</style>
