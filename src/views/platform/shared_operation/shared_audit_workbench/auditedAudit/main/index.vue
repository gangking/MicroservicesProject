<template>
  <div class="box">
    <search @closeBox="closeBox" @searchForm="searchForm" />
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
    ...mapActions(['auditedAuditList']),
    onload() {
      this.auditedAuditList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '分派失败');
        } else {
          console.log('已办稽核列表', res);
          this.tableData = res.dataResult;
          this.pageResult = res.pageResult ? res.pageResult : this.pageResult;
        }
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
      var bsCode = '';
      for (var i = 0; i < info.bsaList.length; i++) {
        var item = info.bsaList[i];
        if (i != info.bsaList.length - 1) {
          bsCode += item.bsaKey + ',';
        } else {
          bsCode += item.bsaKey;
        }
      }
      this.auditedAuditList({
        parameters: [
          { key: 'Q^b.doc_number^SL', value: info.docNumber },
          { key: 'Q^B.app_id_^SL', value: bsCode },
          { key: 'Q^b.bukrs^SL', value: info.companyCode },
          { key: 'Q^c.NAME_^SL', value: info.applicant },
          // {
          //   key: 'Q^b.start_time_^DL',
          //   value: info.dateSubmit[0]
          // },
          // {
          //   key: 'Q^b.start_time_^DG',
          //   value: info.dateSubmit[1]
          // },
          // {
          //   key: 'Q^a.create_time^DL',
          //   value: info.dataPool[0]
          // },
          // {
          //   key: 'Q^a.create_time^DG',
          //   value: info.dataPool[1]
          // }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('已办稽核列表搜索结果', res);
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '分派失败');
        } else {
          this.tableData = res.dataResult;
          this.pageResult = res.pageResult ? res.pageResult : this.pageResult;
        }
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