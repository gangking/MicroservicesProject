<template>
  <div class="sharebox">
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%" @close="close">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="top">
        <el-form-item label="共享池名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="共享池别名" prop="groupAlias">
          <el-input :disabled="dialogTitle=='编辑共享池'" v-model="form.groupAlias"></el-input>
        </el-form-item>
        <el-form-item label="共享池描述" prop="groupNote">
          <el-input v-model="form.groupNote"></el-input>
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
  props: {
    treeId: {
      type: String,
      default: ''
    }
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
  components: {
    btnComponent,
    tableComponent
  },
  data() {
    return {
      btnList: [
        {
          label: '新增共享池',
          type: 'add'
        }
      ],
      tableData: [],
      pageResult:{},
      id: '',
      dialogTitle: '新增共享池',
      dialogFormVisible: false,
      form: {
        name: '',
        groupAlias: '',
        groupNote: '',
        status: ''
      },
      rules: {
        name: [{ required: true, message: '请输入共享池名称', trigger: 'blur' }],
        groupAlias: [{ required: true, message: '请输入共享池别名', trigger: 'blur' }],
        groupNote: [{ required: true, message: '请输入共享池描述', trigger: 'blur' }],
        status: [{ required: true, message: '请选择组织状态', trigger: 'blur' }]
      }
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    // this.onload();
  },
  methods: {
    ...mapActions(['sharedPollList', 'saveCascade','stopOrDeleteShared']),
    onload() {
      this.sharedPollList({
        parameters: [
          { key: 'Q^share_pool^SL', value: 'Y' },
          { key: 'Q^org_group_id^SL', value: this.id }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 6
        },
        sorts: []
      }).then(res => {
        console.log('共享池列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
        this.$emit('updateTree');
      });
    },
    handleCurrentChange(page){
      this.pageResult.page = page;
      this.onload()
    },
    // 按钮点击事件
    btnClick(type) {
      this.dialogTitle = '新增共享池';
      this.dialogFormVisible = true;
    },
    // 编辑组织
    btnEditClick(info) {
      this.dialogTitle = '编辑共享池';
      this.dialogFormVisible = true;
      this.form = info;
      // console.log('编辑组织', info);
    },
    // 启用
    btnStartClick(info) {
      if (info.status == 'actived') {
        this.$message.error('当前组织已启动');
        return;
      }
      this.saveCascade({
        pk: '',
        id: info.id,
        name: info.name,
        groupAlias: info.groupAlias,
        groupNote: info.groupNote,
        sharePool: 'Y',
        orgGroupId: this.id,
        status: 'actived'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 停用
    btnStopClick(info) {
      if (info.status == 'deleted') {
        this.$message.error('当前组织已停用');
        return
      }
      this.stopOrDeleteShared({
        ids: info.id,
        type: 'stop'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.stopOrDeleteShared({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    close() {
      this.form = { name: '', groupAlias: '', groupNote: '', status: '' };
      this.dialogFormVisible = false;
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
      var parmas = {
        pk: '',
        name: this.form.name,
        groupAlias: this.form.groupAlias,
        groupNote: this.form.groupNote,
        sharePool: 'Y',
        orgGroupId: this.id,
        status: this.form.status
      };
      switch (this.dialogTitle) {
        case '新增共享池':
          this.saveCascade(parmas).then(res => {
            console.log('新增共享池',res)
            this.dialogFormVisible = false;
            this.onload();
            if (res.state != 200) {
              this.$message.error('新增失败，注意：共享池别名不可重复！');
              return;
            }
          });
          break;
        case '编辑共享池':
          parmas['id'] = this.form.id;
          this.saveCascade(parmas).then(res => {
            console.log('编辑共享池',res)
            this.dialogFormVisible = false;
            this.onload();
            if (res.state != 200) {
              this.$message.error('编辑失败，注意：共享池别名不可重复！');
              return;
            }
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sharebox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>