<template>
  <div class="userlist">
    <div class="select">
      <el-tag closable v-for="(item) in newActiveList" :key="item.id" @close="closeScenario(item)">{{item.describe}}</el-tag>
    </div>
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="场景编码">
          <el-input v-model="formInline.bocode" placeholder="请输入业务场景编码"></el-input>
        </el-form-item>
        <el-form-item label="场景描述">
          <el-input v-model="formInline.boDesc" placeholder="请输入场景描述"></el-input>
        </el-form-item>
        <el-form-item label="场景应用描述">
          <el-input v-model="formInline.bpmDesc" placeholder="请输入场景应用描述"></el-input>
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
      <el-table-column property="bsCode" label="业务场景编码" />
      <el-table-column property="bsDescribe" label="业务场景描述" />
      <el-table-column property="bpmKey" label="业务场景应用ID" />
      <el-table-column property="describe" label="业务场景应用描述" />
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChangepage" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="tableTotal" :page-size="20">
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
export default {
  props: {
    bsaList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    flag: {
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
        boDesc: '',
        bocode: '',
        bpmDesc: ''
      },
      isUpdasstePage: false, // 是否点击翻页
      isShow: false,
      isCheck: false // 执行勾选操作
    };
  },
  watch: {
    flag(val) {
      if (val) {
        console.log('接受详情集成策略', val, this.bsaList);
        if (this.bsaList.length == 0) {
          this.$refs.multipleTable.clearSelection();
        }
        var list = JSON.parse(JSON.stringify(this.bsaList));
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          item['key'] = item.bsaKey;
          item['describe'] = item.bsaName;
        }
        this.isShow = true;
        this.isCheck = false;
        this.activeList = list;
        this.newActiveList = list;
      }
    },
    currentRow: {
      handler(val, oldVal) {
        // 如果只是为了显示勾选则不操作
        if (this.isShow) {
          this.isShow = false;
          return;
        }
        // 翻页的时候变化不管
        if (!this.isUpdasstePage) {
          if (val) {
            if (oldVal) {
              // debugger;
              if (val.length > oldVal.length) {
                // 新增
                for (var i = 0; i < val.length; i++) {
                  var item = val[i];
                  this.activeList.push(item);
                }
              } else if (val.length < oldVal.length) {
                // debugger
                // 删除
                // 删除那些在旧数组中找不到的数据
                var arry = oldVal.filter(item => !val.some(ele => ele.id === item.id));
                this.activeList = this.activeList.filter(
                  item => !arry.some(ele => ele.key === item.key)
                );
              }
            }
          } else {
            // 说明删完了,只需要把旧数组中数据删除即可
            this.activeList = this.activeList.filter(
              item => !oldVal.some(ele => ele.key === item.key)
            );
          }
        } else {
          // 点了翻页，数据清空不管
          this.isUpdasstePage = false;
        }
      },
      immediate: true
    },
    activeList(val) {
      console.log('最新选中数据', val);
      // 去重
      var arr = val.reduce(function(prev, element) {
        if (!prev.find(el => el.key == element.key)) {
          element['key'] = element.key;
          prev.push(element);
        }
        return prev;
      }, []);
      this.newActiveList = arr;
    },
    /*
      监听newActiveList
      判断他当中是否有和当前页相关的数据
      把是当前页的数据勾上
    */
    newActiveList: {
      handler(val) {
        this.checklistFunc();
      },
      immediate: true
    }
  },
  created() {
    this.onload();
  },
  methods: {
    ...mapActions(['queryAllBo']),
    // 根据显示框勾选当前页已有的数据
    checklistFunc() {
      console.log('最新显示框数据', this.newActiveList);
      var arry = [];
      for (var i = 0; i < this.tableData.length; i++) {
        var item = this.tableData[i];
        for (var j = 0; j < this.newActiveList.length; j++) {
          var item2 = this.newActiveList[j];
          if (item.key == item2.key) {
            arry.push(item);
          }
        }
      }
      // 如果执行的是正常勾选则不执行显示勾选操作
      if (!this.isCheck) {
        console.log('显示中在当前页中已有的', arry);
        if (arry.length > 0) {
          this.$nextTick(() => {
            this.currentRow = arry;
            arry.forEach(row => {
              this.isShow = true;
              // 勾选
              this.$refs.multipleTable.toggleRowSelection(row, true);
            });
            this.isShow = false;
          });
        } else {
          this.isShow = false;
        }
      }
    },
    onload() {
      this.queryAllBo({
        parameters: [
          { key: 'Q^bs_describe_^SL', value: this.formInline.boDesc },
          { key: 'Q^BS_CODE_^SL', value: this.formInline.bocode },
          { key: 'Q^describe_^SL', value: this.formInline.bpmDesc }
        ],
        requestPage: { pageNo: this.currentPage, limit: 20, totalCount: 53 },
        sorts: []
      }).then(res => {
        console.log('业务场景列表', res);
        this.tableData = res.dataResult;
        this.currentPage = res.pageResult.page;
        this.tableTotal = res.pageResult.totalCount;
        this.isShow = true;
        this.isCheck = false;
        this.checklistFunc();
      });
    },
    closeScenario(info) {
      var arry = JSON.parse(JSON.stringify(this.newActiveList));
      // console.log('单个删除弹窗选中业务场景',info)
      for (var i = 0; i < arry.length; i++) {
        if (info.id == arry[i].id) {
          // a.slice(2,5)
          arry.splice(i, 1);
          // console.log('删除后的业务场景',arry);
        }
      }
      this.newActiveList = arry;
      for (var j = 0; j < this.tableData.length; j++) {
        var item = this.tableData[j];
        if (item.id == info.id) {
          this.$refs.multipleTable.toggleRowSelection(item, false);
        }
      }
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
      this.isUpdasstePage = true;
      this.onload();
    },
    // 选中员工
    handleCurrentChange(val) {
      // this.isShow = false;
      if (this.isShow) {
        return;
      }
      // debugger;
      this.isCheck = true;
      this.isShow = false;
      this.currentRow = val;
    },
    close() {
      this.$emit('userclose');
    },
    getBusScenario() {
      if (this.currentRow.length < 1) {
        this.$message.error('未选择业务场景');
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
    height: 80px;
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