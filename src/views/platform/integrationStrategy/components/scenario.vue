<template>
  <div class="userlist">
    <div class="select">
      <el-tag v-for="(item) in newActiveList" :key="item.id">{{item.sttDesc}}</el-tag>
    </div>
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="集成策略编码">
          <el-input v-model="formInline.sttCode" placeholder="请输入集成策略编码"></el-input>
        </el-form-item>
        <el-form-item label="集成策略描述">
          <el-input v-model="formInline.sttDesc" placeholder="请输入集成策略描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="multipleTable" :data="tableData" @selection-change="handleCurrentChange" style="width: 100%">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="sttCode" label="集成策略编码" />
      <el-table-column property="sttDesc" label="集成策略描述" />
      <el-table-column property="apiCode" label="集成接口编码" />
      <el-table-column property="apiDesc" label="集成接口描述" />
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChangepage" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="tableTotal" :page-size="10">
      </el-pagination>
    </div>
    <div class="btnbox">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="getBusScenario">确认</el-button>
    </div>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
import indexApi from '@/api/platform/voucher/index.js';
import { showLoading, hideLoading } from '@/utils/loading';
export default {
  props: {
    bsaList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    openFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      currentRow: [],
      activeList: [],
      newActiveList: [],
      currentPage: 1, // 当前页
      tableTotal: 0, // 总数
      formInline: {
        sttDesc: '',
        sttCode: ''
      },
    };
  },
  created() {
    this.onload();
  },
  methods: {
    ...mapActions(['queryAllBo']),
    onload() {
      showLoading();
      indexApi
        .queryIntegrationStrategy({
          extraParameters: {
            sttCode: '%' + this.formInline.sttCode + '%',
            sttDesc: '%' + this.formInline.sttDesc + '%'
          },
          requestPage: {
            limit: 10,
            pageNo: 1
          }
        })
        .then(res => {
          console.log('获取集成策略', res);
          this.tableData = res.data.dataResult;
          this.currentPage = res.data.pageResult.page;
          this.tableTotal = res.data.pageResult.totalCount;
          hideLoading();
        })
        .catch(req => {
          console.log('获取集成策略报错', req);
          hideLoading();
          this.$message.error('查询集成策略失败！');
        });
    },
    // 搜索onSubmit
    onSubmit() {
      this.currentPage = 1;
      this.onload();
    },
    // 翻页
    handleCurrentChangepage(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.onload();
    },
    // 选中集成策略
    handleCurrentChange(val) {
      this.currentRow = val;
      this.newActiveList = val;
    },
    close() {
      this.$emit('userclose');
    },
    getBusScenario() {
      if (this.newActiveList.length != 1) {
        this.$message.error('请至少选择一个，且只能选择一个集成策略');
        return;
      }
      this.$emit('getBusScenario', this.newActiveList);
    }
  }
};
</script>

<style lang="scss" scoped>
.userlist {
  // height: 440px;
  .select {
    height: 50px;
    padding: 5px;
    border: 1px solid #ccc;
    overflow: auto;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .search {
    height: 40px;
    /deep/ .el-input--small {
      width: 160px !important;
    }
  }
  /deep/ .el-table {
    height: 300px;
    overflow: auto;
  }
  .pagination {
    height: 50px;
    text-align: center;
    padding-top: 10px;
    box-sizing: border-box;
  }
  .btnbox {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
}
</style>