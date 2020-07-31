<template>
  <div class="managetable">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未提交" name="first" style="height: 100%">
        <uncommitted
          ref="uncomref"
          :uncomdata="uncommitteddata"
          :uncomnum="uncommittednum"
          :appId="appId"
          :load="uncomLoad"
          @getuncdata="reLoadAllData"
          @reLoad="getuncomdata"
          @changenum="changeuncomnum"
        ></uncommitted>
      </el-tab-pane>
      <el-tab-pane label="进行中" name="second" style="height: 100%">
        <underway
          ref="underref"
          :underdata="underwaydata"
          :undernum="underwaynum"
          :appId="appId"
          :load="underLoad"
          @getunddata="reLoadAllData"
          @reLoad="getunderwaydata"
          @changenum="changeundernum"
        ></underway>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="five" style="height: 100%">
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
      <el-badge :value="uncommittednum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num und">
      <el-badge :value="underwaynum.totalCount" :max="99" class="item"></el-badge>
    </div>
    <div class="num fin">
      <el-badge :value="finishnum.totalCount" :max="99" class="item"></el-badge>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
import { showLoading, hideLoading } from "@/utils/loading";
import uncommitted from "./table/uncommitted";
import underway from "./table/underway";
import finish from "./table/finish";
export default {
  components: {
    uncommitted,
    underway,
    finish
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
        this.getAllData();
      },
      immediate: true
    }
  },
  data() {
    return {
      activeName: "first",
      uncommitteddata: [],
      uncommittednum: {},
      underwaydata: [],
      underwaynum: {},
      finishdata: [],
      finishnum: {},
      appId: "",
      uncomLoad: false,
      underLoad: false,
      finishLoad: false
    };
  },
  methods: {
    changeuncomnum(val) {
      this.uncommittednum = val;
    },
    changeundernum(val) {
      this.underwaynum = val;
    },
    changefininum(val) {
      this.finishnum = val;
    },
    getAllData() {
      this.getuncomdata();
      this.getunderwaydata();
      this.getfinishdata();
    },
    reLoadAllData() {
      this.$refs.uncomref.confirm();
      this.$refs.underref.confirm();
      this.$refs.finiref.confirm();
    },
    handleClick(tab, event) {
      switch (tab.name) {
        case "first":
          this.$refs.uncomref.confirm();
          break;
        case "second":
          this.$refs.underref.confirm();
          break;
        case "five":
          this.$refs.finiref.confirm();
          break;
        default:
          break;
      }
    },
    // 未提交
    getuncomdata() {
      // showLoading()
      this.uncomLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/initiated/query/all/draft",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 100 },
          sorts: []
        }
      })
        .then(response => {
          // hideLoading()
          console.log("未提交", response);
          this.uncommitteddata = response.data.dataResult;
          this.uncommittednum = response.data.pageResult;
          this.uncommitteddata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.uncomLoad = false;
        })
        .catch(res => {
          this.uncomLoad = false;
        });
    },
    // 进行中
    getunderwaydata() {
      this.underLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/initiated/query/all/requested",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: null },
          sorts: []
        }
      })
        .then(response => {
          console.log("进行中", response);
          this.underwaydata = response.data.dataResult;
          this.underwaynum = response.data.pageResult;
          this.underwaydata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.underLoad = false;
        })
        .catch(res => {
          this.underLoad = false;
        });
    },
    // 已完成
    getfinishdata() {
      this.finishLoad = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "/bpm/v3/bpm/initiated/query/all/completed",
        method: "post",
        data: {
          extraParameters: { appIds: this.appId },
          parameters: [],
          requestPage: { pageNo: 1, limit: 10, totalCount: 45 },
          sorts: []
        }
      })
        .then(response => {
          console.log("已完成", response);
          this.finishdata = response.data.dataResult;
          this.finishnum = response.data.pageResult;
          this.finishdata.forEach(item => {
            item.subject = item.subject.slice(3, -4);
          });
          this.finishLoad = false;
        })
        .catch(res => {
          this.finishLoad = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.managetable {
  height: 98%;
  background-color: #fff;
  position: relative;
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
    // left: 462px;
    left: 282px;
  }
}
</style>