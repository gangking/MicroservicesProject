<template>
  <div class="tab">
    <el-table v-loading="loading" :data="tableData" ref="singleTable" height="100%" style="width: 100%" header-cell-class-name="headerRowStyle" @cell-click="activeStepListItem" highlight-current-row :resizable="false">
      <el-table-column prop="bzNumber" label="Step" width="50px">
      </el-table-column>
      <el-table-column prop="cleanUp" label="isClear" width="65px" v-if="comType=='替代规则'">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.cleanUp" true-label="T" false-label="F" @change="checkboxClick(scope.row,scope.row.cleanUp)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="bzDescribe" label="步骤描述">
        <template slot-scope="scope">
          <div class="bzDescribe">
            <span title="双击修改描述">
              {{scope.row.bzDescribe}}
              <span class="txt">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="scope.row.bzDescribe" @blur="textareaEdit(scope.row)">
                </el-input>
              </span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="usePath" label="调用点" width="60px">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="60px">
        <template slot-scope="scope">
          <div class="btntable">
            <el-button type="text" v-if="scope.row.index!=0" v-on:click.stop="tbMove(scope.row,'top')"><i class="el-icon-top"></i></el-button>
            <el-button type="text" v-else-if="scope.row.index==0">&#12288;</el-button>
            <el-button type="text" v-if="scope.row.index!=tableData.length-1" v-on:click.stop="tbMove(scope.row,'bootom')"><i class="el-icon-bottom"></i></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
export default {
  props: {
    tableList: {
      type: Array,
      default: () => []
    },
    comType: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    tableList: {
      handler(val, oldval) {
        if (oldval != undefined) {
          // console.log('数据步骤表', val, oldval);
          // this.tableData = [];
          setTimeout(() => {
            this.tableData = val;
            this.rowDrop();
            // 选中新增行
            if (val.length - oldval.length == 1) {
              this.activeIndex = val.length - 1;
              this.clickRow();
            }
          }, 10);
        }
      },
      immediate: true
    },
    tableData(val) {
      // console.log('表格数据变了', val);
      if (val.length > 0) {
        this.clickRow();
      }
    },
    // tableData:{
    //   // 仅用于拖拽
    //   handler(val, oldval){
    //     console.log('表格数据变了',val, oldval)
    //     // this.clickRow();
    //   },
    //   immediate: true
    // },
    loading: {
      handler(val) {
        if (!val) {
          // 每次加载完默认选中第一个（需求变更）
          if (this.tableData.length < 1) {
            this.$emit('getIsStepListNull', true);
          } else {
            this.$emit('getIsStepListNull', false);
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      tableData: [],
      activeIndex: null
    };
  },
  mounted() {
    this.rowDrop();
  },
  methods: {
    // 点击某个步骤行时?
    activeStepListItem(...arg) {
      // console.log('点击步骤行111', arg);
      var name = arg[2].childNodes[0].firstChild.className;
      if (name != 'el-checkbox is-checked') {
        console.log('点击步骤行111', name, typeof name);
        this.$emit('activeStepListItem', arg[0]);
      }
    },
    // 勾选
    checkboxClick(...arg) {
      console.log('勾选', arg);
      // console.log('勾选',item, flag)
      var list = JSON.parse(JSON.stringify(this.tableData));
      var index = null;
      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        if (a.id == arg[0].id) {
          a.cleanUp = arg[1];
          index = i;
        }
      }
      this.activeIndex = index;
      this.$emit('checkboxClick', list, index);
    },
    // 修改描述
    textareaEdit(info) {
      // console.log('改变后的描述',info)
      this.$emit('textareaEdit', info);
    },
    // 上移下移
    tbMove(item, flag) {
      this.$emit('tbMove', item, flag);
    },
    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      const _this = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: '.el-table__row',
        onEnd({ newIndex, oldIndex }) {
          var list = JSON.parse(JSON.stringify(_this.tableData));
          const currRow = list.splice(oldIndex, 1)[0];
          _this.activeIndex = newIndex;
          console.log('当前索引', newIndex, _this.activeIndex);
          _this.tableData = [];
          // _this.loading = true;
          setTimeout(() => {
            list.splice(newIndex, 0, currRow);
            for (var i = 0; i < list.length; i++) {
              var item = list[i];
              item.bzNumber = (i + 1) * 10;
            }
            _this.tableData = list;
            console.log('拖拽后的摘要表', list);
            _this.$emit('batchSave', list);
          }, 10);
        }
      });
    },
    // 设置点击行
    clickRow() {
      // 每次点击都先清下缓存
      localStorage.removeItem('codeEdit');

      // var index = parseInt(localStorage.getItem('activeRow'))
      //   ? parseInt(localStorage.getItem('activeRow'))
      //   : num;
      // console.log(
      //   '每次加载完查询上次是否有点击行',
      //   localStorage.getItem('activeRow'),
      //   typeof index,
      //   index
      // );
      var index = this.activeIndex ? this.activeIndex : 0;
      this.$refs.singleTable.setCurrentRow(this.tableData[index]);
      this.$emit('activeStepListItem', this.tableData[index]);
      this.$emit('getCodeDetail', this.tableData[index]);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  height: calc(100% - 210px);
  .btntable {
    display: flex;
  }
  .bzDescribe {
    width: 100%;
    height: 50%;
    // background-color: red;
    display: flex;
    justify-content: space-between;
    > span {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 32px;
      position: relative;
      cursor: pointer;
      .txt {
        display: none;
        height: 100%;
        /deep/ .el-textarea__inner {
          height: 32px !important;
        }
      }
      &:active {
        /deep/ .el-textarea {
          display: block;
        }
      }
      /deep/ .el-textarea {
        position: absolute;
        left: 0;
        bottom: 0;
        display: none;
        &:hover {
          display: block;
        }
      }
    }
  }
  /deep/ .el-table--enable-row-transition .el-table__body td {
    border-right: 1px solid #d4d4de;
    &:last-child {
      border-right: 0;
    }
  }
  /deep/ .headerRowStyle {
    background: #f0f9eb !important;
    color: black;
    border-right: 1px solid #d4d4de;
    &.last-child {
      border-right: 0;
    }
  }

  /deep/ .el-table__body tr.current-row > td {
    background-color: #d9ecff;
    //   background-color: red;
    font-weight: bold;
    .bzDescribe {
      .txt {
        display: block !important;
      }
    }
  }
}
</style>