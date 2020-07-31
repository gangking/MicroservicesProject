<template>
  <div class="managetable">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未提交" name="first" style="height: 100%">
        <uncommitted
          ref="undisref"
          :undisdata="undisposedata"
          :undisnum="undisposenum"
          :appId="appId"
          :load="undisLoad"
          @getunddata="getAllData"
          @reLoad="getundisdata"
          @changenum="changeundisnum"
        />
      </el-tab-pane>
      <el-tab-pane label="进行中" name="second" style="height: 100%">
        <underway
          ref="revocref"
          :revocdata="revocationdata"
          :revocnum="revocationnum"
          :appId="appId"
          :load="revocLoad"
          @getrevdata="getAllData"
          @reLoad="getrevocdata"
          @changenum="changerevocnum"
        />
      </el-tab-pane>
      <el-tab-pane label="已完成" name="third" style="height: 100%">
        <finish
          ref="disporef"
          :dispodata="disposedata"
          :disponum="disposenum"
          :appId="appId"
          :load="dispoLoad"
          @getdispodata="getAllData"
          @reLoad="getdisposedata"
          @changenum="changedisponum"
        />
      </el-tab-pane>
      <!-- <el-tab-pane label="待审阅" name="fourth">待审阅</el-tab-pane>
      <el-tab-pane label="已审阅" name="five">已审阅</el-tab-pane>
      <el-tab-pane label="询问中" name="six">询问中</el-tab-pane>-->
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
    <!-- <div class="num dis">
      <el-badge :value="rejectnum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num fin">
      <el-badge :value="finishnum.totalCount" :max="99" class="item"></el-badge>
    </div>-->
  </div>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
import uncommitted from "./table/uncommitted";
import underway from "./table/underway";
import finish from "./table/finish";
export default {
  components: {
    uncommitted,
    underway,
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
      appId: "",
      undisLoad: false,
      revocLoad: false,
      dispoLoad: false
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
    getAllData() {
      this.getundisdata();
      this.getrevocdata();
      this.getdisposedata();
    },
    handleClick(tab, event) {
      console.log(tab);
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
