<template>
  <div class="leftBox">
    <div class="businessObjBox">
      <el-form :inline="true" label-position="top" :model="formInline" class="demo-form-inline">
        <el-form-item label="业务对象模块选择">
          <el-select filterable  @change="activeObj" v-model="formInline.businessObjMode" placeholder="请选择业务对象模块选择">
            <el-option :label="item.name" v-for="(item) in businessObjModeList" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnListBox">
      <el-button type="primary" plain @click="addpriority">增加</el-button>
      <el-button type="danger" plain @click="deletePriority">删除</el-button>
      <el-button type="success" plain @click="isEditableFunc">{{isEditable?'显示':'编辑'}}</el-button>
      <el-button type="success" plain @click="savePrioritySetting">保存</el-button>
      <el-button type="success" plain>复制</el-button>
      <el-button type="danger" plain @click="closeBox">关闭</el-button>
    </div>
    <div class="tabelBox">
      <el-table ref="singleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column prop="rangeNo" label="范围编号">
        </el-table-column>
        <el-table-column prop="name" label="范围名称">
        </el-table-column>
        <el-table-column prop="primaryRangeName" label="一级范围">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'deleted'">停用</span>
            <span v-else-if="scope.row.status =='actived'">启用</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editTxt(scope.row)">编辑文本</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%" @close="closeDialogForm">
      <el-form label-position="top" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="范围编号" prop="rangeNo">
          <el-input v-model="form.rangeNo"></el-input>
        </el-form-item>
        <el-form-item label="范围名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="一级派单范围" prop="rangeNo">
          <el-select v-model="form.rangeNo" placeholder="请选择一级派单范围">
            <el-option :label="item" v-for="(item,index) in levelList" :key="index" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogForm">取 消</el-button>
        <el-button type="primary" @click="addPriorityItem('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  props: {
    treeId: {
      type: String,
      default: ''
    },
    condtion: {
      type: String,
      default: ''
    },
    condtionAttr: {
      type: String,
      default: ''
    },
    primaryRange:{
      type:Object,
      default:()=>{
        return {}
      }
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
  data() {
    return {
      formInline: {
        businessObjMode: '', // 业务对象,
        businessObjValue: {}
      },
      businessObjModeList: [], // 业务对象列表
      tableData: [],
      id:'',
      currentRow: {}, // 单选
      isEditable: false,
      dialogTitle: '新增二级派单范围',
      dialogFormVisible: false,
      levelList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      form: {
        rangeNo: '',
        name: '',
        level:'2',
        bsaList: [],
        status: '',
        parentId: '',
        boId: '',
        boCode: '',
        boName: '',
        rangeType: '',
        condtion: '',
        condtionAttr:''
      },
      rules: {
        rangeNo: [{ required: true, message: '请输入二级派单范围编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入二级派单范围名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择二级派单范围状态', trigger: 'blur' }]
      }
    };
  },
  created() {
    // this.tableData = require('./testData/table.json').data;
    this.queryBusObj({
      parameters: [],
      requestPage: { pageNo: 1, limit: 1000, totalCount: 156 },
      sorts: []
    }).then(res => {
      console.log('业务对象', res);
      this.businessObjModeList = res.dataResult;
      this.formInline['businessObjMode'] = res.dataResult[0].id;
      this.formInline['businessObjValue'] = res.dataResult[0];
      this.$emit('getActiveBusObj', this.formInline.businessObjValue);
      this.onload();
    });
  },
  methods: {
    ...mapActions([ 'queryBusObj','queryRangeList', 'rangeAdd', 'rangeStopDelete']),
    closeBox() {
      this.$emit('getGroupGoPage', {
        pageType: '任务分配'
      });
    },
    onload() {
      this.queryRangeList({
        parameters: [{ key: 'Q^parent_id^SL', value: this.id }],
        requestPage: {
          pageNo: 1,
          limit: 100000,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('二级派单范围列表', res,this.primaryRange);
        this.tableData = res.dataResult;
        if (this.tableData.length > 0) {
          for (var i = 0; i < this.tableData.length;i++) {
            var item = this.tableData[i];
            item['primaryRangeName'] = this.primaryRange.name;
            // primaryRange
          }
          // 默认选中第一个
          this.handleCurrentChange(res.dataResult[0]);
          this.$refs.singleTable.setCurrentRow(res.dataResult[0]);
        }
      });
    },
    // 选择业务对象
    activeObj() {
      console.log('选择业务对象', this.formInline);
      for (var i = 0; i < this.businessObjModeList.length; i++) {
        var item = this.businessObjModeList[i];
        if (item.id == this.formInline.businessObjMode) {
          this.formInline.businessObjValue = item;
          this.form['boName'] = item.name;
          this.form['boCode'] = item.code;
          this.form['boId'] = item.id;
          this.$emit('getActiveBusObj', this.formInline.businessObjValue);
        }
      }
    },
    // 新增
    addpriority() {
      this.dialogTitle = '新增二级派单范围';
      this.form = {
        boId: this.formInline.businessObjValue.id,
        boCode: this.formInline.businessObjValue.code,
        boName: this.formInline.businessObjValue.rangeName,
        rangeNo: '',
        name: '',
        level:'2',
        bsaList: [],
        status: '',
        parentId: this.id,
        rangeType: '',
        condtion: '',
        condtionAttr:''
      };
      this.dialogFormVisible = true;
    },
    // 删除
    deletePriority() {
      if (JSON.stringify(this.currentRow) == '{}') {
        this.$message.error('请选择要删除的二级派单范围。');
        return;
      }
      this.rangeStopDelete({
        ids: this.currentRow.id,
        type: 'deleted'
      }).then(res => {
        this.onload();
      });
    },
    // 编辑文本
    editTxt(info) {
      this.dialogTitle = '编辑二级派单范围';
      this.form = info;
      this.form.level='2';
      this.dialogFormVisible = true;
    },
    // 表单提交
    addPriorityItem(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.rangeAdd(this.form).then(res => {
            this.onload();
            this.closeDialogForm();
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消
    closeDialogForm() {
      this.form = {
        rangeNo: '',
        name: '',
        bsaList: [],
        status: '',
        parentId: '',
        boId: '',
        level:'2',
        boCode: '',
        boName: '',
        rangeType: '',
        condtion: '',
        condtionAttr:''
      };
      this.dialogFormVisible = false;
    },
    // 是否编辑
    isEditableFunc() {
      this.isEditable = !this.isEditable;
      this.$emit('isEditableFunc');
    },
    // 单选事件
    handleCurrentChange(val) {
      this.currentRow = val;
      this.$emit('activePriority', val);
    },
    // 保存二级派单范围（设置完先决条件情况）相当于编辑
    savePrioritySetting() {
      var params = JSON.parse(JSON.stringify(this.currentRow));
      console.log('保存二级派单范围（设置完先决条件情况）相当于编辑', this.currentRow);
      // 设置最新的业务对象
      params['boName'] = this.formInline.businessObjValue.name;
      params['boCode'] = this.formInline.businessObjValue.code;
      params['boId'] = this.formInline.businessObjValue.id;

      params['condtionAttr'] = this.condtionAttr;
      params['condtion'] = this.condtion;
      params['level']='2';
      this.rangeAdd(params).then(res => {
        this.onload();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.leftBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > div {
    box-sizing: border-box;
  }
  .businessObjBox {
    height: 75px;
    border-bottom: 1px solid #ccc;
    /deep/ .el-form {
      width: 100%;
      .el-select {
        width: 100%;
      }
      .el-form-item__label {
        padding: 0;
        font-weight: bold;
      }
    }
    // background: green;
  }
  .btnListBox {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #ccc;
    text-align: left;
    // background: pink;
  }
  .tabelBox {
    flex: 1;
    overflow: auto;
    // background: red;
  }
  /deep/ .el-dialog {
    .el-select {
      width: 100%;
    }
  }
}
</style>