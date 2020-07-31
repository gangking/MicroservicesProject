<template>
  <div class="profiles">
    <div class="title">
      <div class="redblock"></div>
      <p>流程按钮配置文件定义</p>
    </div>
    <div class="btnBox">
      <el-button size="mini" type="primary" class="elbtn" plain @click="dialogVisible">+增加</el-button>
      <el-button size="mini" type="danger" class="elbtn" plain @click="markDelete()">标记删除</el-button>
      <el-button size="mini" type="danger" class="elbtn" plain @click="deleteRow()">删除</el-button>
      <el-button size="mini" type="danger" class="elbtn" plain @click="modifyRow()">修改</el-button>
      <!-- <el-button type="danger" class="elbtn" plain @click="refresh()">刷新</el-button> -->
      <el-select size="mini" v-model="val" filterable placeholder="请选择" @change="getSelVal" clearable @clear="reloadTable()" class="inp">
        <el-option v-for="(item,index) in tableData" :key="index" :label="item.profDesc" :value="item.profCode"></el-option>
      </el-select>
      <!-- <el-button type="success" class="elbtn" plain @click="reloadTable()">重置</el-button> -->
    </div>
    <div class="tableLef">
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" :border="true" height="100%" :highlight-current-row="true" @selection-change="getRow" @row-click="getRowId" :default-sort="{prop: 'bsCode', order: 'descending'}">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="profCode" label="流程按钮配置文件ID" sortable></el-table-column>
        <el-table-column prop="profDesc" label="配置文件描述" sortable></el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="currentPageTotal">
        </el-pagination>
      </div>
    </div>
    <addInfo :msg.sync="parentMsg" :tableInfo="tableData" :visible="dialogTableVisible" :dialogVisible="dialogTableVisible" @handleClose="handleClose" @getAllData="getAllData"></addInfo>
    <modify :msg.sync="parentMsg" :tableInfo="tableData" :visible="modifyDialog" :modDialog="modifyDialog" :selInfo="selId" @handleClose="handleClose" @getAllData="getAllData"></modify>
  </div>
</template>

