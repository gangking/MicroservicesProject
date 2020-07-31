<template>
  <div class="businesBox">
    <div class="businesBoxContent">
      <div class="header">
        <div class="mianbaoxie">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
              <span
                v-if="index>1"
                style="cursor: pointer;"
                @click="breadcrumbClick(item,index)"
              >{{item}}</span>
              <span v-else>{{item}}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="btn">
          <header-fullscreen />
          <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
            <el-button type="text" icon="el-icon-copy-document" @click="priview"></el-button>
          </el-tooltip>

           <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
            <el-button type="text" icon="el-icon-d-arrow-left" @click="goBack"></el-button>
          </el-tooltip>
        </div>

        <!-- <el-button type="danger" icon="el-icon-delete" circle @click="goBack"></el-button> -->
      </div>
      <layout>
        <!-- <titleBox :titleVal="descTitle" slot="title" /> -->
        <treeBox :openDetail="openTree" slot="tree" @activePage="activePage" />
        <component
          :breadcrumbList="breadcrumbList"
          :activeInfo="activeInfo"
          :showPageFlag="showPageFlag"
          v-bind:is="isComponent"
          slot="tablayout"
          :tabActive="tabActive"
          @getTabActive="getTabActive"
        ></component>
      </layout>
    </div>
  </div>
</template>

