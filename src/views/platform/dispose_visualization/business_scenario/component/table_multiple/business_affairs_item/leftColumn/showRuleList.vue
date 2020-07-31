<template>
  <div class="tablelist">
    <!-- 排版设置区域 -->
    <!-- 原理逻辑
      1、显示位置与样式无关，只与统计数据显示区域相关；
      2、单行时：只能设置 描述/单位/值显示关系、描述/单位/值分隔符和字段分隔符；
         上错行时：只能设置 行间距和列间距
     -->
    <div class="typesetting">
      <el-form :inline="true" label-position="top" label-width="80px" :model="formLabelAlign">
        <el-form-item label="显示位置">
          <el-select v-model="formLabelAlign.showPosition" placeholder="请选择">
            <el-option v-for="(item,index) in showPositionList" :key="'showPosition'+index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单行/错行">
          <el-select v-model="formLabelAlign.singleOrWrong" placeholder="请选择" @change="isSingleOrWrong">
            <el-option v-for="(item,index) in singleOrWrongList" :key="'singleOrWrong'+index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行间距">
          <el-input-number v-if="rowType=='单行'" disabled title="单行时：只能设置 描述/单位/值显示关系、描述/单位/值分隔符和字段分隔符" v-model="formLabelAlign.rowSpac" size="small" controls-position="right" :min="1" :max="10"></el-input-number>
          <el-input-number v-else v-model="formLabelAlign.rowSpac" size="small" controls-position="right" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="列间距">
          <el-input-number v-if="rowType=='单行'" disabled title="单行时：只能设置 描述/单位/值显示关系、描述/单位/值分隔符和字段分隔符" v-model="formLabelAlign.columnSpac" size="small" controls-position="right" :min="1" :max="10"></el-input-number>
          <el-input-number v-else v-model="formLabelAlign.columnSpac" size="small" controls-position="right" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="描述/单位/值显示关系">
          <el-select v-if="rowType=='上错行'" disabled title="上错行时：只能设置 行间距和列间距" v-model="formLabelAlign.valShow" placeholder="请选择">
            <el-option v-for="(item,index) in valShowList" :key="'valShow'+index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-else v-model="formLabelAlign.valShow" placeholder="请选择">
            <el-option v-for="(item,index) in valShowList" :key="'valShow'+index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段描述_值分隔符">
          <el-input v-if="rowType=='上错行'" disabled title="上错行时：只能设置 行间距和列间距" v-model="formLabelAlign.valSeparator"></el-input>
          <el-input v-else v-model="formLabelAlign.valSeparator"></el-input>
        </el-form-item>
        <el-form-item label="字段间分隔符">
          <el-input v-if="rowType=='上错行'" disabled title="上错行时：只能设置 行间距和列间距" v-model="formLabelAlign.fontSeparator"></el-input>
          <el-input v-else v-model="formLabelAlign.fontSeparator"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 字段设置区域 -->
    <div class="title">字段设置</div>
    <div class="btnlist">
      <el-button @click="fontBtnClick(item)" plain :type="item.type" size="mini" v-for="(item,index) in tableBtnList" :key="index" :icon="item.incon">{{item.label}}</el-button>
    </div>
    <div class="setFont">
      <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
        <el-table-column prop="fieldName" label="描述文字">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="descTxtSet(scope.row)">{{scope.row.fieldName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="BO字段">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="BOFontSelect(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标">
          <template slot-scope="scope">
            <i :class="'icon-'+scope.row.buttonIcon" @click="iconSet(scope.row)" style="color:#409EFF;font-size: 20px;cursor: pointer">
            </i>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sn" label="显示顺序">
        </el-table-column> -->
        <!-- <el-table-column prop="dataStatus" label="状态">
        </el-table-column> -->
      </el-table>
    </div>
    <!-- 弹窗区域start -->
    <dialogComponent :formLabelAlign="formLabelAlign" :deliverInfo="deliverInfo" :dialogTitle="dialogTitle" :dialogType="dialogType" :dialogFlag="dialogFlag" @savedialogAddEdit="savedialogAddEdit" />
    <!-- 弹窗区域end -->
  </div>
</template>

<script>
import dialogComponent from './dialog';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  components: {
    dialogComponent
  },
  props: {
    thisId: {
      type: String,
      default: ''
    },
    thisCode: {
      type: String,
      default: ''
    },
    tabelData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    btnClickType: {
      type: String,
      default: ''
    },
    btnClickFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    btnClickFlag: {
      handler(val) {
        this.btnClick(this.btnClickType);
      },
      immediate: true
    },
    tabelData: {
      handler(val) {
        if (val.length > 0) {
          return;
        }
        for (var i = 0; i < val.length; i++) {
          var item = val[i];
          var labelinfo = JSON.parse(item.label);
          item['fieldName'] = labelinfo.name;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      formLabelAlign: {
        showPosition: '',
        singleOrWrong: 'singleRow',
        rowSpac: 0,
        columnSpac: 0,
        valShow: 'descLeft',
        valSeparator: ':',
        fontSeparator: '|'
      },
      showPositionList: [
        {
          value: 'top',
          label: '顶端'
        },
        {
          value: 'rightBottom',
          label: '右下角'
        }
      ],
      singleOrWrongList: [
        {
          value: 'singleRow',
          label: '单行'
        },
        {
          value: 'topRow',
          label: '上错行'
        }
      ],
      valShowList: [
        {
          value: 'descLeft',
          label: '描述居左'
        },
        {
          value: 'valLeft',
          label: '值居左'
        }
      ],
      tableBtnList: [
        {
          label: '增加',
          incon: 'el-icon-plus',
          type: 'primary'
        },
        {
          label: '编辑',
          incon: 'el-icon-edit',
          type: 'primary'
        },
        {
          label: '删除',
          incon: 'el-icon-delete',
          type: 'danger'
        }
      ],
      // 弹窗有关
      dialogType: '',
      dialogFlag: false,
      dialogTitle: '',
      deliverInfo: {},
      currentRow: {},
      rowType: '' // 存储单行还是多行
    };
  },
  methods: {
    ...mapActions(['multipleLeftFontSetDefinitionSave']),
    // 新增或者编辑显示规则定义字段
    savedialogAddEdit(info) {
      var item = {
        btId: this.thisCode, //业务事务编码
        btKey: this.thisId, //业务事务主键
        currencyField: 'RMB', //币种字段名
        desGap: ':', // 描述/值分隔符
        fieldGap: '|', //字符段分隔符
        fieldName: info.descTxt, //取值字段名
        label: '', //标签样式
        labelPosition: 'top', //显示位置
        sn: 0,
        value: '' //字段样式
      };
      console.log('新增或者编辑显示规则定义字段', item);
      this.multipleLeftFontSetDefinitionSave(item).then(res => {
        console.log('新增或者编辑显示规则定义字段结果', res);
        this.$emit('update', {
          label: '显示规则定义',
          name: 'showRule'
        });
      });
    },
    isSingleOrWrong(type) {
      if (type == 'singleRow') {
        this.rowType = '单行';
        this.formLabelAlign['rowSpac'] = 0;
        this.formLabelAlign['columnSpac'] = 0;
        this.formLabelAlign['valShow'] = 'descLeft';
        this.formLabelAlign['valSeparator'] = ':';
        this.formLabelAlign['fontSeparator'] = '|';
      } else if (type == 'topRow') {
        this.rowType = '上错行';
        this.formLabelAlign['valShow'] = '';
        this.formLabelAlign['valSeparator'] = '';
        this.formLabelAlign['fontSeparator'] = '';
      }
      console.log('排班表单数据变化', type, this.rowType);
    },
    btnClick(type) {
      switch (type) {
        case '预览':
          this.dialogFlag = this.dialogFlag ? false : true;
          this.dialogTitle = '预览';
          this.dialogType = 'dialogPreview';
          break;
        case '保存':
          break;
      }
    },
    fontBtnClick(info) {
      switch (info.label) {
        case '增加':
          this.dialogFlag = this.dialogFlag ? false : true;
          this.dialogTitle = '新增字段';
          this.dialogType = 'dialogAddEdit';
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}') {
            this.dialogFlag = this.dialogFlag ? false : true;
            this.dialogTitle = '编辑字段';
            this.dialogType = 'dialogAddEdit';
          } else {
            this.$message.error('请先选择要编辑的数据。');
          }
          break;
        case '删除':
          break;
      }
    },
    // 选中表格字段行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // BO字段弹窗
    BOFontSelect(info) {
      this.dialogFlag = this.dialogFlag ? false : true;
      this.dialogTitle = 'BO字段';
      this.dialogType = 'dialogBO';
    },
    // 图标设置
    iconSet(info) {
      this.dialogFlag = this.dialogFlag ? false : true;
      this.dialogTitle = '图标设置';
      this.dialogType = 'dialogIconSet';
    },
    // 描述文字字体设置
    descTxtSet(info) {
      this.dialogFlag = this.dialogFlag ? false : true;
      this.dialogTitle = '字体设置';
      this.dialogType = 'dialogFontSet';
    }
  }
};
</script>

<style lang="scss" scoped>
.tablelist {
  height: calc(100% - 45px);
  box-sizing: border-box;
  overflow: auto;
  // background: yellow;
  .typesetting {
    width: 100%;
    height: 150px;
    overflow: auto;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: 4px;
    /deep/ .el-form-item {
      padding: 0;
      margin: 0;
      margin-right: 10px;
      .el-form-item__label {
        padding-bottom: 5px;
      }
      .el-input-number {
        .el-input-number__decrease {
          .el-icon-arrow-down {
            &::before {
              content: '\e6d8';
            }
          }
        }
        .el-input-number__increase {
          .el-icon-arrow-up {
            &::before {
              content: '\e6d9';
            }
          }
        }
      }
    }
  }
  .title {
    height: 30px;
    font-size: 18px;
    font-weight: bold;
    padding: 0 0 5px 10px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .btnlist {
    height: 45px;
    line-height: 45px;
    box-sizing: border-box;
    text-align: right;
  }
  .setFont {
    height: calc(100% - 30px - 45px - 150px);
    // background: red;
    overflow: auto;
  }
}
</style>