<script>
import addInfo from './addInfo';
import modify from './modify';
import request from '@/utils/request';
import { SYSTEM_URL } from '@/api/baseUrl';
import { BASE_GATEWAY_API } from '@/api/baseUrl';
import { showLoading, hideLoading } from '@/utils/loading';
export default {
  mounted() {
    this.getData();
  },
  data() {
    return {
      parentMsg: 'test',
      dialogTableVisible: false,
      modifyDialog: false,
      value: '',
      val: '',
      tableData: [],
      selectData: {},
      multipleSelection: [],
      name: '',
      busDes: '',
      conId: '',
      conDes: '',
      currentPage: 1,
      currentPageTotal: 0,
      treeInfo: [],
      selDefInfo: [],
      inputInfo: [],
      selId: [],
      selIds: '',
      allInfo: []
    };
  },
  methods: {
    getAllData() {
      this.getData();
    },
    getData(page) {
      showLoading();
      return request({
        baseURL: BASE_GATEWAY_API,
        url: '/lcandy/query',
        method: 'post',
        data: {
          parameters: [
            {
              key: 'string',
              value: 'string'
            }
          ],
          requestPage: {
            limit: 10,
            pageNo: this.currentPage
          },
          sorts: []
        }
      }).then(response => {
        hideLoading();
        this.tableData = response.data.dataResult;
        this.currentPageTotal = response.data.pageResult.totalCount;
        this.currentPage = response.data.pageResult.page;
        console.log('tableData', this.tableData);
      });
    },
    getRow(val) {
      console.log('val', val);

      let ids = [];
      this.multipleSelection = val;
      this.multipleSelection.forEach(item => {
        ids.push(item.id);
      });
      this.selId = val;
      this.selIds = ids.toString();
      console.log('selId', this.selId);
      console.log('selIds', this.selIds);
    },

    dialogVisible() {
      this.dialogTableVisible = true;
    },
    handleClose() {
      this.dialogTableVisible = false;
      this.modifyDialog = false;
    },
    deleteRow() {
      if (this.selIds == '') {
        this.$message.error('请先选择要删除的内容');
        return false;
      } else {
        return request({
          baseURL: BASE_GATEWAY_API,
          url: '/lcandy/remove?ids=' + this.selIds,
          method: 'post'
        }).then(response => {
          if (response.cause != '') {
            this.$message({
              message: response.cause,
              type: 'warning'
            });
            return false;
          }
          this.$message({
            message: '删除成功 !',
            type: 'success'
          });
          this.getData();
          this.$emit('getTreeInfo', []);
        });
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 翻页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getData();
    },
    // 刷新
    refresh() {
      this.getData();
    },
    modifyRow() {
      if (this.selId.length != 1) {
        this.$message.error('请选择一项修改的内容');
        return false;
      } else {
        this.modifyDialog = true;
      }
    },
    reloadTable() {
      this.val = '';
      this.getData();
    },
    markDelete() {
      let sel = Object.keys(this.selectData);
      if (sel.length == 0) {
        this.$message.error('请先选择要删除的内容');
        return false;
      } else {
        return request({
          baseURL: BASE_GATEWAY_API,
          url: '/lcandy/editStatus?id=' + this.selIds + '&status=true',
          method: 'get'
        }).then(response => {
          if (response.cause != '') {
            this.$message({
              message: response.cause,
              type: 'warning'
            });
            return false;
          }
          this.$message({
            message: '删除成功 !',
            type: 'success'
          });
          this.getData();
          this.$emit('getTreeInfo', []);
        });
        //清除选中状态
        this.$refs.multipleTable.clearSelection();
      }
    },
    getSelVal(val) {
      this.tableData.forEach(item => {
        if (item.profCode == val) {
          (this.tableData = []), this.tableData.push(item);
        }
      });
    },
    getRowId(row) {
      console.log('row', row);

      this.selectData = row;

      this.getInputInfo();
      this.getTreeInfo();
      this.$emit('getSelInfo', row);
    },
    getTreeInfo() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: '/pzwjfz/pzfjfzList?profCode=' + this.selectData.profCode,
        method: 'get',
        data: {}
      })
        .then(response => {
          let closeBtns = [];
          let closeBtn = {};
          let openBtns = [];
          response.data.btnDefList.forEach(item => {
            if (item.BUTTON_CODE_) {
              const { BUTTON_CODE_: buttonCode, BUTTON_NAME_: buttonName } = item;
              closeBtn = {
                buttonCode,
                buttonName,
                status: false,
                statusId: ''
              };
              closeBtns.push(closeBtn);
            }
          });

          openBtns = [];
          response.data.pos.forEach(item => {
            if (item.status == 'true') {
              item.status = true;
            } else {
              item.status = false;
            }
            openBtns.push(item);
          });
          this.treeInfo = openBtns.concat(closeBtns);
          this.$emit('getTreeInfo', this.treeInfo, this.selectData);
        })
        .catch(res => {
          this.$emit('getTreeInfo', []);
        });
    },
    getInputInfo() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: '/pzwjfz/finfListDoc',
        method: 'get',
        data: {}
      }).then(res => {
        this.selDefInfo = res.data;
        this.$emit('getSelDefInfo', this.selDefInfo);
      });
    }
  },
  components: {
    addInfo,
    modify
  },
  props: {}
};
</script>

<style lang="scss" scoped>
.profiles {
  width: 100%;
  height: 100%;
  .title {
    position: relative;
    height: 30px;
    top: 0;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    .redblock {
      position: absolute;
      top: 2px;
      display: inline-block;
      width: 5px;
      height: 17px;
      background-color: #e61a23;
    }
    p {
      position: absolute;
      left: 15px;
      top: 0px;
      height: 18px;
      line-height: 20px;
      margin: 0;
    }
  }
  .btnBox {
    height: 55px;
    padding: 10px 0;
    box-sizing: border-box;
    .elbtn {
      // margin: 0 5px;
      // margin-right: 5px;
    }
    .el-select {
      width: 200px;
      margin-left: 5px;
    }
    .selSearch {
      margin-top: 10px;
    }
    .inp {
      width: 240px !important;
    }
  }
  .tableLef {
    height: calc(100% - 55px - 60px);
    box-sizing: border-box;
  }
  .paginationBox {
    text-align: center;
    height: 30px;
  }
}
</style>