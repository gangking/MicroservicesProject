<template>
  <el-dialog :visible="dialogEgVoucher" width="98%" style="padding:10px;background: #9093994d;" fullscreen ref="sanyfulltabscreen" append-to-body title="生成凭证" class="voucherClass" :before-close="handleClose" :close-on-click-modal='false'>
    <div class="voucherbox">
      <split-pane :min-percent="17" :default-percent="18" split="vertical">
        <template slot="paneL">
          <div class="treeBox">
            <myTree v-loading="loadingTree" :tree-list="treeList" :inst-id="instId" @refreshTree="getListData" @clickchildren="clickchildren" />
            <!-- <tree></tree> -->
          </div>
          <!-- tree end -->
        </template>
        <template slot="paneR">
          <full-screen-content>
            <split-pane split="vertical" slot="stabcontent">
              <template slot="paneL">
                <div class="tabfull" slot="stabcontent">
                  <div class="tabheader">
                    <tab-title :tab-title="titleInfo" :title-con="tabContent" :contentab="contentab" />
                  </div>
                  <div class="tabboxs">
                    <tabbox v-loading="loadingTab" :tab-list="tabList" :tab-content="tabContent" @clickRowData="clickRowData" @currentChange="currentChange">
                      <solt name="content" />
                    </tabbox>
                    <div class="footer">
                      <total-info :total-info="messageData" />
                    </div>
                  </div>
                </div>
              </template>
              <template slot="paneR">
                <div class="contairebox">
                  <contairebox ref="formRef" v-loading="loadingForm" :form-def="formDefList" :value="formConList" />
                </div>
              </template>
            </split-pane>
          </full-screen-content>
        </template>
      </split-pane>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" plain @click="dialogEgVoucherclose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ComponentProps from '../../../Invoice/mixins/components-props';
import SplitPane from 'vue-splitpane';
import tree from './components/tree.vue';
import tabbox from './components/tabbox.vue';
import SanyMessage from './components/message.vue';
import totalInfo from './components/totalInfo.vue';
import tabTitle from './components/tabTitle.vue';
import contairebox from './components/contairebox.vue';
import previewApi from '@/api/platform/voucher/preview.js';
import myTree from './components/myTree/index';
import FullScreenContent from './components/fullscreen-content.vue';

