<template>
  <div class="chart-bg" v-loading="loading">
    <div class="chart-wrapper chart-main">
      <div class="select-main">
        <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm">
          <el-form-item>
            <el-select
              v-model="ruleForm.bukrs"
              filterable
              clearable
              @change="companySelect"
              @clear="clearCompany"
              popper-class="chart-select"
              placeholder="请选择公司代码"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="ruleForm.werks"
              filterable
              clearable
              @change="werksSelect"
              @remove-tag="removeTag"
              popper-class="chart-select"
              placeholder="请选择工厂"
            >
              <el-option
                v-for="item in factoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-button icon="el-icon-search" circle @click="search"></el-button> -->
        </el-form>
      </div>
      <div class="chart-title">
        <h3>三一财务共享成本监控</h3>
      </div>
      <div class="chart-top">
        <div class="chart-left">
          <chart-left :difaccountMess="difaccountMess" :overaufnrMess="overaufnrMess" />
        </div>
        <div class="center">
          <chart-center :centerMessage="centerMessage" />
        </div>
        <div class="chart-right">
          <chart-right :wipaufnrData="wipaufnrData" :feedaufnrData="feedaufnrData" />
        </div>
      </div>

      <div class="bottom">
        <chart-bottom :subaufnrData="subaufnrData" />
      </div>

      <div class="chartFull">
        <img @click="fullHandler" src="@/assets/images/desktop/amplification.png" />
      </div>
      <!-- 全屏 -->
      <chart-full :visible.sync="hidden" alias="chart_notes" />
    </div>
  </div>
</template>

<script>
import { queryDataTable } from "@/api/platform/data/dataTemplate";
import { getButxt, getFactory } from "@/api/platform/monitor/monitor";
import {
  staticMessage,
  difaccount,
  overaufnr,
  wipaufnr,
  feedaufnr,
  subaufnr
} from "@/api/platform/screen/fullScreen";
import chartLeft from "./components/chart-left";
import chartRight from "./components/chart-right";
import chartCenter from "./components/chart-center";
import chartBottom from "./components/chart-bottom";
import chartFull from "./components/chart-full";
export default {
  props: {},
  data() {
    return {
      loading: true,
      hidden: false, // 全局组件是否显示
      ruleForm: {
        bukrs: "",
        werks: ""
      },
      factoryOptions: [], //工厂代码
      companyOptions: [], //公司代码
      rules: {
        bukrs: [
          { required: false, message: "请选择公司代码", trigger: "change" }
        ],
        werks: [
          {
            required: false,
            message: "请选择工厂",
            trigger: ["change"]
          }
        ]
      },
      centerMessage: [], //中间6个数据
      difaccountMess: [], //存货差异
      overaufnrMess: [], //完工订单
      wipaufnrData: [], //长期在制
      feedaufnrData: [], //投料率
      subaufnrData: [] //工序外协
    };
  },
  computed: {},
  created() {
    this.loadData();
  },
  mounted() {},
  watch: {
    hidden: {
      handler(val, oldVal) {},
      immediate: true
    }
  },
  methods: {
    fullHandler() {
      this.hidden = true;
    },
    //公司的选择
    companySelect(item) {
      this.factoryOptions = [];
      this.ruleForm.werks = "";
      getFactory({ bukrs: item }).then(response => {
        console.log(response);
        this.factoryOptions = response.data.map(item => {
          return {
            value: item.werks,
            label: item.name1
          };
        });
        this.factoryOptions.unshift({
          value: "",
          label: "全工厂"
        });
      });
    },
    //清空公司选择
    clearCompany() {
      this.factoryOptions = [];
    },
    //工厂的选择
    werksSelect() {
      this.getData();
    },
    //工厂的删除
    removeTag() {
      // this.getTableHeight();
    },
    //加载公司代码数据
    loadData() {
      queryDataTable({
        parameters: [
          {
            key: "dataTemplateKey",
            value: "REPORT_BUKRS"
          },
          {
            key: "Q^bukrs^SL",
            value: ""
          }
        ],
        requestPage: {
          pageNo: 1,
          limit: 9999,
          totalCount: null
        },
        sorts: [],
        extraParameters: {
          inputValue: "",
          fuzzyFields: ""
        }
      }).then(response => {
        this.companyOptions = response.data.dataResult
          .map(item => {
            return {
              value: item.bukrs,
              // label: item.butxt
              label: item.bukrs + "-" + item.butxt
            };
          })
          .reverse();
        this.getData();
        //console.log("获取公司代码数据", response);
      });
    },
    search() {
      this.getData();
    },

    getData() {
      this.loading = true;
      /* 中间的数据 */
      staticMessage({
        ...this.ruleForm
      }).then(response => {
        // console.log(response, "response");
        this.loading = false;
        this.centerMessage = response.data;
      });
      /* 左侧的数据 */
      difaccount({
        ...this.ruleForm
      }).then(response => {
        this.difaccountMess = response.data;
      });

      overaufnr({
        ...this.ruleForm
      }).then(response => {
        this.overaufnrMess = response.data;
      });

      /* 右侧的数据 */
      wipaufnr({
        ...this.ruleForm
      }).then(response => {
        // console.log(response, "response");
        this.wipaufnrData = response.data;
      });

      feedaufnr({
        ...this.ruleForm
      }).then(response => {
        //console.log(response, "response");
        this.feedaufnrData = response.data;
      });

      //下方 工序外协
      subaufnr({
        ...this.ruleForm
      }).then(response => {
        //  console.log(response, "response");
        this.subaufnrData = response.data;
      });
    }
  },
  components: {
    chartLeft,
    chartRight,
    chartBottom,
    chartCenter,
    chartFull
  }
};
</script>
<style lang="scss">
.chart-select .el-scrollbar {
  background: #0b102b;
  color: #068eae;
}
.chart-select .el-select-dropdown__item.hover,
.chart-select .el-select-dropdown__item:hover {
  color: #068eae;
  background: #0b102b;
}

