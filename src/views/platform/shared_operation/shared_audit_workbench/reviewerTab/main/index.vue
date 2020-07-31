<template>
  <div class="box">
    <search @closeBox="closeBox" @searchForm="searchForm"/>
    <!-- <btnComponent :btnList="btnList" @clickType="clickType" /> -->
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @getGroupGoPage="getGroupGoPage" />
  </div>
</template>

<script>
import search from './search';
import btnComponent from './btnList';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/sharedWork'
);
export default {
  components: {
    search,
    btnComponent,
    tableComponent
  },
  data() {
    return {
      btnList: [
        {
          label: '批量指定规则派工',
          func: ''
        }
      ],
      tableData: [],
      clickTypeTxt: '',
      clickFlag: false,
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
      // console.log('触发未派列表更新',type);
      this.onload();
    },
    ...mapActions(['unrevisedList']),
    onload() {
      this.unrevisedList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核任务调整(审核人页签)', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult ? res.pageResult : this.pageResult;
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
      console.log('搜索1111', info);
      var bsCode = '';
      for (var i = 0; i < info.bsaList.length; i++) {
        var item = info.bsaList[i];
        if (i != info.bsaList.length - 1) {
          bsCode += item.bsaKey + ',';
        } else {
          bsCode += item.bsaKey;
        }
      }
      this.unrevisedList({
        parameters: [
          { key: 'Q^b.doc_number^SL', value: info.docNumber },
          { key: 'Q^B.app_id_^SL', value: bsCode },
          { key: 'Q^b.bukrs^SL', value: info.companyCode },
          { key: 'Q^b.username^SL', value: info.applicant }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核任务调整(审核人页签)', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult ? res.pageResult : this.pageResult;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>