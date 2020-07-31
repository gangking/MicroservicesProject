<template>
  <div class="teambox">
    <search @closeBox="closeBox" @searchFormFunc="searchFormFunc" />
    <btnComponent @closeBox="closeBox" :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @getGroupGoPage="getGroupGoPage" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" @getMultipleSelection="getMultipleSelection" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="660px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="员工" prop="userName">
          <div class="userbox">
            <el-input v-model="form.userName"></el-input>
            <el-button type="primary" size="small" @click="innerVisible=true">选择</el-button>
          </div>
        </el-form-item>
        <el-form-item label="公司名" prop="butxt">
          <el-input v-model="form.butxt"></el-input>
        </el-form-item>
        <!-- <el-form-item label="公司代码" prop="butxt">
          <el-input v-model="form.bukrs"></el-input>
        </el-form-item> -->
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="组长" value="leader"></el-option>
            <el-option label="组员" value="member"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择兼岗类型">
            <el-option label="主岗" value="FJ"></el-option>
            <el-option label="兼岗" value="SPJ"></el-option>
            <el-option label="其他" value="DPJ"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="form.comment"></el-input>
        </el-form-item>
      </el-form>
      <el-dialog width="768px" title="选择员工" :visible.sync="innerVisible" append-to-body @close="userclose">
        <userList :innerVisible="innerVisible" @getUser="getUser" @userclose="userclose" />
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import search from './search';
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from './table';
import userList from './userList';
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
    }
  },
  components: {
    search,
    btnComponent,
    tableComponent,
    userList
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
          label: '导入',
          func: ''
        },
        {
          label: '导出',
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
          label: '返回',
          func: ''
        }
      ],
      tableData: [],
      pageResult: {},
      searchForm: {},
      id: '',
      dialogTitle: '新增组成员',
      dialogFormVisible: false,
      innerVisible: false,
      form: {
        userId: '',
        userName: '',
        butxt: '',
        bukrs: '',
        role: '',
        status: '',
        type: '',
        comment: ''
      },
      rules: {
        userName: [{ required: true, message: '请选择员工', trigger: 'blur' }],
        butxt: [{ required: true, message: '请输入公司名', trigger: 'blur' }],
        bukrs: [{ required: true, message: '请输入公司代码', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        type: [{ required: true, message: '请选择岗位类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      multipleList: [] // 当前选中的业务组成员
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
  },
  methods: {
    ...mapActions(['groupMemberList', 'groupMemberStopDelete', 'groupMemberAdd']),
    onload() {
      this.groupMemberList({
        parameters: [
          { key: 'Q^group_id^SL', value: this.id },
          { key: 'Q^b.NAME_^SL', value: this.searchForm.nameOrCode },
          { key: 'Q^a.role^SL', value: this.searchForm.role },
          { key: 'Q^a.status^SL', value: this.searchForm.status },
          {
            key: 'Q^a.BELONG_TO^SL',
            value: 1
          }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('业务组成员列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
        this.$emit('updateTree');
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
    close() {
      this.form = {
        userId: '',
        userName: '',
        butxt: '',
        bukrs: '',
        role: '',
        status: '',
        type: '',
        comment: ''
      };
      this.dialogFormVisible = false;
    },
    userclose() {
      this.innerVisible = false;
    },
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.addOredit();
          this.groupMemberAdd(this.form).then(res => {
            this.dialogFormVisible = false;
            this.onload();
            if (res && res.state == '8848') {
              this.$message.error(res.info.message ? res.info.message : '分派失败');
            }
          });
        } else {
          return false;
        }
      });
    },
    // 按钮组点击事件
    btnClick(type) {
      // this.dialogTitle = '新增业务组';
      // this.dialogFormVisible = true;
      switch (type) {
        case '新增':
          this.dialogTitle = '新增组成员';
          this.dialogFormVisible = true;
          this.form['groupId'] = this.id;
          break;
        case '导入':
          break;
        case '导出':
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
            this.groupMemberStopDelete({
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
            this.groupMemberStopDelete({
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
      }
    },
    // 编辑组织
    btnEditClick(info) {
      this.dialogTitle = '编辑组成员';
      this.dialogFormVisible = true;
      this.form = info;
      console.log('编辑组成员', info);
    },
    // 启用
    btnStartClick(info) {
      if (info.status == 'actived') {
        this.$message.error('当前员工已启动');
        return;
      }
      this.form = info;
      this.form['status'] = 'actived';
      this.groupMemberAdd(this.form).then(res => {
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
      this.groupMemberStopDelete({
        ids: info.id,
        type: 'stop'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.groupMemberStopDelete({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    getUser(info) {
      console.log('选中员工', info);
      this.form['userId'] = info.id;
      this.form['userName'] = info.name;
      this.form['butxt'] = info.butxt;
      this.userclose();
    },
    // 选中业务组成员
    getMultipleSelection(list) {
      console.log('选中行', list);
      this.multipleList = list;
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
.teambox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-form {
    .el-form-item {
      .userbox {
        width: 188px !important;
        .el-input--small {
          width: auto !important;
        }
      }
      .el-form-item__label {
        width: auto !important;
        text-align: right;
      }
      .el-form-item__content {
        width: auto !important;
      }
      .el-select {
        width: 188px !important;
      }
    }
  }
}
</style>