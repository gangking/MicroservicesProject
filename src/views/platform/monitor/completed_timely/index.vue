<template>
  <div class="bg" id="timely" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>完工订单及时性</span>
    </div>-->

    <div class="header-btn" id="timely-btn1">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="handler('export')">导出</el-button>
          <el-button type="primary" @click="handler('save')">保存</el-button>
        </div>
        <div class="btn-right">
          <el-button type="success" @click="send">发送</el-button>
        </div>
      </div>
    </div>
    <div id="timely-input1" class="header-input">
      <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="80px">
        <el-form-item label="公司代码" prop="bukrs">
          <el-select
            v-model="ruleForm.bukrs"
            filterable
            clearable
            @change="companySelect"
            @clear="clearCompany"
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

        <el-form-item label="工厂" prop="werks">
          <el-select
            v-model="ruleForm.werks"
            filterable
            multiple
            @change="werksSelect"
            @remove-tag="removeTag"
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

        <el-form-item label="财年" prop="gjahr">
          <el-date-picker
            v-model="ruleForm.gjahr"
            value-format="yyyy"
            type="year"
            placeholder="选择财年"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="期间" prop="monat">
          <el-select v-model="ruleForm.monat" clearable placeholder="请选择期间">
           <el-option label="01" value="01"></el-option>
            <el-option label="02" value="02"></el-option>
            <el-option label="03" value="03"></el-option>
            <el-option label="04" value="04"></el-option>
            <el-option label="05" value="05"></el-option>
            <el-option label="06" value="06"></el-option>
            <el-option label="07" value="07"></el-option>
            <el-option label="08" value="08"></el-option>
            <el-option label="09" value="09"></el-option>
            <el-option label="10" value="10"></el-option>
            <el-option label="11" value="11"></el-option>
            <el-option label="12" value="12"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="原因分类" prop="classification">
          <el-select v-model="ruleForm.classification" placeholder="请选择原因分类">
            <el-option
              v-for="item in reasonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker v-model="ruleForm.createTime" type="date" placeholder="创建时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="剔除考核" prop="assessment" class="checkBox">
          <el-checkbox v-model="ruleForm.assessment"></el-checkbox>
        </el-form-item>
        <el-form-item label="版本号" prop="zgxjkbbh">
          <el-input v-model="ruleForm.zgxjkbbh" placeholder="请输入版本号"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!--  -->
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        :height="height"
        :data="tableData"
        border
        highlight-current-row
        v-loading="loading"
        tooltip-effect="dark"
        @section-change="selection"
        style="width: 100%"
      >
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop="werks" label="工厂"></el-table-column>

        <el-table-column prop="auart" label="订单类型"></el-table-column>
        <el-table-column prop="aufnr" label="订单号"></el-table-column>

        <el-table-column prop="matnr" label="物料"></el-table-column>
        <el-table-column prop="maktx" label="物料描述"></el-table-column>
        <el-table-column prop="stat" label="系统状态" width="150"></el-table-column>

        <el-table-column prop="gamng" label="目标数量"></el-table-column>
        <el-table-column prop="wemng" label="交货数量"></el-table-column>
        <el-table-column prop="gmein" label="基本单位"></el-table-column>

        <el-table-column prop="ernam" label="输入者"></el-table-column>
        <el-table-column prop="aenam" label="最后修改者"></el-table-column>
        <el-table-column label="实际下达日期" width="100">
          <template slot-scope="scope">{{transformTime(scope.row.ftrmi)}}</template>
        </el-table-column>

        <el-table-column prop="istkostG" label="订单金额"></el-table-column>
        <el-table-column prop="zcqts" label="超期天数"></el-table-column>
        <el-table-column label="查询日期" width="100">
          <template slot-scope="scope">{{transformTime(scope.row.zdate)}}</template>
        </el-table-column>

        <el-table-column prop="zuser" label="责任人"></el-table-column>
        <el-table-column prop="csign" label="颜色高亮标识"></el-table-column>
        <el-table-column prop="gjahr" label="财年"></el-table-column>
        <el-table-column prop="monat" label="期间"></el-table-column>
        <el-table-column label="原因分类" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.classification" placeholder="请选择原因分类">
              <el-option
                v-for="item in reasonOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>x
        <el-table-column label="原因分析" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.analysis" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否剔除考核" width="150">
          <template slot="header" slot-scope="scope">
            <el-button type="info" @click="handler('assess')">剔除考核</el-button>
          </template>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.assessment">剔除考核</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" id="timely-footer1">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getButxt,
  getFactory,
  sendTimely,
  searchTimely
} from "@/api/platform/monitor/monitor";
import { downTimely, saveTimely } from "@/api/platform/monitor/monHandle";
import fecha from "@/utils/fecha";
import ActionUtils from "@/utils/action";
export default {
  props: {
    monitorDetailObj: {
      type: Object,
      value: () => {}
    }
  },
  data() {
    return {
      reasonOptions: [
        {
          value: "1",
          label: "未及时完工"
        },
        {
          value: "2",
          label: "未及时收货"
        },
        {
          value: "3",
          label: "其他"
        }
      ],
      toggle: false,
      loading: false,
      bgLoading: false,
      ruleForm: {
        bukrs: "",
        werks: [],
        gjahr: "",
        monat: "",
        classification: "",
        createTime: "",
        assessment: false,
        zgxjkbbh: ""
      },
      rules: {
        bukrs: [
          { required: true, message: "请选择公司代码", trigger: "change" }
        ],
        werks: [
          {
            required: true,
            message: "请选择工厂",
            trigger: ["change"],
            type: "array"
          }
        ]
        // gjahr: [{ required: true, message: "请选择财年", trigger: "change" }],
        // monat: [{ required: true, message: "请选择期间", trigger: "change" }]
      },
      companyOptions: [], //公司代码
      factoryOptions: [], // 工厂代码
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0
    };
  },
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.getTableHeight();
    }, 100);
    window.addEventListener(
      "resize",
      () => {
        this.getTableHeight();
      },
      false
    );
    this.loadData();
  },
  watch: {
    tableData: {
      handler(val, oldVal) {
        console.log(val, "表格数据变化");
      },
      deep: true
    },
    monitorDetailObj: {
      handler(val, oldVal) {
        this.ruleForm.bukrs = val.bukrs;
        this.ruleForm.gjahr = val.year;
        this.ruleForm.monat = val.month;
        this.ruleForm.zgxjkbbh = val.zgxjkbbh;
        this.ruleForm.werks.push(val.werks);
        //公司选择
        this.companySelect(val.bukrs);
        // 加载表格
        this.getTable();
      },
      immediate: true
    }
  },
  methods: {
    handler(command) {
      switch (command) {
        case "export":
          this.export();
          break;
        case "edit":
          break;
        case "save":
          this.save();
          break;
        case "assess":
          this.assessToggle();
          break;
        default:
          break;
      }
    },
    // 保存数据
    save() {
      this.loading = true;
      saveTimely(this.tableData)
        .then(response => {
          this.getTable();
        })
        .catch(response => {
          this.loading = false;
        });
    },
    // 导出
    export() {
      let params = {
        parameters: []
        // requestPage: {
        //   limit: this.pageSize || limit,
        //   pageNo: this.currentPage || pageno
        // },
        // sorts: []
      };
      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          if (element) {
            var strKey = "Q^";
            var strValue = "";
            if (Array.isArray(element)) {
              strKey = strKey + key + "^SIN";
              strValue = element.join(",");
            } else {
              strKey = strKey + key + "^S";
              strValue = element;
            }
            params.parameters.push({
              key: strKey,
              value: strValue
            });
          }
        }
      }
      downTimely(params)
        .then(response => {
          console.log(response);
          if (response) {
            ActionUtils.exportFile(
              response.data,
              fecha.formatDate("yyyyMMddHHmmss") + ".xls"
            );
          }
        })
        .catch(req => {
          console.log("下载失败");
        });
    },
    //搜索
    search() {
      // this.$set(this.rules["monat"][0], "required", false);
      this.$refs.ruleForm.clearValidate();
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.getTable();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //发送
    send() {
      this.$refs.ruleForm.clearValidate();
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.bgLoading = true;
          sendTimely(this.ruleForm)
            .then(response => {
              this.bgLoading = false;
              if (response.state == 200) {
                this.$message({
                  message: response.message || "发送成功",
                  type: "success"
                });
              }
            })
            .catch(response => {
              this.$message({
                message: response.message || "发送失败",
                type: "error"
              });
              console.log("发送失败");
              this.bgLoading = false;
            });

          // this.getTable();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //公司的选择
    companySelect(item) {
      this.factoryOptions = [];
      getFactory({ bukrs: item }).then(response => {
        console.log(response);
        this.factoryOptions = response.data.map(item => {
          return {
            value: item.werks,
            label: item.name1
          };
        });
      });
    },
    //清空公司选择
    clearCompany() {
      this.factoryOptions = [];
    },
    //工厂的选择
    werksSelect() {
      this.getTableHeight();
    },
    //工厂的删除
    removeTag() {
      this.getTableHeight();
    },

    //加载公司代码数据
    loadData() {
      getButxt().then(response => {
        this.companyOptions = response.data.map(item => {
          return {
            value: item.bukrs,
            // label: item.butxt
            label: item.bukrs
          };
        });
        console.log("获取公司代码数据", response);
      });
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      let params = {
        parameters: [],
        requestPage: {
          limit: this.pageSize || limit,
          pageNo: this.currentPage || pageno
        },
        sorts: []
      };

      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          // changed by dingdx 2019-12-06
          if (element) {
            var strKey = "Q^";
            var strValue = "";
            if (Array.isArray(element)) {
              strKey = strKey + key + "^SIN";
              strValue = element.join(",");
            } else {
              strKey = strKey + key + "^S";
              strValue = element;
            }
            params.parameters.push({
              key: strKey,
              value: strValue
            });
          }
        }
      }
      this.getTableHeight();
      console.log(params, "参数params");
      searchTimely(params).then(response => {
        this.loading = false;
        this.tableData = response.data.dataResult;
        this.totalCount = response.data.pageResult.totalCount;
      });
    },
    //计算中间table高度
    getTableHeight() {
      if (document.querySelector("#timely")) {
        let height = document.querySelector("#timely").clientHeight;
        // console.log(height, "height整体");
        let btnHeight = document.querySelector("#timely .header-btn")
          .clientHeight;
        // console.log(btnHeight, "btnHeight整体");
        let inputHeight = document.querySelector("#timely .header-input")
          .clientHeight;
        //console.log(inputHeight, "inputHeight中间的输入框");
        let footerHeight = document.querySelector("#timely .footer")
          .clientHeight;
        this.height = height - btnHeight - inputHeight - footerHeight;
        //  console.log(this.height);
      }
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTable();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTable();
    },
    transformTime(timestamp) {
      if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours(); // 小时 (0 ~ 23)
        var m = time.getMinutes(); // 分钟 (0 ~ 59)
        var s = time.getSeconds(); // 秒数 (0 ~ 59)
        // return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
        return y + "-" + M + "-" + d;
      } else {
        return "";
      }
    },
    //是否剔除考核切换
    assessToggle() {
      this.tableData.forEach((item, index) => {
        if (this.toggle) {
          this.$set(item, "assessment", false);
        } else {
          this.$set(item, "assessment", true);
        }
      });
      this.toggle = !this.toggle;
    }
  },
  components: {},
  destroyed() {
    window.removeEventListener("resize", this.getTableHeight);
  }
};
</script>

<style scoped lang="scss">
.bg {
  height: 100%;
  background: #fff;
  .header-btn {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
    .btn-left {
      float: left;
    }
    .btn-right {
      float: right;
      padding-right: 10px;
    }
  }
  .header-input {
    padding: 5px;
    border: 1px solid #ebeef5;
  }
  .footer {
    padding: 5px 0;
    border-top: 1px solid #dcdfe6;
    background: #fff;
  }
}
.checkBox /deep/ .el-form-item__content {
  width: 220px;
}
// /deep/ .el-loading-spinner .circular {
//   width: 80px;
//   height: 80px;
// }
</style>