<script>
import HeaderFullscreen from "@/layout/header-aside/components/header-fullscreen";
import layout from "./component/layout";
import titleBox from "./component/title";
import treeBox from "./component/tree";
import basicConfig from "./component/basic_config";
import tableSingle from "./component/table_single";
import pageSignItem from "./component/table_single/page_sign_item";
import pageSignItemForm from "./component/table_single/page_sign_item/pageSignItemForm";
import tableMultiple from "./component/table_multiple";
import tableMultipleItem from "./component/table_multiple/tableMultipleItem";
import leftColumn from "./component/table_multiple/business_affairs_item/leftColumn";
import businessType from "./component/table_multiple/business_affairs_item/businessType";
import businessTypeMultipleItem from "./component/table_multiple/business_affairs_item/businessType/businessTypeMultipleItem";
import businessAffairsItem from "./component/table_multiple/business_affairs_item";
import ruleStrategy from "./component/ruleStrategy";
export default {
  props: {
    breadcrumb: {
      type: Array,
      default: () => {
        return [];
      }
    },
    openDetail: {
      type: Boolean,
      default: false
    },
    descTitle: {
      type: String,
      default: ""
    }
  },
  watch: {
    breadcrumb: {
      handler(val) {
        this.breadcrumbList = val;
        this.breadcrumbInfoList = val;
      },
      immediate: true
    },
    openDetail: {
      handler(val) {
        if (val) {
          this.openTree = this.openTree ? false : true;
          this.activePage({
            label: "基础配置",
            type: "basicConfig",
            tab: null,
            id: null,
            code: null,
            children: null,
            crumbs: [
              {
                label: "基础配置",
                type: "basicConfig",
                tab: null,
                id: null,
                code: null,
                children: null
              }
            ]
          });
        }
      },
      immediate: true
    }
  },
  components: {
    layout,
    titleBox,
    treeBox,
    basicConfig,
    tableSingle,
    pageSignItem,
    pageSignItemForm,
    tableMultiple,
    tableMultipleItem,
    businessType,
    businessTypeMultipleItem,
    leftColumn,
    businessAffairsItem,
    ruleStrategy,
    HeaderFullscreen
  },
  data() {
    return {
      openTree: false,
      isComponent: "basicConfig", // 默认基础配置
      tabActive: {}, // 基础配置选中的tab栏
      breadcrumbList: [], // 面包屑展示数组
      breadcrumbInfoList: [], // 面包屑详情数组
      showPageFlag: 0, // 多行业务事务切换标识
      activeInfo: {} // 选中节点信息
    };
  },
  methods: {
    priview() {
      this.$message("预览");
    },
    goBack() {
      this.$emit("goBack");
    },
    // 面包屑节点点击
    breadcrumbClick(name, index) {
      // console.log('面包屑详情数据', this.breadcrumbInfoList, index);
      this.activePageBreadcrumb(this.breadcrumbInfoList[index]);
    },
    // 面包屑选中页面
    activePageBreadcrumb(info) {
      // console.log('面包屑选中页面', info);
      this.activeInfo = info;
      switch (info.type) {
        case "basicConfig":
          this.isComponent = "basicConfig";
          this.breadcrumbList = this.breadcrumbList.slice(0, 2);

          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 2);
          this.breadcrumbInfoList[2] = {
            name: "基础配置",
            type: "basicConfig",
            info: info
          };

          this.breadcrumbList[2] = "基础配置";
          break;
        case "tableSingle":
          this.isComponent = "tableSingle"; // 单行业务事务
          this.breadcrumbList = this.breadcrumbList.slice(0, 2);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 2);
          this.breadcrumbInfoList[2] = {
            name: "单行业务事务",
            type: "tableSingle",
            info: info
          };

          this.breadcrumbList[2] = "单行业务事务";
          break;
        case "pageSignItem":
          this.isComponent = "pageSignItem"; // 单行业务事务下的定义页签
          this.breadcrumbList = this.breadcrumbList.slice(0, 3);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 3);
          this.breadcrumbInfoList[3] = {
            name: info.label,
            type: "pageSignItem",
            info: info
          };

          this.breadcrumbList[3] = info.label;
          break;
        case "pageSignItemForm":
          this.isComponent = "pageSignItemForm"; // 单行业务事务下的定义页签中的表单
          this.breadcrumbList = this.breadcrumbList.slice(0, 4);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 4);
          this.breadcrumbInfoList[4] = {
            name: info.label,
            type: "pageSignItemForm",
            info: info
          };

          this.breadcrumbList[4] = info.label;
          break;
        case "tableMultiple":
          this.isComponent = "tableMultiple"; // 多行业务事务
          this.breadcrumbList = this.breadcrumbList.slice(0, 2);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 2);
          this.breadcrumbInfoList[2] = {
            name: "多行业务事务",
            type: "tableMultiple",
            info: info
          };

          this.breadcrumbList[2] = "多行业务事务";
          break;
        case "tableMultipleItem":
          this.isComponent = "tableMultipleItem"; // 多行业务事务下表单
          this.breadcrumbList = this.breadcrumbList.slice(0, 3);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 3);
          this.breadcrumbInfoList[3] = {
            name: info.label,
            type: "tableMultipleItem",
            info: info
          };

          this.breadcrumbList[3] = info.label;
          break;
        case "leftColumn":
          this.isComponent = "leftColumn"; // 多行业务事务 左侧栏
          this.breadcrumbList = this.breadcrumbList.slice(0, 4);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 4);
          this.breadcrumbInfoList[4] = {
            name: info.label,
            type: "leftColumn",
            info: info
          };

          this.breadcrumbList[4] = info.label;
          this.showPageFlag = 0;
          break;
        case "businessTypeMultiple":
          this.isComponent = "businessType"; // 多行业务事务 业务类型
          this.breadcrumbList = this.breadcrumbList.slice(0, 4);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 4);
          this.breadcrumbInfoList[4] = {
            name: info.label,
            type: "businessTypeMultiple",
            info: info
          };

          this.breadcrumbList[4] = info.label;
          this.showPageFlag = 1;
          break;
        case "businessTypeMultipleItem":
          this.isComponent = "businessTypeMultipleItem"; // 多行业务事务 业务类型中子类
          this.breadcrumbList = this.breadcrumbList.slice(0, 5);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 5);
          this.breadcrumbInfoList[5] = {
            name: info.label,
            type: "businessTypeMultipleItem",
            info: info
          };

          this.breadcrumbList[5] = info.label;
          this.showPageFlag = 1;
          break;
        case "ruleStrategy":
          this.isComponent = "ruleStrategy";
          this.breadcrumbList = this.breadcrumbList.slice(0, 2);
          // 更新面包屑详情数组
          this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 2);
          this.breadcrumbInfoList[2] = {
            name: "规则策略",
            type: "ruleStrategy",
            info: info
          };

          this.breadcrumbList[2] = "规则策略";

          if (info.tab) {
            switch (info.tab) {
              case "disStrategy":
                this.tabActive = {
                  label: "分步策略",
                  name: "disStrategy"
                };
                break;
              case "printTemplate":
                this.tabActive = {
                  label: "打印模板",
                  name: "printTemplate"
                };
                break;
              case "validityCheck":
                this.tabActive = {
                  label: "有效性检查",
                  name: "validityCheck"
                };
                break;
              case "credentialRules":
                this.tabActive = {
                  label: "凭证规则",
                  name: "credentialRules"
                };
                break;
              case "subRrules":
                this.tabActive = {
                  label: "替代规则",
                  name: "subRrules"
                };
                break;
            }
          } else {
            this.tabActive = {
              label: "分步策略",
              name: "disStrategy"
            };
          }
      }
    },
    // 树形选中页面
    activePage(info) {
      // console.log('选中页面', info);
      this.activeInfo = info;
      // this.openTree = this.openTree ? false : true;

      this.breadcrumbList = this.breadcrumbList.slice(0, 2);
      this.breadcrumbInfoList = this.breadcrumbInfoList.slice(0, 2);

      var a = JSON.parse(JSON.stringify(this.breadcrumbList));
      var b = JSON.parse(JSON.stringify(this.breadcrumbInfoList));
      info.crumbs.forEach(item => {
        a.push(item.label);
        b.push(item);
      });

      this.breadcrumbList = a;
      this.breadcrumbInfoList = b;

      switch (info.type) {
        case "basicConfig":
          this.isComponent = "basicConfig";
          this.tabActive = {
            label: "业务情形",
            name: "businessCondition"
          };
          break;
        case "tableSingle":
          this.isComponent = "tableSingle"; // 单行业务事务
          break;
        case "pageSignItem":
          this.isComponent = "pageSignItem"; // 单行业务事务下的定义页签
          this.tabActive = {
            label: "页签定义",
            name: "basicParamList"
          };
          break;
        case "pageSignItemForm":
          this.isComponent = "pageSignItemForm"; // 单行业务事务下的定义页签中的表单
          this.tabActive = {
            label: "功能按钮",
            name: "functionBtn"
          };
          break;
        case "tableMultiple":
          this.isComponent = "tableMultiple"; // 多行业务事务
          break;
        case "tableMultipleItem":
          this.isComponent = "tableMultipleItem"; // 多行业务事务下表单
          break;
        case "leftColumn":
          this.isComponent = "leftColumn"; // 多行业务事务 左侧栏
          this.tabActive = {
            label: "按钮分配",
            name: "btnAssign"
          };
          this.showPageFlag = 0;
          break;
        case "businessTypeMultiple":
          this.isComponent = "businessType"; // 多行业务事务 业务类型
          this.showPageFlag = 1;
          break;
        case "businessTypeMultipleItem":
          this.isComponent = "businessTypeMultipleItem"; // 多行业务事务 业务类型中子类
          this.tabActive = {
            label: "功能按钮",
            name: "functionBtn"
          };
          this.showPageFlag = 1;
          break;
        case "ruleStrategy":
          this.isComponent = "ruleStrategy";

          if (info.tab) {
            switch (info.tab) {
              case "disStrategy":
                this.tabActive = {
                  label: "分步策略",
                  name: "disStrategy"
                };
                break;
              case "printTemplate":
                this.tabActive = {
                  label: "打印模板",
                  name: "printTemplate"
                };
                break;
              case "validityCheck":
                this.tabActive = {
                  label: "有效性检查",
                  name: "validityCheck"
                };
                break;
              case "credentialRules":
                this.tabActive = {
                  label: "凭证规则",
                  name: "credentialRules"
                };
                break;
              case "subRrules":
                this.tabActive = {
                  label: "替代规则",
                  name: "subRrules"
                };
                break;
            }
          } else {
            this.tabActive = {
              label: "分步策略",
              name: "disStrategy"
            };
          }
      }
    },
    // 获取最新面包屑
    getTabActive(list, item) {
      console.log("点击tab栏", list);
      this.$set(this.breadcrumbList, 3, list[3]);
      this.$set(this.breadcrumInfobList, 3, item);
    }
  }
};
</script>

