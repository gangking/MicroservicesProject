<template>
  <div class="mailConfig" ref="mailConfig">
    <div class="header-btn" ref="headerBtn">
      <el-button type="primary" @click="handler('search')">查询</el-button>
      <el-button type="primary" @click="handler('add')">新增</el-button>
    </div>
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        border
        :height="height"
        :data="tableData"
        highlight-current-row
        v-loading="loading"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column fixed prop="id" label="邮件配置序号" align="center" width="150"></el-table-column>
        <el-table-column fixed width="200" label="邮件配置标题">
          <template slot-scope="scope">
            <pre style="white-space: pre-wrap;">{{scope.row.emailTitle}}</pre>
          </template>
        </el-table-column>
        <el-table-column label="邮件配置内容">
          <template slot-scope="scope">
            <pre style="white-space: pre-wrap;">{{scope.row.emailContent}}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="emailType" label="邮件配置类型" align="center" width="100"></el-table-column>
        <el-table-column prop="rule" label="发送规则" align="center" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button @click="editCurrentRow(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增 编辑 -->
    <add-mail-dialog
      :visible.sync="addMailVisible"
      @upTable="search"
      @close="visible=>addMailVisible =visible"
      :title="title"
      :adjustType="adjustType"
      :mailData="mailData"
    />
  </div>
</template>

<script>
import {
  queryAllEmailConf,
  addNewMailConf,
  editMailConf
} from "@/api/platform/mailConfig/mailConfig";
import addMailDialog from "@/views/platform/mail_config/components/dialog";

export default {
  data() {
    return {
      loading: false,
      addMailVisible: false, // 新增邮件弹框
      title: "",
      mailData: {}, //编辑用到的数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0,
      tableData: []
    };
  },
  mounted() {
    window.addEventListener("resize", this.tableResize);
    this.getTableData();
    setTimeout(() => {
      this.getHeight();
    }, 100);
  },

  computed: {
    tableResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.getHeight();
        });
      }, 150);
    },
    adjustType() {
      return this.$route.query.type;
    }
  },
  methods: {
    getTableData() {
      this.loading = true;
      let params = {};
      queryAllEmailConf(params).then(response => {
        this.loading = false;
        this.tableData = response.data;
      });
    },
    // 编辑当前行
    editCurrentRow(row) {
      this.mailData = row;
      this.addMailVisible = true;
      this.title = "编辑";
    },
    //点击事件
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "add":
          this.mailData = {};
          this.addMailVisible = true;
          this.title = "新增";
          break;
        default:
          break;
      }
    },
    search() {
      this.getTableData();
    },
    // 获取高度
    getHeight() {
      this.height =
        this.$refs.mailConfig.clientHeight - this.$refs.headerBtn.clientHeight;
    }
  },
  components: {
    addMailDialog
  },
  destroyed() {
    window.removeEventListener("resize", this.tableResize);
  }
};
</script>

<style scoped lang="scss">
.mailConfig {
  background-color: #fff;
  height: 100%;
  .header-btn {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
  }
}
</style>