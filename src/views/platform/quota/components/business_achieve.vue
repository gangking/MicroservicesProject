<template>
  <div>
    <div class="header-btn" ref="headerBtn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <el-button type="primary" @click="handler('reset')">重置</el-button>
          <el-button type="primary" @click="handler('exportExcel')">导出表格</el-button>
        </div>
      </div>
    </div>
    <div class="header-input" ref="headerInput">
      <el-form
        :model="ruleForm"
        :rules="rules"
        class="form-content"
        :inline="true"
        ref="ruleForm"
        label-width="90px"
      >
        <el-form-item label="期间" prop="times" class="form-item">
          <el-date-picker
            v-model="ruleForm.times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="业务场景" class="form-item" prop="bsCode">
          <el-select
            v-model="ruleForm.bs_CODE"
            filterable
            clearable
            multiple
            collapse-tags
            @change="changeHeight"
            placeholder="请选择业务场景"
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button style="width: 100%" @click="bscodeAllChoice">全选</el-button>
              </el-col>
              <el-col :span="11">
                <el-button style="width: 100%" @click="bscodeCancelChoice">取消全选</el-button>
              </el-col>
            </el-row>
            <el-option
              v-for="(item,index) in bsCodeOptions"
              :key="item.value+index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="事业部" class="form-item" prop="orgtext">
          <el-select
            v-model="ruleForm.orgtext"
            filterable
            clearable
            multiple
            @change="changeHeight"
            placeholder="请选择事业部"
          >
            <el-option
              v-for="item in orgtextOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公司代码" class="form-item" prop="bukrs">
          <el-select
            v-model="ruleForm.bukrs"
            filterable
            clearable
            multiple
            @change="changeHeight"
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

        <el-form-item label="流程节点" class="form-item" prop="lcjd">
          <el-select v-model="ruleForm.lcjd" filterable clearable multiple placeholder="请选择流程节点">
            <el-option
              v-for="item in lcjdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="流程人员" class="form-item" prop="lcry">
          <div @click="personSelect">
            <el-input
              v-model="ruleForm.person"
              clearable
              @clear="clearPerson"
              placeholder="请选择流程人员"
            ></el-input>
          </div>

          <!-- <person-selector1 /> -->
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
        <el-table-column prop="bscode" label="业务场景"></el-table-column>
        <el-table-column prop="orgtext" label="事业部"></el-table-column>
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop="bpmnCode" label="流程节点"></el-table-column>
        <el-table-column prop="clr" label="处理人"></el-table-column>
        <el-table-column prop="group1" label="所属一级小组"></el-table-column>
        <el-table-column prop="group2" label="所属二级小组"></el-table-column>
        <el-table-column prop="group3" label="所属三级小组"></el-table-column>

        <el-table-column prop="pjmdclsc" label="平均每单处理时长"></el-table-column>
        <el-table-column prop="clsxl" label="处理时效率"></el-table-column>
        <el-table-column prop="mdzrsc" label="每单自然时长"></el-table-column>
        <el-table-column prop="jqdjl" label="加签单据量"></el-table-column>
        <el-table-column prop="jqdjzgsc" label="加签单据最高时长"></el-table-column>
        <el-table-column prop="jqdczdsc" label="加签单据最低时长"></el-table-column>
        <el-table-column prop="jqdjpjsc" label="加签单据平均时长"></el-table-column>
        <el-table-column prop="ckdjzzts" label="库存单据周转天数"></el-table-column>
      </el-table>
    </div>
    <div class="footer" ref="footer">
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

    <person-selector
      :visible.sync="selectorVisible"
      @selectHandle="selectorData"
      @close="visible=>selectorVisible =visible"
    />
  </div>
</template>

