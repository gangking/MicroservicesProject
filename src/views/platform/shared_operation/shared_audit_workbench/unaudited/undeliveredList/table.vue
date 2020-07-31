<template>
  <div class="tabbox">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="docNumber" label="单据编号" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="detailvisible(scope.row)">{{scope.row.docNumber}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="docDescription" label="单据描述">
          <template slot-scope="scope">
            <span v-html="scope.row.docDescription"></span>
          </template>
        </el-table-column> -->
        <el-table-column prop="bukrs" label="公司代码" width="180">
        </el-table-column>
        <!-- <el-table-column prop="PRCTR" label="利润中心" width="180">
        </el-table-column> -->
        <el-table-column prop="username" label="申请人" width="180">
        </el-table-column>
        <el-table-column prop="bsDesc" label="业务场景">
        </el-table-column>
        <!-- <el-table-column prop="amount" label="金额" width="180">
        </el-table-column> -->
        <el-table-column prop="auditUserName" label="审核人" width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.flag != 'suspend'" @click="isSuspendFunc(scope.row,'suspend')" type="text" size="small">挂 起</el-button>
            <el-button v-else-if="scope.row.flag =='suspend'" @click="isSuspendFunc(scope.row,'cancelSuspend')" type="text" size="small">取消挂起</el-button>
            <el-button @click="isQualifiedFunc(scope.row,'agree')" type="text" size="small">合格</el-button>
            <el-button @click="isQualifiedFunc(scope.row,'oppose')" type="text" size="small">不合格</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="20">
      </el-pagination>
    </div>

    <!-- // 不合格弹窗 -->
    <creditReject :dailogTitle="dailogTitle" :creditData="setRow" @creditStatus="creditStatus" @close="visible=>isvisible =visible" :visible="isvisible" />
  </div>
</template>

<script>
import creditReject from './credit-reject';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/sharedWork'
);
export default {
  components: {
    creditReject
  },
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    pageResult: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isvisible: false,
      dailogTitle: '',
      multipleSelection: [], // 存储批量选中数据
      currentPage: 0, // 当前页
      tableTotal: 0, // 总数
      // 员工
      multipleSelectionUser: [],
      setRow: {}
    };
  },
  methods: {
    ...mapActions(['isQualified', 'isSuspend']),
    // 是否挂起
    isSuspendFunc(info, type) {
      console.log('点击是否挂起',info, type)
      this.isSuspend({ ids: info.id, type: type }).then(res => {
        this.$emit('refresh');
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '操作失败！');
        }
      });
    },
    // 审核
    isQualifiedFunc(info, val) {
      this.setRow = info;
      if (val == 'agree') {
        this.isQualified({
          id: info.id,
          desc: val,
          action: val
        }).then(res => {
          this.$emit('refresh');
          if (res && res.state == '8848') {
            this.$message.error(res.info.message ? res.info.message : '审核失败！');
          }
        });
      } else {
        this.isvisible = true;
        this.dailogTitle = val != 'agree' ? '稽核审核：不合格' : '稽核审核：合格';
      }
    },
    // 不合格
    creditStatus(item) {
      var info = item;
      console.log('不合格', info, this.setRow);
      info['id'] = this.setRow.id;
      info['action'] = 'oppose';
      this.isQualified(info).then(res => {
        this.isvisible = false;
        this.$emit('refresh');
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '审核失败！');
        }
      });
    },
    // 日期格式化
    dateFormat(row, column, value) {
      // console.log('日期格式化',value)
      var t = new Date(value); //row 表示一行数据, updateTime 表示要格式化的字段名称
      var year = t.getFullYear(),
        month = t.getMonth() + 1,
        day = t.getDate(),
        hour = t.getHours(),
        min = t.getMinutes(),
        sec = t.getSeconds();
      var newTime =
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (day < 10 ? '0' + day : day) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (min < 10 ? '0' + min : min) +
        ':' +
        (sec < 10 ? '0' + sec : sec);
      return newTime;
    },
    // 跳转表单
    detailvisible(row) {
      console.log('跳转表单', row);
      // 未审核accountingQuery  已审核accountingQuery
      // const { instId, taskId } = row;
      const { appId, instId } = row;
      this.ibpsPayable.setPayableParams({
        appId,
        instId,
        status: 'submitterQuery'
      });

      // this.dialogTableVisible = true;
      // console.log('params', this.params);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('handleSelectionChange', val);
    },
    // 选择员工
    handleSelectionChangeUser(val) {
      this.multipleSelectionUser = val;
    },
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange', val);
    },
    // 跳转页面
    getGroupGoPage(page, info) {
      this.$emit('getGroupGoPage', {
        pageType: page,
        data: info
      });
    },
    // 取消、挂起、退回
    pendingCancelFunc(info, type) {
      this.$emit('pendingCancelFunc', info, type);
    },
    // 查询员工
    onSubmit() {
      console.log('submit!');
    }
  }
};
</script>

<style lang="scss" scoped>
.tabbox {
  flex: 1;
  overflow: auto;
  .list {
    overflow: auto;
    height: calc(100% - 40px);
  }
  .pagination {
    height: 40px;
    text-align: center;
  }
}
</style>