<style lang="scss" scoped>
.businesBox {
  width: 100%;
  height: 100%;
  background: #dddee0;
  padding: 10px;
  box-sizing: border-box;
  /deep/ .el-dialog__wrapper {
    .el-dialog__header {
      display: block !important;
    }
    .el-dialog__body {
      padding: 30px 20px !important;
    }
  }
  .businesBoxContent {
    width: 100%;
    height: 100%;
    background: white;
    .header {
      height: 35px;
      padding: 0 10px;
      line-height: 35px;
      border-bottom: 1px solid #ccc;
      text-align: right;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .mianbaoxie {
        flex: 1;
        height: 40px;
        float: left;
        line-height: 40px;
        text-align: left;
        /deep/ .el-breadcrumb {
          display: inline-block;
          .el-breadcrumb__separator {
            color: black;
          }
          .el-breadcrumb__item {
            .el-breadcrumb__inner {
              font-weight: bold !important;
              font-size: 16px;
              color: #409eff;
            }
            &:first-child,
            &:nth-child(2) {
              .el-breadcrumb__inner {
                color: #606266;
              }
            }
          }
        }
      }
      .btn {
        display:flex;
        align-items: center;
        justify-content: space-between;
        width: 130px;
        /deep/ .el-button {
          font-size: 16px;
          color: #f56c6c;
          font-weight: bold;
        }
      }
    }
  }
}
</style>