<script>
import {
  getButxt,
  getbBCode,
  getOrgtext,
  getProcessCode,
  getProcessPerson,
  businAchSearch
} from "@/api/platform/quato/quato";
import personSelector from "@/views/platform/quota/components/person_selector";
import personSelector1 from "@/components/ibps-selector/selector";
export default {
  props: {
    quotaHeight: {
      type: Number,
      default: 300
    }
  },
  components: {
    personSelector,
    personSelector1
  },
  data() {
    var validateLcjd = (rule, value, callback) => {
      if (value.length == 0 && this.ruleForm.lcry.length == 0) {
        callback(new Error("流程节点和流程人员不能全部为空"));
      } else {
        callback();
      }
    };
    var validateLcry = (rule, value, callback) => {
      if (value.length == 0 && this.ruleForm.lcjd.length == 0) {
        callback(new Error("流程节点和流程人员不能全部为空"));
      } else {
        callback();
      }
    };
    return {
      selectorVisible: false,
      bsCodeOptions: [], //业务场景
      companyOptions: [], //公司代码
      orgtextOptions: [], //事业部
      lcjdOptions: [], //流程节点
      lcryOptions: [], //流程节点
      loading: false,
      bgLoading: false,
      ruleForm: {
        times: [], //期间
        // startTime: "", //开始时间
        // endTime: "", //结束时间
        bs_CODE: [], //	业务场景ID
        orgtext: [], //	事业部
        bukrs: [], //	公司代码
        lcjd: [], //流程节点
        lcry: [], //流程人员
        person: ""
      },
      rules: {
        times: [{ required: true, message: "请选择期间", trigger: "change" }],
        lcjd: [{ validator: validateLcjd, trigger: "change" }],
        lcry: [{ validator: validateLcry, trigger: "change" }]
      },
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 100
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.loadData();
  },
  watch: {
    quotaHeight: {
      handler(val) {
        this.computedHeight();
      },
      immediate: true
    }
  },
  methods: {
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "reset":
          this.$refs["ruleForm"].resetFields();
          this.ruleForm.times = [];
          break;
        case "exportExcel":
          console.log("导出表格");
          break;
        default:
          break;
      }
    },
    //业务场景全选
    bscodeAllChoice() {
      this.ruleForm.bs_CODE = this.bsCodeOptions.map(item => {
        return item.value;
      });
    },
    //业务场景取消全选
    bscodeCancelChoice() {
      this.ruleForm.bs_CODE = [];
    },
    //人员选择的数据
    selectorData(data) {
      let copyArr = [];
      data.forEach(item => {
        this.ruleForm.lcry.push(item.userno);
        copyArr.push(item.name);
      });
      this.ruleForm.person = copyArr.join(",");
    },
    //人员的清空
    clearPerson() {
      this.ruleForm.lcry = [];
      this.ruleForm.person = "";
    },
    personSelect() {
      this.selectorVisible = true;
    },
    changeHeight() {
      this.computedHeight();
    },

    computedHeight() {
      setTimeout(() => {
        this.height =
          this.quotaHeight -
          this.$refs.headerBtn.clientHeight -
          this.$refs.headerInput.clientHeight -
          this.$refs.footer.clientHeight;
      }, 30);
    },

    //日期装换
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
    //搜索
    search() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.getTable();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //公司的选择
    companySelect(item) {
      console.log(item);
    },
    //清空公司选择
    clearCompany() {
      this.factoryOptions = [];
    },
    //加载选择数据
    loadData() {
      // 事业部
      getOrgtext().then(response => {
        this.orgtextOptions = response.data
          .map(item => {
            return {
              value: item,
              label: item
            };
          })
          .filter(item => {
            return item;
          });
      });
      //  业务场景
      getbBCode().then(response => {
        this.bsCodeOptions = response.data
          .map(item => {
            if (item && item != null) {
              return {
                value: item["BS_CODE_"],
                label: item["BS_DESCRIBE_"]
              };
            }
          })
          .filter(item => {
            return item;
          });

        // this.bsCodeOptions.splice(0, 0, {
        //   value: "all",
        //   label: "全部业务场景"
        // });
      });
      //公司代码
      getButxt().then(response => {
        this.companyOptions = response.data.map(item => {
          return {
            value: item.bukrs,
            label: item.bukrs
          };
        });
      });

      //流程节点
      getProcessCode().then(response => {
        this.lcjdOptions = response.data.map(item => {
          return {
            value: item.CATEGORY,
            label: item.CATEGORY_DESC
          };
        });
      });
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      let params = {};
      for (const key in this.ruleForm) {
        const element = this.ruleForm[key];
        if (element) {
          if (key == "times") {
            params["startTime"] = this.ruleForm.times[0] + " 00:00:00";
            params["endTime"] = this.ruleForm.times[1] + " 24:00:00";
          } else if (key == "person") {
          } else {
            params[key] = element;
          }
        }
      }
      this.computedHeight();
      businAchSearch(params).then(response => {
        this.loading = false;
        this.tableData = response.data;
        this.totalCount = response.data.length;
      });
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
.form-content {
  .form-item {
    width: 48%;
    /deep/ .el-form-item {
      margin-right: 0px;
    }
  }
}
/deep/ .el-row {
  margin: 0;
}
</style>
