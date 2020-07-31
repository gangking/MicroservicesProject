<template>
  <div class="box">
    <search @closeBox="closeBox" @searchForm="searchForm" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData"  @getGroupGoPage="getGroupGoPage" @refresh="onload" @handleSelectionChange="handleSelectionChange" />
  </div>
</template>

<script>
import search from './search';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('shared_operation/sharedTask');
const { mapActions: mapActionsTwo } = createNamespacedHelpers('shared_operation/basiConfig');
export default {
  components: {
    search,
    tableComponent
  },
  data() {
    return {
      searchFormVal: [],
      tableData: [],
      multipleTabelData: [],
      pageResult: { page: 1, totalCount: 0 }
    };
  },
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.onload();
  },
  mounted() {
    this.ibpsPayable.$on("exit-multi-form", this.onEvenReload);
  },
  destroyed() {
    this.ibpsPayable.$off("exit-multi-form", this.onEvenReload);
  },
  methods: {
    onEvenReload(type){
      this.onload();
    },
    ...mapActions(['contractQuery', 'deliverRecover', 'deliverAssign']),
    ...mapActionsTwo(['groupMemberList', 'sharedPollList']),
    onload() {
      this.contractQuery({
        parameters: this.searchFormVal,
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('合同权限分配', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult.page = page;
      this.onload();
    },
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    closeBox() {
      this.$emit('getGroupGoPage', {
        pageType: '主页'
      });
    },
    // 搜索
    searchForm(info) {
      console.log('搜索', info);
      this.searchFormVal = [
        { key: 'Q^CONTRACTNO^SL', value: info.contractFilingNo },
        { key: 'Q^CONTRACTNAME^SL', value: info.contractName },
        { key: 'Q^SALERNO^SL', value: info.supplierCode },
        { key: 'Q^SALERNAME^SL', value: info.supplierName },
      ];
      this.onload();
    },
    // 批量选中数据行
    handleSelectionChange(list) {
      this.multipleTabelData = list;
    },
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // overflow: auto;
  .dialogTabel {
    height: 300px;
  }
}
</style>