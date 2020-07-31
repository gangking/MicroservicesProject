<template>
  <el-card style="height: 100%">
    <template slot="header">
      <p class="header">消息定义</p>
    </template>
    <div class="managetable">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="消息类定义" name="first" style="height: 100%">
          <msgtypedefi
            ref="uncomref"
            :msgtypedata="msgtypedata"
            :msgtypenum="msgtypenum"
            :appId="appId"
            :load="uncomLoad"
            @msgTypeData="getAllData"
            @reLoad="getMsgType"
          ></msgtypedefi>
        </el-tab-pane>
        <el-tab-pane label="消息定义" name="second" style="height: 100%">
          <msgdefi
            ref="underref"
            :msgdata="msgdata"
            :msgnum="msgnum"
            :appId="appId"
            :load="underLoad"
            @msgData="getAllData"
            @reLoad="getMsgData"
          ></msgdefi>
        </el-tab-pane>
      </el-tabs>
<!-- 
      <div class="num unc">
        <el-badge :value="msgtypenum.totalCount" :max="99" class="item"></el-badge>
      </div>
      <div class="num und">
        <el-badge :value="msgnum.totalCount" :max="99" class="item"></el-badge>
      </div> -->
    </div>
  </el-card>
</template>

<script>
import request from "@/utils/request";
import { BASE_GATEWAY_API, COMP_URL } from "@/api/baseUrl";
import msgtypedefi from "./table/msgtypedefi";
import msgdefi from "./table/msgdefi";
export default {
  data() {
    return {
      activeName: "first",
      msgtypedata: [],
      msgtypenum: {},
      msgdata: [],
      msgnum: {},
      appId: "",
      uncomLoad: false,
      underLoad: false,
      currentpage: 1
    };
  },
  methods: {
    getAllData() {
      this.getMsgType();
      this.getMsgData();
    },
    handleClick(tab, event) {
      switch (tab.name) {
        case "first":
            this.$refs.uncomref.confirm();
          break;
        case "second":
            this.$refs.underref.confirm();
          break;
        default:
          break;
      }
    },
    getMsgType() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/bsCheckStep/queryForMsgClass",
        method: "post",
        data: {
          parameters: [],
          requestPage: {
            pageNo: this.currentpage,
            limit: 20,
            totalCount: null
          },
          sorts: []
        }
      }).then(res => {
        console.log("getMsgType", res);
        this.msgtypedata=res.data.dataResult
        this.msgtypenum=res.data.pageResult
      });
    },
    getMsgData() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/bsCheckStep/queryMsgDef",
        method: "post",
        data: {
          parameters: [],
          requestPage: {
            pageNo: this.currentpage,
            limit: 20,
            totalCount: null
          },
          sorts: []
        }
      }).then(res => {
        console.log("getMsgdata", res);
        this.msgdata=res.data.dataResult
        this.msgnum=res.data.pageResult
      });
    }
  },
  components: {
    msgtypedefi,
    msgdefi
  },
  mounted() {
    this.getAllData();
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  /deep/ .el-card__header {
    padding: 8px 20px;
  }
  /deep/ .el-card__body {
    height: 90%;
    padding-top: 0px;
  }
  .header {
    font-weight: 700;
    font-size: 18px;
    margin: 0;
  }
}
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
    height: 98%;
  }
  //   /deep/ .el-tabs__nav {
  //     left: 40px !important;
  //   }
  /deep/ .el-tabs__header {
    margin: 0 !important;
  }
  /deep/ .el-tabs__item {
    padding: 0 15px !important;
    width: 114px;
    text-align: center;
  }
  /deep/ .el-tabs__item:nth-child(3) {
    width: 104px;
  }
  /deep/ .el-tabs__active-bar {
    height: 3px !important;
  }
  .num {
    position: absolute;
    top: -3px;
  }
  .unc {
    left: 88px;
  }
  .und {
    left: 190px;
  }
}
</style>