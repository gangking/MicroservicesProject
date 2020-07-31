<template>
  <div class="onebox">
    <btnComponent :btnList="btnList" @closeBox="closeBox" @btnClick="btnClick" />
    <tableComponent @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange" :requestPage="requestPage" :activeRow="activeRow" :tableData="tableData" @getGroupGoPage="getGroupGoPage" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="660px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="派单范围编号" prop="rangeNo">
          <el-input v-model="form.rangeNo"></el-input>
        </el-form-item>
        <el-form-item label="派单范围名称" prop="rangeNo">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="业务场景" prop="bsaListLabel">
          <div class="bsaList">
            <div class="newSelect" @click="innerVisible=true">
              <el-tag @close="closeScenario(item)" v-for="item in form.bsaList" :key="item.bsaKey" closable :type="item.bsaKey">
                {{item.bsaName}}
              </el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-dialog width="65%" title="选择业务场景" top="5vh" :visible.sync="innerVisible" append-to-body @close="userclose">
        <scenarioList :flag="innerVisible" :bsaList="form.bsaList" @getBusScenario="getBusScenario" @userclose="userclose" />
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from './table';
import scenarioList from './scenario';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  inject: ['busSet'],
  props: {
    treeId: {
      type: String,
      default: ''
    },
    levelVal: {
      type: String,
      default: ''
    }
  },
  components: {
    btnComponent,
    tableComponent,
    scenarioList
  },
  watch: {
    treeId: {
      handler(val) {
        this.id = val;
        this.onload();
      },
      immediate: true
    }
  },
  data() {
    return {
      btnList: [
        {
          label: '新增',
          func: ''
        },
        {
          label: '保存派单范围',
          func: ''
        },
        {
          label: '显示已选范围',
          func: ''
        },
        {
          label: '关闭',
          func: ''
        }
      ],
      tableData: [],
      activeRow: {}, // 已选范围
      requestPage: {},
      id: '',
      dialogTitle: '新增业务组',
      dialogFormVisible: false,
      innerVisible: false,
      multipleSelection: [],
      form: {
        rangeNo: '',
        name: '',
        bsaList: [],
        bsaListLabel: '',
        level: '1',
        status: '',
        parentId: '',
        boId: '',
        boCode: '',
        boName: '',
        rangeType: '',
        condtion: ''
      },
      bsaDataList: [], // 业务场景已选列表
      rules: {
        rangeNo: [{ required: true, message: '请输入派单范围编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入派单范围名称', trigger: 'blur' }],
        bsaList: [{ required: true, message: '请选择业务场景', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
  },
  methods: {
    ...mapActions(['queryRangeList', 'rangeAdd', 'rangeStopDelete', 'rangeTaskSave']),
    onload() {
      console.log('派单范围父亲ID', this.id);
      this.queryRangeList({
        parameters: [
          { key: 'Q^parent_id^SL', value: '' },
          { key: 'Q^level^SL', value: this.busSet.levelVal }
        ],
        requestPage: {
          pageNo: this.requestPage.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        this.tableData = res.dataResult;
        this.requestPage = res.pageResult;
        this.$emit('updateTree');
      });
    },
    // 翻页
    handleCurrentChange(page) {
      this.requestPage.page = page;
      this.onload();
    },
    close() {
      this.form = {
        rangeNo: '',
        name: '',
        bsaList: [],
        bsaListLabel: '',
        level: '1',
        status: '',
        parentId: '',
        boId: '',
        boCode: '',
        boName: '',
        rangeType: '',
        condtion: ''
      };
      this.dialogFormVisible = false;
    },
    userclose() {
      this.innerVisible = false;
    },
    // 获取弹窗选中的业务场景
    getBusScenario(list) {
      var arry = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        arry.push({
          bsaKey: item.key,
          bsaName: item.describe
        });
      }
      this.bsaDataList = arry;
      this.form.bsaList = arry;
      console.log('选择的业务场景', arry);
      this.userclose();
    },
    // 单个删除弹窗选中业务场景
    closeScenario(info) {
      var arry = JSON.parse(JSON.stringify(this.form.bsaList));
      // console.log('单个删除弹窗选中业务场景',info)
      for (var i = 0; i < arry.length; i++) {
        if (info.bsaKey == arry[i].bsaKey) {
          // a.slice(2,5)
          arry.splice(i, 1);
          // console.log('删除后的业务场景',arry);
        }
      }
      this.$set(this.form, 'bsaList', arry);
    },
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.addOredit();
          this.rangeAdd(this.form).then(res => {
            console.log('新增范围返回', res);
            this.dialogFormVisible = false;
            this.onload();
            if (res.state != 200) {
              this.$message.error('新增失败，注意：范围编号不可重复！');
              return;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 按钮组点击事件
    btnClick(type) {
      switch (type) {
        case '新增':
          this.dialogTitle = '新增派单范围';
          this.dialogFormVisible = true;
          this.form['level'] = '1';
          this.form['parentId'] = this.id;
          break;
        case '保存派单范围':
          this.isSave();
          // // 必须必须勾选，且只能勾选一个
          // if (this.multipleSelection.length == 1) {
          //   this.rangeTaskSave({
          //     groupId: this.id,
          //     rangeId: this.multipleSelection[0].id
          //   }).then(res => {
          //     this.closeBox();
          //   });
          // } else {
          //   this.$message.error('请至少选择一行，且只能选择一行，再进行操作');
          // }
          break;
        case '显示已选范围':
          console.log('该业务组已选的范围', this.busSet.rangeId, this.tableData);
          for (var i = 0; i < this.tableData.length; i++) {
            var item = this.tableData[i];
            if (item.id == this.busSet.rangeId) {
              console.log('该业务组已选的范围', item);
              this.activeRow = item;
            }
          }
          break;
      }
    },
    isSave() {
      this.$confirm('分配业务范围，一个组只能分配一个，如已有范围，则会覆盖，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 必须必须勾选，且只能勾选一个
          if (this.multipleSelection.length == 1) {
            this.rangeTaskSave({
              groupId: this.id,
              rangeId: this.multipleSelection[0].id
            }).then(res => {
              this.closeBox();
            });
          } else {
            this.$message.error('请至少选择一行，且只能选择一行，再进行操作');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    // 勾选的范围表
    handleSelectionChange(list) {
      this.multipleSelection = list;
    },
    // 编辑派单范围
    btnEditClick(info) {
      this.dialogTitle = '编辑派单范围';
      console.log('编辑派单范围', info);
      this.bsaDataList = info.bsaList;
      this.form = info;
      this.form['level'] = info.level;
      this.dialogFormVisible = true;
    },
    // 启用
    btnStartClick(info) {
      if (info.status == 'actived') {
        this.$message.error('当前员工已启动');
        return;
      }
      this.form = info;
      this.form['status'] = 'actived';
      this.rangeAdd(this.form).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 停用
    btnStopClick(info) {
      if (info.status == 'deleted') {
        this.$message.error('当前员工已停用');
        return;
      }
      this.rangeStopDelete({
        ids: info.id,
        type: 'stop'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.rangeStopDelete({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
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
.onebox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-form {
    .el-form-item {
      .el-form-item__label {
        width: 108px !important;
        text-align: right;
      }
      .el-select {
        width: 188px !important;
      }
      .bsaList {
        // height: 60px;
        // overflow: auto;
        .newSelect {
          width: 188px;
          height: 32px;
          overflow: auto;
          border: 1px dashed #ccc;
          border-radius: 4px;
        }
        .el-input__suffix {
          display: none;
        }
      }
    }
  }
}
</style>