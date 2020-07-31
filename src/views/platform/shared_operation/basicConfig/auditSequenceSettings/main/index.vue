<template>
  <div class="orgabox">
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <div class="formBox">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
          <el-form-item label="方案名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入方案名称"></el-input>
          </el-form-item>
          <el-form-item label="选择组织" prop="orgId">
            <el-select @change="getSharePool" v-model="form.orgId" placeholder="请选择组织">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item) in orgGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="前置稽核池" prop="oneAuditPoolId">
            <el-select @change="activeOneSharePool" v-model="form.oneAuditPoolId" placeholder="请选择前置稽核池">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item) in oneAuditPoolNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="稽核池" prop="twoAuditPoolId">
            <el-select @change="activeTwoSharePool" v-model="form.twoAuditPoolId" placeholder="请选择稽核池">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item) in twoAuditPoolNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="procesListBox">
          <div class="title">
            流程环节设置
            <el-button @click="addProcesListBox" type="primary" size="mini" icon="el-icon-plus" circle></el-button>
          </div>
          <div class="item" v-for="(item,index) in form.bpmList" :key="index">
            <el-form :inline="true" :model="item" label-position="left">
              <el-form-item label="流程名称">
                <el-select filterable  @change="getBpmNode" @focus="nodeIndex=index" v-model="item.defId" placeholder="请选择流程">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="item in definitionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="稽核环节">
                <el-select filterable v-model="item.nodeId" placeholder="请选择稽核环节">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="item in item.nodeList" :key="item.nodeId" :label="item.name" :value="item.nodeId"></el-option>
                </el-select>
                <!-- // 删除 -->
                <el-button @click="delprocesListBox(index)" type="primary" size="mini" icon="el-icon-minus" circle></el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

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
      btnList: [
        {
          label: '新增',
          type: 'add'
        }
      ],
      tableData: [],
      dialogTitle: '',
      dialogFormVisible: false,
      form: {
        name: '',
        orgId: '',
        orgName: '',
        oneAuditPoolName: '',
        oneAuditPoolId: '',
        twoAuditPoolName: '',
        twoAuditPoolId: '',
        bpmList: [
          {
            bpmName: '',
            defId: '',
            nodeName: '',
            nodeId: '',
            nodeList: []
          }
        ]
      },
      oneAuditPoolNameList: [],
      twoAuditPoolNameList: [],
      orgGroupList: [],
      definitionList: [],
      nodeBpmList: [],
      nodeIndex: 0,
      pageResult: { page: 1, totalCount: 0 },
      rules: {
        orgId: [{ required: true, message: '请选择组织', trigger: 'blur' }],
        twoAuditPoolId: [{ required: true, message: '请选择稽核池', trigger: 'blur' }],
        name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }]
      }
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.groupTree().then(res => {
      console.log('获取组织列表', res);
      this.orgGroupList = res;
      this.onload();
      this.definitionQuery({
        parameters: [{ key: 'Q^name_^SL', value: '' }],
        requestPage: { pageNo: 1, limit: 1000 },
        sorts: []
      }).then(res => {
        console.log('获取流程列表', res);
        this.definitionList = res.dataResult;
      });
    });
  },
  methods: {
    ...mapActions([
      'auditPlanList',
      'auditPlanListAddEdit',
      'auditPlanListDelete',
      'groupTree',
      'definitionQuery',
      'queryBpmNode',
      'sharedPollList'
    ]),
    onload() {
      this.auditPlanList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核顺序列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    },
    activeOneSharePool(info) {
      console.log('选择稽核池1', info);
      this.oneAuditPoolNameList.forEach(item => {
        if (item.id == info) {
          this.form.oneAuditPoolName = item.name;
        }
      });
    },
    activeTwoSharePool(info) {
      console.log('选择稽核池2', info);
      this.twoAuditPoolNameList.forEach(item => {
        if (item.id == info) {
          this.form.twoAuditPoolName = item.name;
        }
      });
    },
    getBpmNode(val) {
      // 根据流程查环节
      this.queryBpmNode({
        defId: val
      }).then(res => {
        console.log('环节列表', res, this.nodeIndex);
        this.form.bpmList[this.nodeIndex].nodeList = res;
        // this.nodeBpmList = res;
      });
    },
    getBpmNode2(val, index) {
      // 根据流程查环节
      return this.queryBpmNode({
        defId: val
      }).then(res => {
        return res;
      });
    },
    // 根据组织查稽核池
    getSharePool(val) {
      this.orgGroupList.forEach(item => {
        if (item.id == val) {
          this.form.orgName = item.name;
        }
      });
      this.sharedPollList({
        parameters: [
          { key: 'Q^share_pool^SL', value: 'Y' },
          { key: 'Q^org_group_id^SL', value: val }
        ],
        requestPage: {
          pageNo: 1,
          limit: 100000,
          totalCount: 6
        },
        sorts: []
      }).then(res => {
        console.log('共享池列表', res);
        this.oneAuditPoolNameList = res.dataResult;
        this.twoAuditPoolNameList = res.dataResult;
        if (res.dataResult.length > 0) {
          this.form.oneAuditPoolId = '';
          this.form.twoAuditPoolId = res.dataResult[0].id;
          this.form.oneAuditPoolName = '';
          this.form.twoAuditPoolName = res.dataResult[0].name;
        }
      });
    },
    // 根据组织查稽核池
    getSharePool2(val) {
      this.orgGroupList.forEach(item => {
        if (item.id == val) {
          this.form.orgName = item.name;
        }
      });
      this.sharedPollList({
        parameters: [
          { key: 'Q^share_pool^SL', value: 'Y' },
          { key: 'Q^org_group_id^SL', value: val }
        ],
        requestPage: {
          pageNo: 1,
          limit: 100000,
          totalCount: 6
        },
        sorts: []
      }).then(res => {
        console.log('共享池列表2', res);
        this.oneAuditPoolNameList = res.dataResult;
        this.twoAuditPoolNameList = res.dataResult;
      });
    },
    // 添加流程环节
    addProcesListBox(info) {
      this.form.bpmList.push({
        bpmName: '',
        defId: '',
        nodeName: '',
        nodeId: '',
        nodeList: []
      });
    },
    // 删除流程环节
    delprocesListBox(index) {
      this.form.bpmList.splice(index, 1);
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult.page = page;
      this.onload();
    },
    close() {
      this.form = {
        name: '',
        orgId: '',
        orgName: '',
        oneAuditPoolName: '',
        oneAuditPoolId: '',
        twoAuditPoolName: '',
        twoAuditPoolId: '',
        bpmList: [
          {
            bpmName: '',
            defId: '',
            nodeName: '',
            nodeId: '',
            nodeList: []
          }
        ]
      };
      this.dialogFormVisible = false;
    },
    // 选中执行组织
    activeGroup() {
      for (var i = 0; i < this.orgGroupList.length; i++) {
        var item = this.orgGroupList[i];
        if (item.id == this.form.name) {
          this.form['orgGroupName'] = item.name;
        }
      }
    },
    // 提交组织表单
    submitForm(formName) {
      var form = JSON.parse(JSON.stringify(this.form));
      form.bpmList.forEach(item => {
        this.definitionList.forEach(item2 => {
          if (item.defId == item2.id) {
            item.bpmName = item2.name;
          }
        });
        item.nodeList.forEach(item3 => {
          if (item.nodeId == item3.nodeId) {
            item.nodeName = item3.name;
          }
        });
      });
      console.log('提交稽核数据', form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.oneAuditPoolId == this.form.twoAuditPoolId) {
            this.$message.error('前置稽核池与稽核池不能一样。');
            return;
          }
          form.bpmList.forEach(itemB => {
            delete itemB.nodeList;
          });
          this.auditPlanListAddEdit(form).then(res => {
            this.dialogFormVisible = false;
            this.onload();
          });
        } else {
          return false;
        }
      });
    },
    // 编辑稽核顺序
    btnEditClick(info) {
      this.dialogTitle = '编辑稽核顺序';
      this.dialogFormVisible = true;
      // 查询出稽核列表；
      this.getSharePool2(info.orgId);
      // console.log('稽核顺序编辑了', info);
      this.$nextTick(() => {
        this.form = info;
        this.form.bpmList.forEach((item, index) => {
          this.getBpmNode2(item.defId, index).then(list => {
            // console.log('编辑稽核顺序查找对应的环节列表', item, index, list);
            this.$set(item, 'nodeList', list);
          });
        });
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.auditPlanListDelete({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 按钮组点击事件
    btnClick(type) {
      switch (type) {
        case '新增':
          this.dialogTitle = '新增稽核顺序';
          this.form = {
            name: '',
            orgId: '',
            orgName: '',
            oneAuditPoolName: '',
            oneAuditPoolId: '',
            twoAuditPoolName: '',
            twoAuditPoolId: '',
            bpmList: [
              {
                bpmName: '',
                defId: '',
                nodeName: '',
                nodeId: '',
                nodeList: []
              }
            ]
          };
          this.dialogFormVisible = true;
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
  background: white;
  .formBox {
    height: 350px;
    overflow: auto;
  }
  .procesListBox {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    // border-top: 1px solid #ccc;
    .title {
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding: 10px 0;
      margin: 10px 0;
      box-sizing: border-box;
      /deep/ .el-button {
        margin-left: 10px;
      }
    }
  }
  /deep/ .el-form {
    .el-form-item {
      .el-form-item__label {
        width: 108px !important;
        text-align: right;
      }
      .el-select--small {
        width: 188px !important;
      }
      .el-date-editor {
        width: 188px !important;
      }
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>