export default {
  name: 'voucher-create',
  components: {
    SplitPane,
    tree,
    tabbox,
    contairebox,
    myTree,
    tabTitle,
    // FullScreenTabContainer,
    totalInfo,
    FullScreenContent
  },
  props: {},

  data() {
    return {
      dialogEgVoucher: true,
      currentpage: 1,
      pageAll: {},
      treeList: [],
      tabList: [],
      tabContent: {},
      contentab: {},
      formDefList: '{}',
      formConList: {},
      loadingTree: false,
      loadingForm: false,
      loadingTab: false,
      treeIds: '',
      appIds: '',
      titleInfo: {},
      messageData: {}
    };
  },

  mixins: [ComponentProps],

  created() {},
  mounted() {
    this.initListData();
  },
  methods: {
    getListData() {
      this.queryTreeList();
    },
    initListData() {
      // this.queryTreeList();
      this.fetchTreeList();
    },
    // 初始化树
    queryTreeList() {
      this.loadingTree = true;
      // setTimeout(() => {
      //   this.loadingTree = false;
      //   this.recursionArry(require('./test2.json').data, 0);
      //   this.treeList = require('./test2.json').data;
      // }, 1000);
      previewApi
        .queryAccTree({
          instId: this.instId
        })
        .then(res => {
          this.loadingTree = false;
          // console.log("凭证规则树形结构", res.data);
          this.recursionArry(res.data, 0);
          // console.log("树形数据", res.data);
          this.treeList = res.data;
        })
        .catch(req => {});
    },
    fetchTreeList() {
      this.loadingTree = true;
      previewApi
        .buildAccTree({
          // instId:'642797303236657152'
          instId: this.instId
        })
        .then(res => {
          this.loadingTree = false;
          // console.log("凭证规则树形结构", res.data);
          this.recursionArry(res.data, 0);
          // console.log("树形数据", res.data);
          this.treeList = res.data;
        })
        .catch(req => {});
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
      let id = [];
      // 递归查询树
      if (val.nodes != null) {
        function recursion(appid) {
          for (let i = 0; i < appid.length; i++) {
            // id.push(appid[i].key);
            const childs = appid[i].nodes;
            if (appid[i].type === 'ACCL') {
              id.push(appid[i].key);
            }
            if (childs && childs.length != null) {
              // console.log(`childs==`+childs);
              recursion(childs);
            }
          }
        }
        recursion(val.nodes);
        this.appIds = id.filter(key => key).toString();
      } else {
        this.appIds = val.key;
      }
      //  console.log("============appIds", this.appIds);
      this.fetchTabDef();
      this.fetchTabCon(this.appIds);
      this.fetchTotalInfo(this.appIds);
    },
    // 获取树形点击节点值
    clickchildren2(info) {
      // console.log("获取树形点击节点值11", info);
      this.rowInfo = info;
      if (info.nodes) {
        if (info.nodes.length > 0) {
          // console.log(`000000000===`, this.getTextByJs(info.nodes));

          this.treeIds = this.getTextByJs(info.nodes);
        } else {
          console.log(`info.keyll`, info.key);
          this.treeIds = info.key;
        }
      } else {
        this.treeIds = info.key;
      }
      // console.log(`this.treeIds=====`, this.treeIds);
      this.fetchTabDef();
      this.fetchTabCon(this.treeIds);
      this.fetchTotalInfo(this.treeIds);
    },
    // 当前页
    currentChange(val) {
      this.currentpage = val;
      // console.log(`当前页是===`, this.currentpage, val);
      this.fetchTabCon(this.treeIds);
    },
    // 获取自定义
    fetchTabDef() {
      this.loadingTab = true;
      previewApi
        .tabDef({
          instId: this.instId
          // instId:'642797303236657152'
        })
        .then(res => {
          this.loadingTab = false;
          // console.log('自定义表数据头',res.data)
          this.tabList = res.data;
        })
        .catch(req => {});
    },
    // 获取表格内容
    fetchTabCon(ids) {
      this.loadingTab = true;
      previewApi
        .tabContent({
          extraParameters: {
            ids: ids
          },
          requestPage: {
            pageNo: this.currentpage,
            limit: 9999
          }
        })
        .then(res => {
          this.loadingTab = false;
          // console.log('自定义表数据',res.data)
          this.tabContent = res.data;
          this.pageAll = res.data.pageResult;
        })
        .catch(req => {});
    },

    // 点击表格行
    clickRowData(info) {
      console.log(`info-888---`, info);
      this.contentab = info;
      // 自定义
      this.fetchDefForm();
      this.fetchFormCon(info.id);
    },

    fetchDefForm() {
      this.loadingForm = true;
      previewApi
        .formDef({
          instId: this.instId
        })
        .then(res => {
          // console.log('表头',res.data)
          this.loadingForm = false;
          this.formDefList = res.data;
        })
        .catch(req => {});
    },
    fetchFormCon(id) {
      this.loadingForm = true;
      // con
      previewApi
        .formContent({
          // id:'800000000000222211'
          id: id
        })
        .then(res => {
          this.loadingForm = false;
          // console.log('表内容',res.data)
          this.formConList = res.data;
        })
        .catch(req => {});
    },
    // 获取tab底部信息
    fetchTotalInfo(ids) {
      this.loadingTab = true;
      previewApi
        .tabTotal({
          extraParameters: {
            ids: ids
          }
        })
        .then(res => {
          this.loadingTab = false;
          console.log(`res============`, res);

          this.messageData = res.data;
        })
        .catch(req => {});
    },
    getFormData() {
      return this.$refs['sanyfulltabscreen'].getFormData();
    },
    submitVerify(callback) {
      console.log('full-screen-verifysubmitVerify');
      return this.$refs['sanyfulltabscreen'].submitVerify(callback);
    },
    getTextByJs(arr) {
      var str = '';
      for (var i = 0; i < arr.length; i++) {
        str += arr[i].key + ',';
      }
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      return str;
    },
    handleClose(done) {
      this.dialogEgVoucherclose();
      return true;
    },
    dialogEgVoucherclose() {
      this.dialogEgVoucher = false;
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
  height: calc(100vh - 119px);
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
      // background: red;
    }
    .tabfull {
      height: 100%;
      .tabboxs {
        // background: yellow;
        overflow: visible;
        // height: 100%;
        .footer {
          height: 79px;
          border-top: 1px solid #ccc;
        }
        .tabheader {
          height: 60px;
        }
      }
    }
    .contairebox {
      // background: green;
    }
  }
}
</style>
