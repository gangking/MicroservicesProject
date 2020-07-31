<template>
  <div class="box">
    <search @closeBox="closeBox" @searchForm="searchForm" />
    <!-- <btnComponent :btnList="btnList" @clickType="clickType" /> -->
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" @refresh="onload" :tableData="tableData" @getGroupGoPage="getGroupGoPage" />
  </div>
</template>

<script>
import search from './search';
import btnComponent from './btnList';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/sharedTask'
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
    ...mapActions(['charaeeBackList']),
    onload() {
      this.charaeeBackList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('任务退回管理列表', res);
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
      var bsCode="";
      for(var i = 0; i < info.bsaList.length;i++) {
        var item = info.bsaList[i];
        if (i != info.bsaList.length-1) {
          bsCode += item.bsaKey+',';
        } else {
          bsCode += item.bsaKey
        }
      }
      this.charaeeBackList({
        parameters: [
          { key: 'Q^b.doc_number^SL', value: info.docNumber },
          { key: 'Q^B.app_id_^SL', value: bsCode },
          { key: 'Q^b.bukrs^SL', value: info.companyCode },
          { key: 'Q^b.username^SL', value: info.applicant },
          {
            key: 'Q^b.start_time_^DL',
            value: info.dateSubmit[0]
          },
          {
            key: 'Q^b.start_time_^DG',
            value: info.dateSubmit[1]
          },
          { key: 'Q^d.NAME_ ^SL', value: info.returnUser }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('共享任务未审核列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    }
    // 按钮点击类型
    // clickType(info) {
    //   this.clickTypeTxt = info.label;
    //   this.clickFlag = this.clickFlag ? false : true;
    // }
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