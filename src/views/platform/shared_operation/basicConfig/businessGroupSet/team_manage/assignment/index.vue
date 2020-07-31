<template>
  <div class="teamasignbox">
    <search @closeBox="closeBox" @searchFormFunc="searchFormFunc" />
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @getGroupGoPage="getGroupGoPage" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitleFenpai" :visible.sync="dialogFormVisibleFenpai" width="660px" @close="closeone">
      <div class="rightFooterBox">
        <el-transfer :filterable="true" filter-placeholder="请输入人员名" v-model="shuttleValue" :data="shuttleData" :titles="['待分配列表', '已选组员']">
          <label slot="left-footer" style="font-size:12px;opacity:1;">注意：是否保留本组岗位及兼岗类型</label>
          <div slot="right-footer" style="height: 100%;line-height: 40px;">
            <el-select v-model="belongTo " placeholder="是否保留本组岗位">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
            <el-select v-model="concurrent" placeholder="请选择兼岗类型">
              <el-option label="主岗" value="FJ"></el-option>
              <el-option label="兼岗" value="SPJ"></el-option>
              <el-option label="其他" value="DPJ"></el-option>
            </el-select>
          </div>
        </el-transfer>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeone">取 消</el-button>
        <el-button type="primary" @click="submitFormone()">确 定</el-button>
      </div>
    </el-dialog>

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
import userList from '../userList';
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
  watch: {
    treeId: {
      handler(val) {
        if (val) {
          this.id = val;
          this.onload();
        }
      },
      immediate: true
    }
  },
  components: {
    search,
    btnComponent,
    tableComponent,
    userList
  },
  data() {
    return {
      btnList: [
        {
          label: '分派',
          func: ''
        }
      ],
      tableData: [],
      pageResult: { page: 1, totalCount: 0 },
      searchForm: {},
      id: '',
      dialogTitleFenpai: '分派成员',
      dialogFormVisibleFenpai: false,
      // 分派成员穿梭框数据
      filterMethod(query, item) {
        console.log('人员搜索',query,item.label)
        return item.label.indexOf(query) > -1;
      },
      shuttleData: [], // 代派人员列表
      shuttleValue: [], // 准备已派人员列表
      concurrent: 'FJ', // 兼岗类型
      belongTo: '0', // 是否保留本岗位
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
        comment: '',
        type: ''
      },
      rules: {
        userName: [{ required: true, message: '请选择员工', trigger: 'blur' }],
        butxt: [{ required: true, message: '请输入公司名', trigger: 'blur' }],
        // bukrs: [{ required: true, message: '请输入公司代码', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      multipleList: [] // 当前选中的业务组成员
    };
  },
  created() {
    this.tableData = require('./data.json').list;
  },
  methods: {
    ...mapActions([
      'groupMemberList',
      'groupMemberStopDelete',
      'groupMemberAdd',
      'groupMemberAssign'
    ]),
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
        console.log('业务组二级成员列表', res);
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
    // 按钮组点击事件
    btnClick(type) {
      switch (type) {
        case '分派':
          this.dialogTitleFenpai = '分派成员';
          this.shuttleValue = [];
          this.concurrent = 'FJ';
          this.belongTo = '0';
          this.dialogFormVisibleFenpai = true;
          this.groupMemberList({
            parameters: [{ key: 'Q^group_id^SL', value: this.busSet.parentId }],
            requestPage: {
              pageNo: 1,
              limit: 10000,
              totalCount: 45
            },
            sorts: []
          }).then(res => {
            console.log('业务组一级成员列表', res);
            var arry = [];
            for (var i = 0; i < res.dataResult.length; i++) {
              var item = res.dataResult[i];
              item['key'] = item.id;
              item['label'] = item.userName;
              arry.push(item);
            }
            this.shuttleData = arry;
          });
          break;
      }
    },
    closeone() {
      this.dialogFormVisibleFenpai = false;
    },
    // 确定分派
    submitFormone() {
      console.log('分配过去的人员', this.shuttleValue);
      if (this.shuttleValue.length < 1) {
        this.$message.error('请先分派人员再操作');
        return;
      }

      var ids = '';
      for (var i = 0; i < this.shuttleValue.length; i++) {
        var item = this.shuttleValue[i];
        if (i != this.shuttleValue.length - 1) {
          ids += item + ',';
        } else {
          ids += item;
        }
      }
      this.groupMemberAssign({
        ids: ids,
        groupId: this.id,
        status: 'actived',
        type: this.concurrent,
        belongTo: this.belongTo
      }).then(res => {
        this.onload();
        this.dialogFormVisibleFenpai = false;
        // console.log('分派结果返回111', res);
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '分派失败');
        }
      });
    },
    close() {
      this.form = {
        userId: '',
        userName: '',
        butxt: '',
        bukrs: '',
        role: '',
        status: '',
        comment: '',
        type: ''
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
          });
        } else {
          return false;
        }
      });
    },
    getUser(info) {
      console.log('选中员工', info);
      this.form['userId'] = info.id;
      this.form['userName'] = info.name;
      this.form['butxt'] = info.butxt;
      this.userclose();
    },
    // 编辑组成员
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
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    closeBox() {
      this.$emit('getGroupGoPage', {
        pageType: '组员管理'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.rightFooterBox {
  /deep/ .el-transfer-panel__filter {
    width: auto!important;
  }
}
.teamasignbox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-transfer {
    // display: flex;
    .el-transfer-panel__footer {
      text-align: center;
      .el-select {
        width: 105px;
        &:first-child {
          width: 80px;
        }
      }
    }
    .el-transfer__buttons {
      width: 101px;
      // text-align: center;
      .el-button {
        width: 36px;
        height: 36px;
        margin: 10px auto;
      }
    }
    .el-transfer-panel {
      width: calc((100% - 164px) / 2);
    }
  }
  /deep/ .el-form {
    .el-form-item {
      .userbox {
        width: 188px !important;
        .el-input--small {
          width: 120px !important;
        }
      }
      .el-form-item__label {
        width: 108px !important;
        text-align: right;
      }
      .el-select {
        width: 188px !important;
      }
    }
  }
}
</style>