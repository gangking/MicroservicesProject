<template>
  <div class="orgabox">
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <div class="formBox">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
          <el-form-item label="方案名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="源业务场景应用" prop="bsaName">
            <div class="bsaList">
              <div class="newSelect" @click="openScenario('源业务场景')">
                <el-tag v-for="item in businessScenario" :key="item.bsaKey" :type="item.bsaKey">
                  {{item.bsaName}}
                </el-tag>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="目标业务场景" prop="targetBsaName">
            <div class="bsaList">
              <div class="newSelect" @click="openScenario('目标业务场景')">
                <el-tag v-for="item in targetBusinessScenario" :key="item.bsaKey" :type="item.bsaKey">
                  {{item.bsaName}}
                </el-tag>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="业务情形" prop="targetBsiCode">
            <el-select v-model="form.targetBsiCode" placeholder="业务情形">
              <el-option v-for="(item) in busSitList" :key="item.id" :label="item.bsiDesc" :value="item.bsiCode"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="detailPoListBox">
          <div class="title">
            字段设置
            <el-button @click="adddetailPoListBox" type="primary" size="mini" icon="el-icon-plus" circle></el-button>
          </div>
          <div class="item" v-for="(item,index) in form.detailPoList" :key="index">
            <el-form :inline="true" :model="item" label-position="left">
              <el-form-item label="字段名称">
                <el-select filterable @change="activeColunmName" @focus="activeIndex=index" v-model="item.colunmName" placeholder="源字段">
                  <el-option v-for="item in busTypeItemList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-input :title="item.colunmCode" v-model="item.colunmCode" placeholder="字段编码"></el-input>
                <span class="el-icon-more"></span>
                <el-select filterable @change="activeTargetColunmName" @focus="activeIndex=index" v-model="item.targetColunmName" placeholder="目标字段">
                  <el-option v-for="item in targetBusTypeItemList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-input :title="item.targetColunmCode" v-model="item.targetColunmCode" placeholder="目标字段编码"></el-input>
                <!-- // 删除 -->
                <el-button @click="deldetailPoListBox(index)" type="primary" size="mini" icon="el-icon-delete" circle></el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

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
import scenarioList from '@/views/platform/shared_operation/basicConfig/businessGroupSet/task_allocation/oneLevelSetup/scenario.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
const { mapActions: mapActionsTwo } = createNamespacedHelpers('ibps/frontVisualizations');
import { getSrcRead } from '@/api/platform/bpmn/bpmTriggerFlow';
export default {
  components: {
    btnComponent,
    tableComponent,
    scenarioList
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
      innerVisibleTitle: '',
      innerVisible: false,
      activeIndex: 0, // 当前字段索引
      busSitList: [], // 目标业务情形列表
      boCodeVal: '', // 业务对象编码
      targetBoCodeVal: '', // 目标业务对象编码
      busTypeItemList: [], // 源业务对象Bo字段列表
      targetBusTypeItemList: [], // 目标业务对象Bo字段列表

      businessScenario: [],
      targetBusinessScenario: [],
      form: {
        name: '', // 调整单名称
        bsaCode: '', // 源应用编码
        bsaName: '', // 源业务场景应用名称
        targetBsaCode: '', // 目标应用编码
        targetBsaName: '', // 目标业务场景应用名称
        targetBsiCode: '', // 目标业务情形编码
        detailPoList: [
          {
            targetBoCode: '', // 目标业务对象编码
            targetColunmName: '', // 目标字段名称
            targetColunmCode: '', // 目标字段编码
            boCode: '', // 业务对象编码
            colunmName: '', // 字段名称
            colunmCode: '' // 字段编码
          }
        ]
      },
      orgGroupList: [],
      pageResult: { page: 1, totalCount: 0 },
      rules: {
        name: [{ required: true, message: '请输入调整单名称', trigger: 'blur' }],
        bsaName: [{ required: true, message: '请选择源业务场景应用', trigger: 'blur' }],
        targetBsaName: [{ required: true, message: '请选择目标业务场景', trigger: 'blur' }],
        targetBsiCode: [{ required: true, message: '请选择目标业务情形', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.onload();
  },
  methods: {
    ...mapActions([
      'auditAdjustmentList',
      'getBoList',
      'auditAdjustmentListAddEdit',
      'auditAdjustmentListDelete',
      'groupTree'
    ]),
    ...mapActionsTwo(['queryBusinessSituation']),
    onload() {
      this.auditAdjustmentList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核调整单列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    },
    // 源字段值发生变化
    activeColunmName(id) {
      this.busTypeItemList.forEach(item => {
        if (item.id == id) {
          this.$set(this.form.detailPoList[this.activeIndex], 'colunmName', item.name);
          this.form.detailPoList[this.activeIndex].colunmCode = item.code;
        }
      });
    },
    // 目标字段值发生变化
    activeTargetColunmName(id) {
      this.targetBusTypeItemList.forEach(item => {
        if (item.id == id) {
          this.$set(this.form.detailPoList[this.activeIndex], 'targetColunmName', item.name);
          this.form.detailPoList[this.activeIndex].targetColunmCode = item.code;
        }
      });
    },
    openScenario(title) {
      this.innerVisibleTitle = title;
      this.innerVisible = true;
    },
    userclose() {
      this.innerVisible = false;
    },
    // 获取选中业务场景
    getBusScenario(list) {
      console.log('获取选中业务场景', list);
      if (list.length == 1) {
        var arry = list;
        arry[0]['bsaKey'] = arry[0].key;
        arry[0]['bsaName'] = arry[0].describe;

        if (this.innerVisibleTitle == '源业务场景') {
          this.businessScenario = arry;
          this.form.bsaCode = arry[0].bsaKey;
          this.form.bsaName = arry[0].bsaName;
          this.boCodeVal = arry[0].boKey;
          console.log('源Bo字段列表', this.boCodeVal);
          getSrcRead({
            boCode: this.boCodeVal,
            boVersion: '1'
          }).then(res => {
            this.busTypeItemList = JSON.parse(res.data.attrs);
            console.log('源Bo字段列表', this.busTypeItemList);
          });
          this.userclose();
        } else {
          this.targetBusinessScenario = arry;
          this.form.targetBsaCode = arry[0].bsaKey;
          this.form.targetBsaName = arry[0].bsaName;
          this.targetBoCodeVal = arry[0].boKey;

          this.form.bsCode = arry[0].bsKey;
          // 查询业务情形列表
          this.queryBusinessSituation({
            bsKey: this.form.bsCode
          }).then(list => {
            console.log('获取业务情形列表,', list);
            this.busSitList = list;
          });

          getSrcRead({
            boCode: this.targetBoCodeVal,
            boVersion: '1'
          }).then(res => {
            this.targetBusTypeItemList = JSON.parse(res.data.attrs);
            console.log('目标Bo字段列表', this.targetBusTypeItemList);
          });
          this.userclose();
        }
      } else {
        this.$message.error('源业务场景和目标业务场景都只能选择一个');
      }
    },
    // 添加字段环节
    adddetailPoListBox(info) {
      this.form.detailPoList.push({
        targetBoCode: '', // 目标业务对象编码
        targetColunmName: '', // 目标字段名称
        targetColunmCode: '', // 目标字段编码
        boCode: '', // 业务对象编码
        colunmName: '', // 字段名称
        colunmCode: '' // 字段编码
      });
    },
    // 删除字段环节
    deldetailPoListBox(index) {
      this.form.detailPoList.splice(index, 1);
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult.page = page;
      this.onload();
    },
    close() {
      this.activeIndex = 0; // 当前字段索引
      this.targetBusinessScenario = [];
      this.businessScenario = [];
      this.busSitList = [];
      this.busTypeItemList = [];
      this.targetBusTypeItemList = [];
      this.form = {
        name: '', // 调整单名称
        bsaCode: '', // 源应用编码
        bsCode: '', // 用于查业务情形
        bsaName: '', // 源业务场景应用名称
        targetBsaCode: '', // 目标应用编码
        targetBsaName: '', // 目标业务场景应用名称
        targetBsiCode: '', // 目标业务情形编码
        detailPoList: [
          {
            targetBoCode: '', // 目标业务对象编码
            targetColunmName: '', // 目标字段名称
            targetColunmCode: '', // 目标字段编码
            boCode: '', // 业务对象编码
            colunmName: '', // 字段名称
            colunmCode: '' // 字段编码
          }
        ]
      };
      this.dialogFormVisible = false;
    },
    // 选中执行组织
    activeGroup() {
      for (var i = 0; i < this.orgGroupList.length; i++) {
        var item = this.orgGroupList[i];
        if (item.id == this.form.schemeName) {
          this.form['orgGroupName'] = item.name;
        }
      }
    },
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var form = JSON.parse(JSON.stringify(this.form));
          // delete from.businessScenario;
          // delete from.targetBusinessScenario;
          if (form.detailPoList.length > 0) {
            form.detailPoList.forEach(item => {
              item['targetBoCode'] = this.targetBoCodeVal; // 目标业务对象编码
              item['boCode'] = this.boCodeVal; // 业务对象编码
            });
          }
          console.log('新增调整单参数', form);

          this.auditAdjustmentListAddEdit(form).then(res => {
            this.dialogFormVisible = false;
            this.onload();
          });
        } else {
          return false;
        }
      });
    },
    // 编辑稽核调整单
    btnEditClick(info) {
      this.dialogTitle = '编辑稽核调整单';
      this.activeIndex = 0; // 当前字段索引

      this.targetBusinessScenario = [
        {
          bsaKey: info.targetBsaCode,
          bsaName: info.targetBsaName
        }
      ];
      this.businessScenario = [
        {
          bsaKey: info.bsaCode,
          bsaName: info.bsaName
        }
      ];

      this.form = info;
      // 查询业务情形列表
      this.queryBusinessSituation({
        bsKey: this.form.bsCode
      }).then(list => {
        console.log('获取业务情形列表,', list);
        this.busSitList = list;
      });
      console.log('编辑稽核调整单', info);
      this.dialogFormVisible = true;
      if (info.detailPoList.length < 1) {
        return;
      }
      this.boCodeVal = info.detailPoList[0].boCode; // 业务对象编码
      this.targetBoCodeVal = info.detailPoList[0].targetBoCode; // 目标业务对象编码

      getSrcRead({
        boCode: this.boCodeVal,
        boVersion: '1'
      }).then(res => {
        this.busTypeItemList = JSON.parse(res.data.attrs);
        console.log('源Bo字段列表', this.busTypeItemList);
      });
      getSrcRead({
        boCode: this.targetBoCodeVal,
        boVersion: '1'
      }).then(res => {
        this.targetBusTypeItemList = JSON.parse(res.data.attrs);
        console.log('目标Bo字段列表', this.targetBusTypeItemList);
      });
      // this.busTypeItemList = []; // 源业务对象Bo字段列表
      // this.targetBusTypeItemList = []; // 目标业务对象Bo字段列表

      // console.log('编辑组织', info);
    },
    // 删除
    btnDeleteClick(info) {
      this.auditAdjustmentListDelete({
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
          this.dialogTitle = '新增稽核调整单';
          this.activeIndex = 0; // 当前字段索引
          this.targetBusinessScenario = [];
          this.businessScenario = [];
          this.busSitList = [];
          this.busTypeItemList = [];
          this.targetBusTypeItemList = [];
          this.form = {
            name: '', // 调整单名称
            bsaCode: '', // 源应用编码
            bsaName: '', // 源业务场景应用名称
            targetBsaCode: '', // 目标应用编码
            targetBsaName: '', // 目标业务场景应用名称
            targetBsiCode: '', // 目标业务情形编码
            detailPoList: [
              {
                targetBoCode: '', // 目标业务对象编码
                targetColunmName: '', // 目标字段名称
                targetColunmCode: '', // 目标字段编码
                boCode: '', // 业务对象编码
                colunmName: '', // 字段名称
                colunmCode: '' // 字段编码
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
    /deep/ .el-form {
      .el-form-item {
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
        .el-form-item__label {
          width: 120px !important;
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
  .detailPoListBox {
    width: 100%;
    // padding: 0 10px;
    box-sizing: border-box;
    // border-top: 1px solid #ccc;
    .title {
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding: 10px;
      margin: 10px 0;
      box-sizing: border-box;
      /deep/ .el-button {
        margin-left: 10px;
        font-size: 14px;
      }
    }
    .item {
      /deep/ .el-form {
        .el-form-item {
          .el-select--small {
            width: 130px !important;
          }
          .el-input--small {
            width: 120px !important;
          }
          .el-date-editor {
            width: 120px !important;
          }
          .el-button {
            margin-left: 10px;
            color: #f56c6c;
            background-color: white;
            border: 1px solid #f56c6c00;
            font-size: 16px;
            &:hover {
              color: white;
              background-color: #f56c6c;
            }
          }
        }
      }
    }
  }
}
</style>