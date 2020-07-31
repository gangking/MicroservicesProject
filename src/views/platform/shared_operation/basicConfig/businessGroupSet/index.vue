<template>
  <div class="setbox">
    <search @searchFormFunc="searchFormFunc" />
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @getChildren="getChildren" @btnDeleteClick="btnDeleteClick" :tableData="tableData" @getGroupGoPage="getGroupGoPage" @getMultipleSelection="getMultipleSelection" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="业务组编号" prop="groupNo">
          <el-input v-model="form.groupNo"></el-input>
        </el-form-item>
        <el-form-item label="业务组名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="最大在手单量" prop="maxBillNumber">
          <el-input v-model="form.maxBillNumber"></el-input>
        </el-form-item>
        <el-form-item label="基准工作量" prop="baseBillNumber">
          <el-input v-model="form.baseBillNumber"></el-input>
        </el-form-item>
        <el-form-item label="触发自动派单" prop="autoTriggerNumber">
          <el-input v-model="form.autoTriggerNumber"></el-input>
        </el-form-item>
        <el-form-item label="单次手动提单" prop="onceManPullNumber">
          <el-input v-model="form.onceManPullNumber"></el-input>
        </el-form-item>
        <el-form-item label="单次自动派单" prop="onceAutoPullNumber">
          <el-input v-model="form.onceAutoPullNumber"></el-input>
        </el-form-item>
        <el-form-item label="触发手动派单" prop="manTriggerNumber">
          <el-input v-model="form.manTriggerNumber"></el-input>
        </el-form-item>
        <el-form-item label="规则序号" prop="ruleSnNo">
          <el-input v-model="form.ruleSnNo"></el-input>
        </el-form-item>
        <el-form-item label="主副岗派单阀值" prop="deliverThreshold">
          <el-input v-model="form.deliverThreshold"></el-input>
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
import search from './search';
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from './table';
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
    treeClick: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    treeClick: {
      handler(val) {
        console.log('点击树', val);
        this.id = this.treeId;
        this.onload();
      },
      immediate: true
    }
  },
  components: {
    search,
    btnComponent,
    tableComponent
  },
  data() {
    return {
      btnList: [
        {
          label: '新增一级',
          type: ''
        },
        {
          label: '导入',
          type: ''
        },
        {
          label: '导出',
          type: ''
        },
        {
          label: '批量删除',
          type: ''
        },
        {
          label: '批量停用',
          type: ''
        }
      ],
      tableData: [],
      pageResult: {},
      searchForm: {},
      id: '',
      setGroupId: '',
      dialogTitle: '新增业务组',
      dialogFormVisible: false,
      form: {
        groupNo: '',
        name: '',
        maxBillNumber: '',
        baseBillNumber: '',
        autoTriggerNumber: '',
        onceManPullNumber: '',
        onceAutoPullNumber: '',
        manTriggerNumber: '',
        ruleSnNo: '',
        status: '',
        deliverThreshold: ''
      },
      rules: {
        groupNo: [{ required: true, message: '请输入业务组编码', trigger: 'blur' }],
        deliverThreshold: [{ required: true, message: '请输入主副岗派单阀值', trigger: 'blur' }],
        name: [{ required: true, message: '请输入业务组名称', trigger: 'blur' }],
        maxBillNumber: [{ required: true, message: '请输入最大在手单量', trigger: 'blur' }],
        baseBillNumber: [{ required: true, message: '请输入基准工作量', trigger: 'blur' }],
        autoTriggerNumber: [{ required: true, message: '请输入自动触发提取量', trigger: 'blur' }],
        onceManPullNumber: [{ required: true, message: '请输入单次手动提取量', trigger: 'blur' }],
        onceAutoPullNumber: [{ required: true, message: '请输入单次自动提取量', trigger: 'blur' }],
        manTriggerNumber: [{ required: true, message: '请输入手动触发提取量', trigger: 'blur' }],
        ruleSnNo: [{ required: true, message: '请输入规则序号', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      multipleList: [], // 当前选中的业务组数组
      levelVal: 1
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    // this.onload();
  },
  methods: {
    ...mapActions(['busGroupList', 'busGroupAddEdit', 'busGroupDeleteStop']),
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    onload() {
      this.busGroupList({
        parameters: [
          { key: 'Q^parent_id^SL', value: this.id },
          { key: 'Q^group_no^SL', value: this.searchForm.number },
          { key: 'Q^name^SL', value: this.searchForm.name },
          { key: 'Q^status^SL', value: this.searchForm.status }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('业务组列表', res);
        res.dataResult.forEach(item => {
          item['levelVal'] = this.levelVal;
        });
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
        this.$emit('updateTree');
      });
    },
    handleCurrentChange(page) {
      this.pageResult['page'] = page;
      this.onload();
    },
    searchFormFunc(info) {
      this.searchForm = info;
      this.onload();
    },
    close() {
      this.form = {
        groupNo: '',
        name: '',
        maxBillNumber: '',
        baseBillNumber: '',
        autoTriggerNumber: '',
        onceManPullNumber: '',
        onceAutoPullNumber: '',
        manTriggerNumber: '',
        ruleSnNo: '',
        status: ''
      };
      this.dialogFormVisible = false;
    },
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.addOredit();
          this.busGroupAddEdit(this.form).then(res => {
            if (res.state == 200) {
              this.dialogFormVisible = false;
              this.onload();
            } else {
              this.$message.error('保存失败！注意业务组编码不可重复！');
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
            this.busGroupDeleteStop({
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
            this.busGroupDeleteStop({
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
        case '新增一级':
          this.dialogTitle = '新增一级';
          this.form = {
            groupNo: '',
            name: '',
            maxBillNumber: '',
            baseBillNumber: '',
            autoTriggerNumber: '',
            onceManPullNumber: '',
            onceAutoPullNumber: '',
            manTriggerNumber: '',
            ruleSnNo: '',
            status: ''
          };
          this.dialogFormVisible = true;
          this.form['parentId'] = this.id;
          this.form['orgGroupId'] = this.busSet.groupId;
          this.form['level'] = this.levelVal;
          break;
        case '新增下级':
          if (this.multipleList.length == 1) {
            this.dialogTitle = '新增下级';
            this.form = {
              groupNo: '',
              name: '',
              maxBillNumber: '',
              baseBillNumber: '',
              autoTriggerNumber: '',
              onceManPullNumber: '',
              onceAutoPullNumber: '',
              manTriggerNumber: '',
              ruleSnNo: '',
              status: ''
            };
            this.dialogFormVisible = true;
            this.form['parentId'] = this.multipleList[0].id;
            this.form['orgGroupId'] = this.busSet.groupId;
            this.form['level'] = this.multipleList[0].level + 1;
            console.log('新增下级参数', this.form);
          } else {
            this.$message.error('请至少选择一行且只能选择一行再进行操作');
          }
          break;
      }
    },
    // 编辑业务组
    btnEditClick(info) {
      this.dialogTitle = '编辑业务组';
      this.dialogFormVisible = true;
      this.form = info;
      console.log('编辑业务组', info);
    },
    // 启用
    btnStartClick(info) {
      if (info.status == 'actived') {
        this.$message.error('当前组织已启动');
        return;
      }
      this.form = info;
      this.form['status'] = 'actived';
      this.busGroupAddEdit(this.form).then(res => {
        this.dialogFormVisible = false;
        this.onload();
      });
    },
    // 查看下级
    getChildren(info) {
      console.log('查看下级', info);
      this.id = info.id;
      this.levelVal = info.level + 1;
      this.levelVal = this.levelVal == 3 ? 2 : this.levelVal;
      this.onload();
    },
    // 停用
    btnStopClick(info) {
      if (info.status == 'deleted') {
        this.$message.error('当前组织已停用');
        return;
      }
      this.busGroupDeleteStop({
        ids: info.id,
        type: 'stop'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.busGroupDeleteStop({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 获取选中
    getMultipleSelection(list) {
      console.log('选中行', list);
      this.multipleList = list;
    }
  }
};
</script>

<style lang="scss" scoped>
.setbox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-form {
    .el-form-item {
      .el-form-item__label {
        width: 120px !important;
        text-align: right;
      }
    }
  }
}
</style>