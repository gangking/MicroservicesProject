<template>
  <div class="orgabox">
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%" @close="close">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="top">
        <el-form-item label="组织名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="组织状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择组织状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  components: {
    btnComponent,
    tableComponent
  },
  data() {
    return {
      dialogTitle: '新增组织',
      dialogFormVisible: false,
      form: {
        name: '',
        status: ''
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择组织状态', trigger: 'blur' }]
      },
      btnList: [
        {
          label: '新增组织',
          type: 'add'
        }
      ],
      tableData: [],
      pageResult:{page: 1, totalCount: 0 }
    };
  },
  created() {
    this.onload();
  },
  methods: {
    ...mapActions(['getGroupList', 'addGroup', 'editGroup', 'deleteOrStopGroup']),
    // 数据初始化
    onload() {
      this.getGroupList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('获取组织列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
        // 刷新树形列表
        this.$emit('updateTree');
      });
    },
    // 翻页
    handleCurrentChange(page) {
      console.log('翻页',page)
      this.pageResult.page = page;
      this.onload();
    },
    close() {
      this.form = { name: '', status: '' };
      this.dialogFormVisible = false;
    },
    // 按钮点击事件
    btnClick(type) {
      this.dialogTitle = '新增组织';
      this.dialogFormVisible = true;
    },
    // 编辑组织
    btnEditClick(info) {
      this.dialogTitle = '编辑组织';
      this.dialogFormVisible = true;
      this.form = info;
      // console.log('编辑组织', info);
    },
    // 停用
    btnStopClick(info) {
      if (info.status == 'deleted') {
        this.$message.error('当前组织已停用');
        return;
      }
      this.deleteOrStopGroup({
        ids: info.id,
        type: 'stop'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 启用
    btnStartClick(info) {
      if (info.status == 'actived') {
        this.$message.error('当前组织已启动');
        return;
      }
      this.editGroup({
        id: info.id,
        name: info.name,
        status: 'actived'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.deleteOrStopGroup({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addOredit();
        } else {
          return false;
        }
      });
    },
    addOredit() {
      switch (this.dialogTitle) {
        case '新增组织':
          this.addGroup(this.form).then(res => {
            // 关闭弹窗
            this.dialogFormVisible = false;
            // 刷新表格
            this.onload();
            // console.log('新增组织',res)
            if (res && res.state == '8848') {
              this.$message.error(res.info.message ? res.info.message : '新增失败，注意：组织名称不可重复！');
            }
          });
          break;
        case '编辑组织':
          this.editGroup(this.form).then(res => {
            // console.log('编辑组织',res)
            // 关闭弹窗
            this.dialogFormVisible = false;
            // 刷新表格
            this.onload();
            if (res && res.state == '8848') {
              this.$message.error(res.info.message ? res.info.message : '编辑失败，注意：组织名称不可重复！');
            }
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.orgabox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>