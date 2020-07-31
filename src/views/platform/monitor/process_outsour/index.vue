<template>
  <div class="bg" id="outsour" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>工序外协</span>
    </div>-->

    <div class="header-btn">
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
    <div class="header-input">
      <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="92px">
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

        <!-- <el-form-item label="财年" prop="gjahr">
          <el-date-picker
            v-model="ruleForm.gjahr"
            value-format="yyyy"
            type="year"
            placeholder="选择财年"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="期间" prop="monat">
          <el-select v-model="ruleForm.monat" clearable placeholder="请选择期间">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
            <el-option label="6" value="6"></el-option>
            <el-option label="7" value="7"></el-option>
            <el-option label="8" value="8"></el-option>
            <el-option label="9" value="9"></el-option>
            <el-option label="10" value="10"></el-option>
            <el-option label="11" value="11"></el-option>
            <el-option label="12" value="12"></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="生产订单">
          <el-col :span="11">
            <el-form-item prop="aufnr1">
              <el-input v-model="ruleForm.aufnr1" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item prop="aufnr2">
              <el-input v-model="ruleForm.aufnr2" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="采购订单">
          <el-col :span="11">
            <el-form-item prop="ebeln1">
              <el-input v-model="ruleForm.ebeln1 " type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item prop="ebeln2">
              <el-input v-model="ruleForm.ebeln2" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="供应商编码">
          <el-col :span="11">
            <el-form-item prop="lifnr1">
              <el-input v-model="ruleForm.lifnr1 " type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item prop="lifnr2">
              <el-input v-model="ruleForm.lifnr2" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="创建日期" prop="aedat">
          <el-date-picker
            v-model="ruleForm.aedat"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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

        <el-table-column prop="aufnr" label="生产订单"></el-table-column>
        <el-table-column prop="matnr" label="物料编码"></el-table-column>
        <el-table-column prop="maktx" label="物料名称"></el-table-column>
        <el-table-column prop="maktx" label="物料描述"></el-table-column>
        <el-table-column prop="sttxt" label="订单状态"></el-table-column>
        <el-table-column prop="ebeln" label="采购订单"></el-table-column>
        <el-table-column prop="ebelp" label="采购项目"></el-table-column>
        <el-table-column prop="elikz" label="交货已完成"></el-table-column>
        <el-table-column prop="loekz" label="删除标识"></el-table-column>
        <el-table-column prop="banfn" label="采购申请编号"></el-table-column>
        <el-table-column prop="bnfpo" label="采购申请的项目编号"></el-table-column>
        <el-table-column prop="lifnr" label="供应商编码"></el-table-column>
        <el-table-column prop="waers" label="币别"></el-table-column>
        <el-table-column prop="name1" label="供应商名称"></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{transformTime(scope.row.aedat)}}</template>
        </el-table-column>
        <el-table-column label="交货日期">
          <template slot-scope="scope">{{transformTime(scope.row.eindt)}}</template>
        </el-table-column>
        <el-table-column prop="txz01" label="短文本"></el-table-column>
        <el-table-column prop="menge" label="订单数量"></el-table-column>
        <el-table-column prop="netpr" label="订单净价"></el-table-column>
        <el-table-column prop="bpmng" label="收货数量"></el-table-column>
        <el-table-column prop="thmng" label="退货数量"></el-table-column>
        <el-table-column prop="bzmng" label="报账数量"></el-table-column>
        <el-table-column prop="cymng" label="差异数量"></el-table-column>
        <el-table-column prop="sjwxl" label="实际外协"></el-table-column>
        <el-table-column prop="jhwxl" label="计划外协"></el-table-column>
        <el-table-column prop="cywxl" label="外协差异"></el-table-column>
        <el-table-column prop="plnfl" label="外协对应订单顺序"></el-table-column>
        <el-table-column prop="vornr" label="外协对应订单工序号"></el-table-column>
        <el-table-column label="实际外协回司时间">
          <template slot-scope="scope">{{transformTime(scope.row.budat)}}</template>
        </el-table-column>
        <el-table-column prop="CSIGN" label="颜色高亮标识"></el-table-column>
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
        </el-table-column>
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
    <div class="footer">
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
  sendOutsour,
  searchOutsour
} from "@/api/platform/monitor/monitor";
import { downOutsour, saveOutsour } from "@/api/platform/monitor/monHandle";
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
    var validateAufnr1 = (rule, value, callback) => {
      if (this.ruleForm.aufnr2 != "" && value === "") {
        callback(new Error("请输入生产订单开始"));
      } else {
        callback();
      }
    };
    var validateEbeln1 = (rule, value, callback) => {
      if (this.ruleForm.ebeln2 != "" && value === "") {
        callback(new Error("请输入采购订单开始"));
      } else {
        callback();
      }
    };
    var validateLifnr1 = (rule, value, callback) => {
      if (this.ruleForm.lifnr2 != "" && value === "") {
        callback(new Error("请输入供应商开始"));
      } else {
        callback();
      }
    };

    return {
      reasonOptions: [
        {
          value: "1",
          label: "实物已收货系统未收货"
        },
        {
          value: "2",
          label: "供应商产能不足"
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
        // gjahr: "",
        // monat: "",
        aufnr: "",
        aufnr1: "",
        aufnr2: "",
        ebeln: "",
        ebeln1: "",
        ebeln2: "",
        lifnr: "",
        lifnr1: "",
        lifnr2: "",
        aedat: [],
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
            trigger: ["blur"],
            type: "array"
          }
        ],
        // gjahr: [{ required: true, message: "请选择财年", trigger: "change" }],
        // monat: [{ required: true, message: "请选择期间", trigger: "change" }],
        aufnr1: [{ validator: validateAufnr1, trigger: "blur" }],
        ebeln1: [{ validator: validateEbeln1, trigger: "blur" }],
        lifnr1: [{ validator: validateLifnr1, trigger: "blur" }]
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
    monitorDetailObj: {
      handler(val, oldVal) {
        this.ruleForm.bukrs = val.bukrs;
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
      saveOutsour(this.tableData)
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
      downOutsour(params)
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
      // this.$set(this.rules["monat"][0], "required", true);
      this.$refs.ruleForm.clearValidate();
      let sendObj = {};
      let paramsArr = [
        "bukrs",
        "werks",
        // "gjahr",
        // "monat",
        "aufnr",
        "ebeln",
        "lifnr",
        "aedat",
        "classification",
        "createTime",
        "assessment",
        "zgxjkbbh"
      ];
      for (const key in this.ruleForm) {
        const element = this.ruleForm[key];
        if (paramsArr.includes(key)) {
          if (key == "aufnr" || key == "ebeln" || key == "lifnr") {
            if (this.ruleForm[key + 1]) {
              if (this.ruleForm[key + 2]) {
                sendObj[key] = `${this.ruleForm[key + 1]}~${
                  this.ruleForm[key + 2]
                }`;
              } else {
                sendObj[key] = this.ruleForm[key + 1];
              }
            }
          } else if (key == "aedat") {
            sendObj.aedat = this.ruleForm.aedat.join("~");
          } else {
            sendObj[key] = element;
          }
        }
      }

      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.bgLoading = true;
          sendOutsour(sendObj)
            .then(response => {
              console.log(response);
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

          //this.getTable();
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
      let paramsArr = [
        "bukrs",
        "werks",
        // "gjahr",
        // "monat",
        "aufnr",
        "ebeln",
        "lifnr",
        "aedat"
      ];
      for (const key in this.ruleForm) {
        const element = this.ruleForm[key];
        // changed by dingdx 2019-12-06
        if (paramsArr.includes(key)) {
          if (key == "aufnr" || key == "ebeln" || key == "lifnr") {
            if (this.ruleForm[key + 1]) {
              if (this.ruleForm[key + 2]) {
                params.parameters.push({
                  key: "Q^" + key + "^SGE",
                  value: `${this.ruleForm[key + 1]}`
                });
                params.parameters.push({
                  key: "Q^" + key + "^SLE",
                  value: `${this.ruleForm[key + 2]}`
                });
              } else {
                params.parameters.push({
                  key: "Q^" + key + "^S",
                  value: this.ruleForm[key + 1]
                });
              }
            }
          }
          if (element) {
            var strKey = "";
            var strValue = "";
            if (Array.isArray(element)) {
              if (key == "aedat") {
                params.parameters.push({
                  key: "Q^" + key + "^DL",
                  value: element[0]
                });
                params.parameters.push({
                  key: "Q^" + key + "^DG",
                  value: element[1]
                });
                continue;
              }
              if (element.length == 1) {
                strKey = "Q^" + key + "^S";
                strValue = element[0];
              } else {
                strKey = "Q^" + key + "^SIN";
                strValue = element.join(",");
              }
            } else {
              strKey = "Q^" + key + "^S";
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
      searchOutsour(params).then(response => {
        this.loading = false;

        this.tableData = response.data.dataResult;
        this.totalCount = response.data.pageResult.totalCount;
      });
    },
    //计算中间table高度
    getTableHeight() {
      if (document.querySelector("#outsour")) {
        let height = document.querySelector("#outsour").clientHeight;
        // console.log(height, "height整体");
        let btnHeight = document.querySelector("#outsour .header-btn")
          .clientHeight;
        // console.log(btnHeight, "btnHeight整体");
        let inputHeight = document.querySelector("#outsour .header-input")
          .clientHeight;
        //console.log(inputHeight, "inputHeight中间的输入框");
        let footerHeight = document.querySelector("#outsour .footer")
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
    height: 45px;
    line-height: 45px;
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
/deep/ .el-select__tags {
  white-space: nowrap;
  overflow: hidden;
}
// /deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
//   margin-bottom: 6px;
// }
.checkBox /deep/ .el-form-item__content {
  width: 220px;
}
// /deep/ .el-loading-spinner .circular {
//   width: 80px;
//   height: 80px;
// }
</style>