/* 多选 */
.chart-select
  .el-select-dropdown.is-multiple
  .el-select-dropdown__item.selected {
  color: #068eae;
  background: #0b102b;
}

.chart-select
  .el-select-dropdown.is-multiple
  .el-select-dropdown__item.selected.hover {
  color: #068eae;
  background: #0b102b;
}

/* 空 */
.chart-select .el-select-dropdown__empty {
  background: #0b102b;
}
/* 边框 */
.chart-select {
  &.el-select-dropdown {
    border: 1px solid #434c61;
  }
}
</style>
<style scoped lang="scss">
.chart-bg {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("./images/chart-bg.png");
  background-size: 100% auto;

  .chart-wrapper {
    position: relative;
    width: 97%;
    height: 100%;
    margin: 0 20px;
    .select-main {
      position: absolute;
      left: 10px;
      top: 10px;
      /deep/ .el-input--small .el-input__inner {
        background: #0f3360;
      }
      /deep/ .el-input__inner {
        border: 1px solid #434c61;
      }
      /deep/ .el-tag.el-tag--info {
        background-color: #29295f;
      }
    }
    .chart-title {
      display: flex;
      justify-content: space-around;
      height: 10%;
      width: 100%;
      background: url("./images/header.png");
      background-size: 100% 100%;
      align-items: center;
      > h3 {
        font-size: 25px;
        //color: #fff;
        background-image: -webkit-linear-gradient(right, #108ad4, #0ecae3);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
      }
    }
    .chart-top {
      height: 60%;
      display: flex;
      justify-content: space-around;
      .chart-left {
        width: 30%;
        height: 100%;
      }
      .chart-right {
        width: 35%;
        height: 100%;
      }
      .center {
        width: 35%;
        height: 100%;
      }
    }

    .bottom {
      width: 100%;
      height: 30%;
      overflow: hidden;
    }

    .chartFull {
      position: absolute;
      width: 15px;
      height: 15px;
      z-index: 9999;
      right: 5px;
      top: 5px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

