<template>
  <div class="tablebox">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="docNumber" label="单据编号" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="detailvisible(scope.row)">{{scope.row.docNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="bukrs" label="公司代码" width="160">
        </el-table-column>
        <el-table-column prop="username" label="申请人" width="160">
        </el-table-column>
        <el-table-column prop="bsDesc" label="业务场景">
        </el-table-column>
        <el-table-column prop="startTime" label="提交日期" width="140"  :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="createTime" label="入池日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="deliverStatus" label="派单状态" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.deliverStatus == 'normal'">正常</span>
            <span v-else-if="scope.row.deliverStatus =='overtime'">超时</span>
            <span v-else-if="scope.row.deliverStatus =='abnormal'">异常</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="dispatchFunc(scope.row)">指定人员派工</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="20">
      </el-pagination>
    </div>
    <el-dialog title="指定人员派工" :visible.sync="dialogVisible" width="30%">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="员工"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" :data="userTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeUser">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="员工" prop="name">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">分配</el-button>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
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
    clickTypeTxt: {
      type: String,
      default: ''
    },
    clickFlag: {
      type: Boolean,
      default: false
    },
    pageResult: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    clickFlag(val) {
      console.log('点击按钮', val, this.clickTypeTxt);
      if (this.clickTypeTxt == '批量派工') {
        this.dispatchFunc(this.multipleSelectionUser);
      }
    }
  },
  data() {
    return {
      multipleSelection: [], // 存储批量选中数据
      currentPage: 0, // 当前页
      tableTotal: 0, // 总数
      dialogVisible: false,
      formInline: {
        user: ''
      },
      userTableData: [
        {
          name: '张三'
        },
        {
          name: '王五'
        }
      ], // 员工
      multipleSelectionUser: []
    };
  },
  methods: {
    // 日期格式化
    dateFormat(row,column,value){
      var t=new Date(value);//row 表示一行数据, updateTime 表示要格式化的字段名称
      var year=t.getFullYear(),
       　　 month=t.getMonth()+1,
       　　 day=t.getDate(),
      　　  hour=t.getHours(),
      　　  min=t.getMinutes(),
      　　  sec=t.getSeconds();
  　　  var newTime=year+'-'+
      　　  (month<10?'0'+month:month)+'-'+
     　　   (day<10?'0'+day:day)+' '+
      　　  (hour<10?'0'+hour:hour)+':'+
      　　  (min<10?'0'+min:min)+':'+
      　　  (sec<10?'0'+sec:sec);
  　　  return newTime;
    },
    // 跳转表单
    detailvisible(row) {
      console.log('跳转表单', row);
      const { appId, instId, taskId } = row;
      this.ibpsPayable.setPayableParams({
        appId,
        instId,
        taskId,
        status: 'submitterQuery'
      });
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
    // 派工
    dispatchFunc(info) {
      this.$emit('dispatchUserFunc', info);
    },
    // 查询员工
    onSubmit() {
      console.log('submit!');
    }
  }
};
</script>

<style lang="scss" scoped>
.tablebox {
  flex: 1;
  overflow: auto;
  .list {
    height: calc(100% - 40px);
    overflow: auto;
  }
  .pagination {
    height: 40px;
    text-align: center;
  }
}
</style>