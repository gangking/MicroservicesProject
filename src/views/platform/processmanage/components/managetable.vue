<template>
  <div class="managetable">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="first" style="height: 100%">
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
      <el-tab-pane label="可撤销" name="second" style="height: 100%">
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
      <el-tab-pane label="已处理" name="third" style="height: 100%">
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
      <el-tab-pane label="待审阅" name="fourth" style="height: 100%">
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
      <el-tab-pane label="已审阅" name="five" style="height: 100%">
        <checked
          ref="checkref"
          :checkdata="checkeddata"
          :checknum="checkednum"
          :appId="appId"
          :load="checkLoad"
          @getcheckdata="reLoadAllData"
          @reLoad="getcheckdata"
          @changenum="changechecknum"
        />
      </el-tab-pane>
      <!-- <el-tab-pane label="询问中" name="six">询问中</el-tab-pane> -->
    </el-tabs>
    <div class="num unc">
      <el-badge :value="undisposenum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num und">
      <el-badge :value="revocationnum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num rev">
      <el-badge :value="disposenum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num dis">
      <el-badge :value="unchecknum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num fin">
      <el-badge :value="checkednum.totalCount" :max="99" class="item"></el-badge>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
import undispose from "./table/undispose";
import revocation from "./table/revocation";
import dispose from "./table/dispose";
import unchecked from "./table/unchecked";
import checked from "./table/checked";
export default {
  components: {
    undispose,
    revocation,
    dispose,
    checked,
    unchecked
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
      checkeddata: [],
      checkednum: {},
      appId: "",
      undisLoad: false,
      revocLoad: false,
      dispoLoad: false,
      uncheLoad: false,
      checkLoad: false
    };
  },
  mounted() {
    // this.getAllData();
  },
  methods: {
    changeundisnum(val) {
      this.undisposenum = val;
    },
    changerevocnum(val) {
      this.revocationnum = val;
    },
    changedisponum(val) {
      this.disposenum = val;
    },
    changeunchenum(val) {
      this.unchecknum = val;
    },
    changechecknum(val) {
      this.checkednum = val;
    },
    getAllData() {
      this.getundisdata();
      this.getrevocdata();
      this.getdisposedata();
      this.getunchedata();
      this.getcheckdata();
    },
    reLoadAllData() {
      this.$refs.undisref.confirm();
      this.$refs.revocref.confirm();
      this.$refs.disporef.confirm();
      this.$refs.uncheref.confirm();
      this.$refs.checkref.confirm();
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
          this.$refs.checkref.confirm();
          break;
        default:
          break;
      }
    },
    // 待处理
    getundisdata() {
      this.undisLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/received/query/pending",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 100 },
          sorts: []
        }
      })
        .then(response => {
          console.log("待处理", response);
          this.undisposedata = response.data.dataResult;
          this.undisposenum = response.data.pageResult;
          this.undisposedata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.undisLoad = false;
        })
        .catch(res => {
          this.undisLoad = false;
        });
    },
    // 可撤销
    getrevocdata() {
      this.revocLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/received/query/handled/revokable",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: null },
          sorts: []
        }
      })
        .then(response => {
          console.log("可撤销", response);
          this.revocationdata = response.data.dataResult;
          this.revocationnum = response.data.pageResult;
          this.revocationdata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.revocLoad = false;
        })
        .catch(res => {
          this.revocLoad = false;
        });
    },
    // 已处理
    getdisposedata() {
      this.dispoLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/received/query/handled",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 45 },
          sorts: []
        }
      })
        .then(response => {
          console.log("已处理", response);
          this.disposedata = response.data.dataResult;
          this.disposenum = response.data.pageResult;
          this.disposedata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.dispoLoad = false;
        })
        .catch(res => {
          this.dispoLoad = false;
        });
    },
    // 待审阅
    getunchedata() {
      this.dispoLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/received/query/ccToBeRead",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 45 },
          sorts: []
        }
      })
        .then(response => {
          console.log("待审阅", response);
          this.uncheckdata = response.data.dataResult;
          this.unchecknum = response.data.pageResult;
          this.uncheckdata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.dispoLoad = false;
        })
        .catch(res => {
          this.dispoLoad = false;
        });
    },
    // 已审阅
    getcheckdata() {
      this.dispoLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/received/query/ccAlreadyRead",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 45 },
          sorts: []
        }
      })
        .then(response => {
          console.log("已审阅", response);
          this.checkeddata = response.data.dataResult;
          this.checkednum = response.data.pageResult;
          this.checkeddata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.dispoLoad = false;
        })
        .catch(res => {
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
    width: 90px;
    text-align: center;
  }
  /deep/ .el-tabs__active-bar {
    height: 3px !important;
  }
  .num {
    position: absolute;
    top: -3px;
    // padding: 0 3px;
    // font-size: 12px;
    // height: 15px;
    // line-height: 15px;
    // border-radius: 50%;
    // background-color: #f56c6c;
    // color: #fff;
    // text-align: center;
  }
  .unc {
    left: 102px;
  }
  .und {
    left: 192px;
  }
  .rev {
    left: 282px;
  }
  .dis {
    left: 372px;
  }
  .fin {
    left: 462px;
  }
}
</style>
