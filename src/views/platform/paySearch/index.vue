<template>
  <div class="tis" id="tis">
    <div class="header-btn" id="header-btn">
      <el-button type="primary" @click="handle('search')">搜索</el-button>
      <!-- <el-button type="primary" @click="handle('save')">保存</el-button>
      <el-button type="primary" @click="handle('upData')">更新</el-button>
      <el-button type="primary" @click="handle('abolish')">作废</el-button>
      <el-button type="primary" @click="handle('sendTis')">发送TIS</el-button>-->
      <el-button type="primary" @click="handle('exportExcel')">导出Excel</el-button>
    </div>
    <div class="header-input" id="header-input">
      <el-form :inline="true" :model="formInline" class="demwo-form-inline">
        <el-form-item label="公司代码">
          <el-input v-model="formInline['Q^BUKRS_^SL']" clearable placeholder="公司代码"></el-input>
        </el-form-item>
        <el-form-item label="单据编号" width="150">
          <el-input v-model="formInline['Q^DOC_NUMBER_^SL']" clearable placeholder="单据编号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="制单人工号">
          <el-input v-model="formInline.user3" clearable placeholder="制单人工号"></el-input>
        </el-form-item>-->

        <el-form-item label="财务经办人工号">
          <el-input v-model="formInline['Q^ZCWJBR_^SL']" clearable placeholder="财务经办人工号"></el-input>
        </el-form-item>
        <el-form-item label="推送日期">
          <el-date-picker
            v-model="formInline['Q^PUSH_DATE_^SL']"
            type="date"
            clearable
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="付款指令状态">
          <el-select v-model="formInline['Q^PAY_ZDJZT_^SL']" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="bukrs" label="公司代码" width="120"></el-table-column>
        <el-table-column prop="butxt" label="公司名称" width="180"></el-table-column>

        <el-table-column prop="docNumber" label="单据编号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zywdh" label="业务申请单号" width="170"></el-table-column>
        <el-table-column prop="USERID1111111111111" v-if="false" label="制单人工号"></el-table-column>
        <el-table-column prop="username" label="制单人姓名"></el-table-column>
        <el-table-column prop="zcwjbr" label="财务经办人工号"></el-table-column>
        <el-table-column prop="zcwjbrname" label="财务经办人姓名"></el-table-column>

        <el-table-column prop="pushDate" label="推送日期" width="120"></el-table-column>
        <el-table-column prop="zfkzh" label="付款账户"></el-table-column>
        <el-table-column prop="zfkfs" label="付款方式" width="140"></el-table-column>
        <el-table-column porp="zqwfkr" label="期望付款日" width="140"></el-table-column>
        <el-table-column prop="zjyfdm" label="收款方代码" width="120"></el-table-column>
        <el-table-column prop="zjyfmc" label="收款方名称" width="180"></el-table-column>

        <el-table-column prop="zbankaSk" label="收款单位开户行名称" width="180"></el-table-column>
        <el-table-column prop="zbanknSk" label="收款银行账号" width="180"></el-table-column>
        <el-table-column prop="zjyfxz" v-if="false" label width="0"></el-table-column>
        <el-table-column prop="zkoinhSk" label="收款账户名称" width="180"></el-table-column>
        <el-table-column prop="zdgds" label="对公对私标识"></el-table-column>
        <el-table-column prop="zbanklSk" label="收款联行号" width="120"></el-table-column>

        <el-table-column prop="gsber" label="业务范围" width="140"></el-table-column>

        <el-table-column prop="umskz" label="特别总账标识" width="140"></el-table-column>
        <el-table-column prop="ztbdh" label="资金计划提报单" width="120"></el-table-column>
        <el-table-column prop="zaccid" label="资金计划项目" width="120"></el-table-column>
        <el-table-column prop="zusage" label="用途" width="120"></el-table-column>
        <el-table-column prop="zfuyan" label="附言" width="120"></el-table-column>
        <el-table-column prop="zktxt" label="摘要" width="120"></el-table-column>

        <el-table-column prop="payDescribe" label="付款指令状态" width="120"></el-table-column>
        <el-table-column prop="zmsg" label="单据状态描述" width="180"></el-table-column>
      </el-table>
    </div>
    <div class="footer" id="tis-footer">
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
import ActionUtils from "@/utils/action";
import {
  queryPageList,
  downTisExcel
} from "@/api/platform/paySearch/paySearch";
import tisSelect from "./mixins/select";
import fecha from "@/utils/fecha";

export default {
  props: {},
  data() {
    return {
      loading: false,
      payMode: [],
      options: [
        {
          value: "01",
          label: "待发送"
        },
        {
          value: "02",
          label: "已发送"
        },
        // {
        //   value: '03',
        //   label: '支付中'
        // },

        {
          value: "04",
          label: "支付成功"
        },
        {
          value: "05",
          label: "业务作废"
        },
        {
          value: "06",
          label: "资金作废"
        },
        {
          value: "07",
          label: "支付退回"
        }
      ],
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0,
      tableData: [],
      ZfkfsData: [], //付款方式数据
      gsberData: [], //业务范围 数据
      umskzData: [], //特别总账标识数据
      formInline: {
        "Q^BUKRS_^SL": "",
        "Q^DOC_NUMBER_^SL": "",
        user3: "",
        "Q^ZCWJBR_^SL": "",
        "Q^PUSH_DATE_^SL": "",
        // "Q^PAY_ZDJZT_^SL": "",
        userID: this.$store.state.ibps.user.info.user.id
      }
    };
  },
  mixins: [tisSelect],
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
    this.getTable();
  },
  watch: {},
  methods: {
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

      for (const key in this.formInline) {
        if (this.formInline.hasOwnProperty(key)) {
          const element = this.formInline[key];
          if (element) {
            params.parameters.push({
              key: key,
              value: element
            });
          }
        }
      }

      queryPageList(params).then(response => {
        console.log(response);
        this.loading = false;
        this.totalCount = response.data.pageResult.totalCount;
        this.tableData = response.data.dataResult;
      });
    },
    //计算中间table高度
    getTableHeight() {
      if (document.querySelector("#tis")) {
        let height = document.querySelector("#tis").clientHeight;
        let btnHeight = document.querySelector("#header-btn").clientHeight;
        let inputHeight = document.querySelector("#header-input").clientHeight;
        let footerHeight = document.querySelector("#tis-footer").clientHeight;
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
    //日期格式化处理
    // HandleDate(time) {
    //   if (!time) return "";
    //   let da = new Date(time);
    //   let year = da.getFullYear();
    //   let month = da.getMonth() + 1;
    //   let date = da.getDate(); // console.log([year,month,date].join('-'));
    //   return year + "-" + month + "-" + date;
    // },
    //点击事件
    handle(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "exportExcel":
          this.exportExcel();
          break;
        default:
          break;
      }
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    // 导出表格
    exportExcel() {
      let params = {
        parameters: []
      };

      for (const key in this.formInline) {
        if (this.formInline.hasOwnProperty(key)) {
          const element = this.formInline[key];
          if (element) {
            params.parameters.push({
              key: key,
              value: element
            });
          }
        }
      }
      downTisExcel(params)
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
.tis {
  background-color: #fff;
  height: 100%;
  .header-btn {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
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
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 200px;
}

/deep/.el-date-editor .el-date-editor--date {
  width: 140px;
}
</style>
