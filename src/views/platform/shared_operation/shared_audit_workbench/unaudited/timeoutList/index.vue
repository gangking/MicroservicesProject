<template>
  <div class="box">
    <search  @searchForm="searchForm" />
    <tableComponent @refresh="onload" @handleCurrentChange="handleCurrentChange" :pageResult="pageResult" :tableData="tableData" :clickFlag="clickFlag" :clickTypeTxt="clickTypeTxt" @getGroupGoPage="getGroupGoPage" />
  </div>
</template>

<script>
import search from './search';
import btnComponent from './btnList';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('shared_operation/sharedWork');
const { mapActions: mapActionsTwo } = createNamespacedHelpers('shared_operation/basiConfig');
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isUpdate(val) {
      this.onload();
    }
  },
  components: {
    search,
    btnComponent,
    tableComponent
  },
  data() {
    return {
      tableData: [],
      clickTypeTxt: '',
      clickFlag: false,
      pageResult: {},
      dialogTitle: '指定人员派工',
      dialogVisible: false,
      formInline: {
        user: '',
        userInfo: {},
        auditDesc: '',
        action: ''
      },
      userTableData: [],
      multipleTabelData: [],
      multipleSelectionData: {},
      ids: ''
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.onload();
  },
  methods: {
    ...mapActions(['thisUnrevisedList', 'deliverAssign']),
    ...mapActionsTwo(['groupMemberList']),
    onload() {
      this.thisUnrevisedList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('待整改列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult?res.pageResult:this.pageResult;
      });
    },
    handleCurrentChange(val) {
      this.pageResult.page = val;
      this.onload();
    },
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
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
      this.thisUnrevisedList({
        parameters: [
          { key: 'Q^b.doc_number^SL', value: info.docNumber },
          { key: 'Q^B.app_id_^SL', value: bsCode },
          { key: 'Q^b.bukrs^SL', value: info.companyCode },
          { key: 'Q^b.username^SL', value: info.username },
          { key: 'Q^a.status^SL', value: info.status },
          {
            key: 'Q^b.start_time_^DL',
            value: info.dateSubmit[0]
          },
          {
            key: 'Q^b.start_time_^DG',
            value: info.dateSubmit[1]
          },

          {
            key: 'Q^a.create_time^DL',
            value: info.dataPool[0]
          },
          {
            key: 'Q^a.create_time^DG',
            value: info.dataPool[1]
          }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('待整改列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult?res.pageResult:this.pageResult;
      });
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
}
</style>