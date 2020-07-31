<template>
  <div class="voucherbox">
    <split-pane :min-percent="17" :default-percent="18" split="vertical">
      <template slot="paneL">
        <div class="treeBox">
          <div class="toptitle">
            <el-button
              class="btnPzmode"
              type="primary"
              size="mini"
              plain
              :disabled="voucherModelAbled"
              @click="voucherModel"
            >
              <i class="iconfont icon-uniE0411"></i>凭证模拟
            </el-button>
            <el-button type="danger" size="mini" plain @click="generVoucher">
              <i class="iconfont icon-uniE1BB"></i>生成凭证
            </el-button>
          </div>
          <myTree v-loading="loadingTree" :tree-list="treeList" @clickchildren="clickchildren" />
        </div>
      </template>
      <template slot="paneR">
        <split-pane split="vertical" slot="stabcontent">
          <template slot="paneL">
            <div
              class="tabfull"
              slot="stabcontent"
              style="height: 100%;display: flex;flex-direction: column;"
            >
              <div
                class="tabheader"
                style="text-align: left;height: 44px;border-bottom: 1px solid #ccc;"
              >
                <tab-title :tab-title="titleInfo" :title-con="tabContent" :contentab="contentab" />
              </div>
              <div class="tabboxs" style="flex: 1; overflow: hidden;height: calc(100% - 125px);">
                <tabbox
                  v-loading="loadingTab"
                  :tab-list="tabList"
                  :tab-content="tabContent"
                  @clickRowData="clickRowData"
                >
                  <solt name="content" />
                </tabbox>
              </div>
              <div class="footer" style=" height: 79px;border-top: 1px solid #ccc;">
                <total-info :total-info="messageData" />
              </div>
            </div>
          </template>
          <template slot="paneR">
            <full-screen-content>
              <div class="contairebox" slot="screen-content">
                <contairebox v-loading="loadingForm" :form-def="formDefList" :value="formConList" />
              </div>
            </full-screen-content>
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
import ComponentProps from "../../../Invoice/mixins/components-props";
import SplitPane from "vue-splitpane";
import tabbox from "./components/tabbox.vue";
import SanyMessage from "./components/message.vue";
import totalInfo from "./components/totalInfo.vue";
import tabTitle from "./components/tabTitle.vue";
import contairebox from "./components/contairebox.vue";
import previewApi from "@/api/platform/voucher/preview.js";
import myTree from "./components/myTree/index";
import FullScreenContent from "./components/fullscreen-content.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("ibps/compositeBase");
const { mapActions } = createNamespacedHelpers("ibps/compositeDolog");
export default {
  name: "voucher-create",
  components: {
    SplitPane,
    tabbox,
    contairebox,
    myTree,
    tabTitle,
    totalInfo,
    FullScreenContent
  },
  mixins: [ComponentProps],
  data() {
    return {
      voucherModelAbled: false,
      currentpage: 1,
      pageAll: {},
      treeList: [],
      tabList: [],
      tabContent: {},
      contentab: {},
      formDefList: "",
      formConList: {},
      loadingTree: false,
      loadingForm: false,
      loadingTab: false,
      treeIds: "",
      appIds: "",
      titleInfo: {},
      messageData: {}
    };
  },

  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.fetchVoucherTreeList();
    },
    ...mapActions([
      "getFetchVoucherTreeList",
      "getQueryVoucherTreeList",
      "setVoucherModel",
      "setGenerVoucher",
      "getFetchTabDef",
      "getFetchTabCon",
      "getFetchTotalInfo",
      "getFetchDefForm",
      "getFetchFormCon"
    ]),
    // 初始化树
    queryVoucherTreeList() {
      this.loadingTree = true;
      this.getQueryVoucherTreeList().then(res => {
        if (res) {
          if (res.length == 0) {
            // 模拟数据
            // res = require('./test2.json').data;
          }
          this.recursionArry(res, 0);
          // console.log('改造后的树形数据', res);
          this.treeList = res;
        } else {
          this.$message.error("初始化树形组件数据失败。");
        }
        this.loadingTree = false;
      });
    },
    // 获取树形组件数据
    fetchVoucherTreeList() {
      this.loadingTree = true;
      this.getFetchVoucherTreeList().then(res => {
        if (res) {
          if (res.length == 0) {
            // 模拟数据
            // res = require('./test2.json').data;
          }
          this.recursionArry(res, 0);
          // console.log('改造后的树形数据', res);
          this.treeList = res;
        } else {
          this.$message.error("获取树形组件数据失败。");
        }
        this.loadingTree = false;
      });
    },
    // 凭证预览
    voucherModel() {
      this.voucherModelAbled = true;
      this.setVoucherModel()
        .then(res => {
          this.voucherModelAbled = false;
          this.queryVoucherTreeList();
          if (res) {
            this.$message({
              message: "操作成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: "凭证预览失败！",
              type: "error"
            });
          }
        })
        .catch(error => {
          this.voucherModelAbled = false;
        });
    },
    // 生成凭证
    generVoucher() {
      this.setGenerVoucher().then(res => {
        this.queryVoucherTreeList();
        if (res) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        } else {
          this.$message({
            message: "生成凭证失败！",
            type: "error"
          });
        }
      });
    },
    // 递归设置层级
    recursionArry(list, index) {
      var _this = this;
      if (Array.isArray(list) && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          item.cengji = index;
          if (item.nodes) {
            _this.recursionArry(item.nodes, index + 1);
          }
        }
      }
    },
    clickchildren(val) {
      console.log("被点击的树形节点数据", val);
      // var val = {"id":"","parentId":null,"type":"BUKRS","key":"","name":"","simStatus":null,"postStatus":null,"nodes":[{"id":"201911","parentId":"","type":"PERIO","key":"201911","name":"2019-11","simStatus":null,"postStatus":null,"nodes":[{"id":"201911MLBT01","parentId":"201911","type":"MLBT","key":"MLBT01","name":"报账信息","simStatus":null,"postStatus":null,"nodes":[{"id":"644101905022189568","parentId":"201911MLBT01","type":"ACCL","key":"644101905022189568","name":"001","simStatus":"02","postStatus":"10","nodes":null},{"id":"644101905043161088","parentId":"201911MLBT01","type":"ACCL","key":"644101905043161088","name":"002","simStatus":"02","postStatus":"10","nodes":null}]},{"id":"201911MLBT01","parentId":"201911","type":"MLBT","key":"MLBT01","name":"报账信息","simStatus":null,"postStatus":null,"nodes":[{"id":"644101905022189568","parentId":"201911MLBT01","type":"ACCL","key":"644101905022189568","name":"001","simStatus":"02","postStatus":"10","nodes":null},{"id":"644101905043161088","parentId":"201911MLBT01","type":"ACCL","key":"644101905043161088","name":"002","simStatus":"02","postStatus":"10","nodes":null}]}]}]}
      let id = [];
      // 递归查询树
      if (val.nodes != null) {
        // 获取此节点下所有ACCL类型key值
        function recursion(appid) {
          for (let i = 0; i < appid.length; i++) {
            const childs = appid[i].nodes;
            if (appid[i].type === "ACCL") {
              id.push(appid[i].key);
            }
            if (childs && childs.length != null) {
              recursion(childs);
            }
          }
        }
        recursion(val.nodes);
        this.appIds = id.filter(key => key).toString();
        // this.appIds =
        //   '647856959852118016,647856959873089111,647856959873089112,647856959873089113,647856959873089114,647856959873089115,647856959873089116,647856959873089117,647856959873089118,647856959873089119,647856959873089121,647856959873089122,647856959873089123,647856959873089124,647856959873089125,647856959873089126,647856959873089127,647856959873089128,647856959873089129,647856959873089130,647856959873089131,647856959873089132,647856959873089536'; // 模拟数据(临时)
      } else {
        this.appIds = val.key;
        // this.appIds = '647856959873089117'; // 模拟数据(临时)
      }
      // 获取表头数据
      this.fetchTabDef(this.appIds);
    },
    // 获取或刷新表头数据
    fetchTabDef(id) {
      this.loadingTab = true;
      this.loadingForm = true;
      this.getFetchTabDef().then(res => {
        if (res) {
          this.tabList = res;
          console.log("获取或刷新表头数据", res);
          // 获取表格内容数据
          this.fetchTabCon(id);
        } else {
          this.loadingTab = false;
          this.loadingForm = false;
          this.$message({
            message: "获取表头数据失败！",
            type: "error"
          });
        }
      });
    },
    // 获取表格内容数据
    fetchTabCon(ids) {
      this.getFetchTabCon(ids, this.currentpage).then(res => {
        if (res) {
          console.log("表格内容数据", res);
          this.tabContent = res.tabContent;
          this.pageAll = res.pageAll;
          // 获取表格统计金额
          this.fetchTotalInfo(ids);
        } else {
          this.loadingTab = false;
          this.loadingForm = false;
          this.$message({
            message: "获取表格内容数据失败！",
            type: "error"
          });
        }
      });
    },
    // 获取tab底部统计金额信息
    fetchTotalInfo(ids) {
      this.getFetchTotalInfo(ids).then(res => {
        this.loadingTab = false;
        if (res.state == "200") {
          console.log(`获取tab底部统计金额信息`, res);
          this.messageData = res.data;
        } else {
          this.loadingTab = false;
          this.loadingForm = false;
          this.$message({
            message: "获取统计金额信息失败！",
            type: "error"
          });
        }
      });
    },
    // 点击表格行渲染表单
    clickRowData(info) {
      console.log(`点击表格行渲染表单`, info);
      // 更新表格选中行详细信息
      this.contentab = info;
      // 自定义表单头部数据请求及渲染
      this.fetchDefForm(info);
    },
    // 获取表单头部信息
    fetchDefForm(info) {
      this.getFetchDefForm().then(res => {
        if (res) {
          console.log("获取表单头部信息", res, typeof res);
          this.formDefList = res;
          // 自定义表单数据请求及渲染
          this.fetchFormCon(info.id);
        } else {
          this.loadingForm = false;
          this.$message({
            message: "获取表单头部信息失败！",
            type: "error"
          });
        }
      });
    },
    // 获取表单数据信息
    fetchFormCon(id) {
      this.getFetchFormCon(id).then(res => {
        this.loadingForm = false;
        if (res) {
          console.log("获取表单数据信息", res);
          this.formConList = res;
        } else {
          this.loadingForm = false;
          this.$message({
            message: "获取表单数据信息失败！",
            type: "error"
          });
        }
      });
    },
    getFormData() {
      // console.log("this.$refs['sanyfulltabscreen']", this, this.$refs, this.$refs['sanyfulltabscreen'])
      return this.$refs["sanyfulltabscreen"].getFormData();
    },
    submitVerify(callback) {
      console.log("full-screen-verifysubmitVerify");
      return this.$refs["sanyfulltabscreen"].submitVerify(callback);
    },
    getTextByJs(arr) {
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += arr[i].key + ",";
      }
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
// /deep/ .el-dialog {
//   margin-top: 2vh !important;
// }
/deep/ .el-dialog__header {
  border-bottom: none;
}
/deep/ .el-dialog__body {
  padding: 0;
  overflow: visible;
}
/deep/ .el-dialog__footer {
  padding: 6px 20px 6px;
}
.voucherbox {
  position: relative;
  height: 100%;
  > .vue-splitter-container {
    &:first-child {
      border: 1px solid #ccc;
    }
    .treeBox,
    .tabboxs,
    .contairebox {
      height: 100%;
      overflow: auto;
    }
    .voucherClass {
      .el-dialog > .el-dialog__body {
        overflow: hidden;
      }
    }
    .treeBox {
      overflow: hidden;
      .toptitle {
        height: 45px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-evenly;
        padding: 8px 10px;
        border-bottom: 1px solid #ccc;
        /deep/ .el-button--mini {
          .iconfont {
            margin-right: 5px;
          }
        }
      }
    }
    /deep/ .splitter-paneL {
      .tabfull {
        // height: 100%;
        // display: flex;
        // flex-direction: column;
        // overflow: auto;
        .tabheader {
          // text-align: left;
          // height: 44px;
          // border-bottom: 1px solid #ccc;
          // background: pink;
        }
        .tabboxs {
          // flex: 1;
          // overflow: hidden;
          // height: calc(100% - 125px);
          // background: red;
        }
        .footer {
          // height: 79px;
          // border-top: 1px solid #ccc;
          // background: yellow;
        }
      }
    }
  }
}
</style>
