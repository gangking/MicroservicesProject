<template>
  <div class="automaticbox">
    <div v-if="!isAddEdit">
      <search @closeBox="closeBox" @searchFormFunc="searchFormFunc" />
      <btnComponent :btnList="btnList" @btnClick="btnClick" />
      <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" :activeRow="activeRow" @getGroupGoPage="getGroupGoPage" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" @getMultipleSelection="getMultipleSelection" />
    </div>
    <div v-else>
      <ruleSet :formRule="formRule" :isAddEditTitle="isAddEditTitle" @closeAddBox="closeAddBox" @addAutoRule="addAutoRule" />
    </div>

  </div>
</template>

<script>
import search from '@/views/platform/shared_operation/basicConfig/businessGroupSet/strategy/automatic/search.vue';
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from '@/views/platform/shared_operation/basicConfig/businessGroupSet/strategy/automatic/table.vue';
import ruleSet from './ruleSet';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  inject: ['busSet'],
  components: {
    search,
    btnComponent,
    tableComponent,
    ruleSet
  },
  data() {
    return {
      isAddEdit: false,
      isAddEditTitle: '',
      formRule: {},
      btnList: [
        {
          label: '新增手动派单规则',
          func: ''
        },
        {
          label: '批量删除',
          func: ''
        },
        {
          label: '批量停用',
          func: ''
        },
        {
          label: '显示已选规则',
          func: ''
        },
        {
          label: '保存手动规则',
          func: ''
        }
      ],
      tableData: [],
      pageResult: {},
      searchForm: {},
      activeRow: {},
      multipleList: [], // 勾选规则
      isRuleSet: false // 是否进入派单规则设置
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.onload();
  },
  methods: {
    ...mapActions([
      'deliverRuleList',
      'deliverRuleAddEdit',
      'deliverRuleDeleteStop',
      'deliverRuleSave'
    ]),
    onload() {
      this.deliverRuleList({
        parameters: [
          { key: 'Q^rule_type^SL', value: 'MAN' },
          { key: 'Q^rule_no^SL', value: this.searchForm.strategyCode },
          { key: 'Q^name^SL', value: this.searchForm.strategyName },
          { key: 'Q^status^SL', value: this.searchForm.status }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        // console.log('手动规则列表', res);
        this.tableData = res.dataResult;
      });
    },
    searchFormFunc(info) {
      this.searchForm = info;
      this.onload();
    },
    handleCurrentChange(page) {
      this.pageResult['page'] = page;
      this.onload();
    },
    // 获取选中
    getMultipleSelection(list) {
      console.log('选中行', list);
      this.multipleList = list;
    },
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    btnClick(type) {
      switch (type) {
        case '新增手动派单规则':
          this.isAddEdit = true;
          this.isAddEditTitle = '新增手动派单规则';
          break;
        case '批量删除':
          if (this.multipleList.length > 0) {
            var ids = '';
            for (var i = 0; i < this.multipleList.length; i++) {
              if (i != this.multipleList.length - 1) {
                ids += this.multipleList[i].id + ',';
              } else {
                ids += this.multipleList[i].id;
              }
            }
            this.deliverRuleDeleteStop({
              ids: ids,
              type: 'deleted'
            }).then(res => {
              // 刷新表格
              this.onload();
            });
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
          break;
        case '批量停用':
          if (this.multipleList.length > 0) {
            var ids = '';
            for (var i = 0; i < this.multipleList.length; i++) {
              if (i != this.multipleList.length - 1) {
                ids += this.multipleList[i].id + ',';
              } else {
                ids += this.multipleList[i].id;
              }
            }
            this.deliverRuleDeleteStop({
              ids: ids,
              type: 'stop'
            }).then(res => {
              // 刷新表格
              this.onload();
            });
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
          break;
        case '保存手动规则':
          this.isSave();
          break;
        case '显示已选规则':
          console.log('该业务组已选的规则', this.busSet.ruleId, this.tableData);
          for (var i = 0; i < this.tableData.length; i++) {
            var item = this.tableData[i];
            if (item.id == this.busSet.ruleId) {
              console.log('该业务组已选的规则', item);
              this.activeRow = item;
            }
          }
          break;
      }
    },
    isSave() {
      this.$confirm(
        '分配手动或者自动派单规则，一个组只能分配一个，如已有规则，则会覆盖，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          if (this.multipleList.length > 0) {
            // console.log('该业务组Id', this.busSet.treeId);
            this.deliverRuleSave({
              groupId: this.busSet.treeId,
              autoRuleId: this.busSet.autoRuleId,
              manRuleId: this.multipleList[0].id
            }).then(res => {
              this.closeBox();
            });
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    // 新增手动规则
    addAutoRule(info) {
      this.deliverRuleAddEdit(info).then(res => {
        this.onload();
        if (res.state != 200) {
          this.$message.error('新增失败，注意：规则编号不可重复！');
          return;
        }
      });
    },
    // 编辑手动规则
    btnEditClick(info) {
      this.isAddEdit = true;
      this.isAddEditTitle = '编辑手动派单规则';
      this.formRule = info;
    },
    // 启用
    btnStartClick(info) {
      if (info.status == '启用') {
        this.$message.error('当前员工已启动');
        return;
      }
      info['status'] = 'actived';
      this.deliverRuleAddEdit(info).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 停用
    btnStopClick(info) {
      if (info.status == '停用') {
        this.$message.error('当前员工已停用');
        return;
      }
      this.deliverRuleDeleteStop({
        ids: info.id,
        type: 'stop'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.deliverRuleDeleteStop({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 返回手动派单列表
    closeAddBox() {
      console.log('返回手动派单列表');
      this.isAddEdit = false;
      this.isAddEditTitle = '';
    },
    closeBox() {
      this.$emit('getGroupGoPage', {
        pageType: '返回业务组管理'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.automaticbox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > div {
    height: 100%;
  }
}
</style>