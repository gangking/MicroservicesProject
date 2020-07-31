<template>
  <div class="tabbox">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="contractNo" label="合同归档编号" width="180">
        </el-table-column>
        <el-table-column prop="contractName" label="合同名称" width="180">
        </el-table-column>
        <el-table-column prop="totalAmount" label="合同总额" width="180">
        </el-table-column>
        <el-table-column prop="bsiDesc" label="合同类型" width="180">
        </el-table-column>
        <el-table-column prop="salerNo" label="客商编码" width="180">
        </el-table-column>
        <el-table-column prop="salerName" label="客商名称" width="180">
        </el-table-column>
        <el-table-column prop="contractUser" label="合同使用主体" width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="disManagement(scope.row)">分配管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="10">
      </el-pagination>
    </div>

    <!-- 弹窗 -->
    <el-dialog title="分配管理" :visible.sync="dialogVisible" width="50%" :show-close="false">
      <div class="content">
        <el-transfer v-loading="loading" @change="leftRght" :titles="['待分配列表', '已分配列表']" filterable v-model="assignedList" :data="toBeAllocateds">
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
        <!-- <el-button type="primary" @click="confirm">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('shared_operation/sharedTask');
import { getButxt } from '@/api/platform/quato/quato.js';
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
    pageResult: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      multipleSelection: [], // 存储批量选中数据
      currentPage: 0, // 当前页
      tableTotal: 0, // 总数
      dialogVisible: false,
      activeItem: {}, // 要分配的合同
      companyLists: [],
      assignedList: [], // 已分配列表
      toBeAllocateds: [] // 待分配列表
    };
  },
  watch: {
    companyLists(val) {
      // var list = JSON.parse(JSON.stringify(val));
      // list.forEach(item => {
      //   item['label'] = item.bukrs + item.butxt;
      // });
      // this.getSetList();
      // if (this.activeItem.contractUser) {
      //   var stringResult = this.activeItem.contractUser.split(',');
      //   var list1 = [];
      //   var list2 = [];
      //   list.forEach(item => {
      //     stringResult.forEach(item2 => {
      //       if (item2 == item.bukrs) {
      //         list1.push(item);
      //       } else {
      //         list2.push(item);
      //       }
      //     });
      //   });
      //   this.assignedList = list1; // 已分配
      //   this.toBeAllocateds = list2; // 待分配
      // } else {
      //   this.toBeAllocateds = list;
      // }
    }
  },
  created() {
    // this.companyLists = require('./data').list;
  },
  methods: {
    ...mapActions(['contractAdd', 'contractRemove']),
    // 设置待分配和已分配列表
    getSetList() {
      var list = JSON.parse(JSON.stringify(this.companyLists));
      list.forEach(item => {
        item['label'] = item.bukrs + item.butxt;
        item['key'] = item.bukrs;
      });

      this.loading = false;
      this.toBeAllocateds = list;
      if (this.activeItem.contractUser) {
        var stringResult = this.activeItem.contractUser.split(',');
        var list1 = [];
        var list2 = [];
        list.forEach(item => {
          list2.push(item);
          stringResult.forEach(item2 => {
            if (item2 == item.bukrs) {
              list1.push(item.key);
            }
          });
        });
        this.assignedList = list1; // 已分配
        // console.log('已分配', this.assignedList, this.toBeAllocateds);
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('handleSelectionChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
    },
    // 打开分配管理
    disManagement(info) {
      this.activeItem = info;
      this.dialogVisible = true;
      this.getButxtFunc();
    },
    // getButxtFunc
    getButxtFunc() {
      // 待分配列表（查全部）
      this.loading = true;
      getButxt().then(res => {
        var arry = [];
        arry = res.data.filter((x, index, self) => {
          var arrids = [];
          res.data.forEach((item, i) => {
            arrids.push(item.bukrs);
          });
          return arrids.indexOf(x.bukrs) === index;
        });
        // console.log('去重后数组',arry)
        this.companyLists = arry;
        this.getSetList();
      });
    },
    // 关闭分配管理
    closeDialog() {
      this.dialogVisible = false;
      this.assignedList = [];
      this.toBeAllocateds = [];
      console.log('刷新')
      this.$emit('refresh')
    },
    // 确认分配
    confirm() {
      console.log('确认分配，待分配列表：', this.companyLists, '已选列表：', this.assignedList);
    },
    // 左移右移
    leftRght(newlist,key,list) {
      console.log('移动',key,  list);
      var ids = list.join(',');
      var id = this.activeItem.id;
      var params = {
        id: id,
        contractUser: ids
      };
      if (key == 'left') {
        console.log('左移删除', key, list);
        this.contractRemove(params).then(res => {
          // this.dialogVisible = false;
          if (res && res.state == '8848') {
            this.getButxtFunc();
            this.$message.error(res.info.message ? res.info.message : '删除失败');
          }
        });
      } else {
        console.log('右移增加', key, list);
        this.contractAdd(params).then(res => {
          // this.dialogVisible = false;
          if (res && res.state == '8848') {
            this.getButxtFunc();
            this.$message.error('增加失败');
          } else {
            // this.dialogVisible = false;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tabbox {
  flex: 1;
  overflow: auto;
  .content {
    height: 350px;
    // background: red;
    /deep/ .el-transfer {
      display: flex;
      height: 100%;
      justify-content: space-around;
      .el-transfer-panel {
        width: 38%;
        height: 100%;
        .el-transfer-panel__filter {
          margin: 15px 0;
        }
      }
      .el-transfer__buttons {
        text-align: center;
        width: 36px;
        height: 85px;
        position: relative;
        top: 50%;
        margin-top: -42.5px;
        .el-button {
          display: inline-block;
          &:last-child {
            margin-left: 0;
          }
        }
      }
    }
  }
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