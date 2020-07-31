<template>
  <div class="fontAddEditBox">
    <div class="form">
      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="字段描述" prop="descTxt">
          <el-input v-model="ruleForm.descTxt" placeholder='请输入描述文字'></el-input>
        </el-form-item>
        <el-form-item label="字段值" prop="value">
          <el-input v-model="ruleForm.value" placeholder='请输入字段值'></el-input>
        </el-form-item>
        <el-form-item label="字段币种" prop="currencyField">
          <el-input v-model="ruleForm.currencyField" placeholder='请输入字段币种'></el-input>
        </el-form-item>
        <el-form-item label="BO字段" prop="BOFont">
          <!-- <el-input v-model="ruleForm.BOFont" placeholder='请选择BO字段'></el-input> -->
          <el-select filterable v-model="ruleForm.BOFont" multiple placeholder="选择BO字段(多选可搜索)">
            <el-option v-for="item in boList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input @focus="innerVisible=true" v-model="ruleForm.icon" placeholder='请选择图标'></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog width="60%" title="选择图标" :visible.sync="innerVisible" append-to-body>
      <div class="fontIconList">
        <div v-for="(item,index) in fontIconList" @click="activeIcon(item.properties.name,index)" :key="index" :class="item.isActive==0?'item icon-'+item.properties.name:'item active icon-'+item.properties.name"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-button @click="closedialogAddEdit">关 闭</el-button>
    <el-button type="primary" @click="saveDialogIconSet('ruleForm')">保 存</el-button>
  </div>

</template>

<script>
import { getSrcRead } from '@/api/platform/bpmn/bpmTriggerFlow';
// getSrcRead({
//   boCode: this.boCodeVal,
//   boVersion: '1'
// }).then(res => {
//   this.busTypeItemList = JSON.parse(res.data.attrs);
//   console.log('源Bo字段列表', this.busTypeItemList);
// });
export default {
  inject: ['kDispose'],
  props: {
    deliverInfo: {
      type: Object,
      default: () => {
        return {
          descTxt: '',
          BOFont: [],
          icon: '',
          value: '',
          currencyField: ''
        };
      }
    }
  },
  watch: {
    deliverInfo: {
      handler(val) {
        this.ruleForm = val;
      },
      immediate: true
    }
  },
  data() {
    return {
      innerVisible: false,
      fontIconList: [],
      boList: [],
      ruleForm: {},
      rules: {
        currencyField: [{ required: true, message: '请输入字段币种', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字段值', trigger: 'blur' }],
        descTxt: [{ required: true, message: '请输入描述文字', trigger: 'blur' }],
        BOFont: [{ required: true, message: '请选择BO字段', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择图标', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.fontIconList = require('../../../../../../../../../../assets/fonts/iconfontmergesapfont/selection').icons;
    this.fontIconList.forEach(item => {
      item['isActive'] = 0;
    });
    // 查询所有的BO字段
    console.log('当前业务场景信息', this.kDispose.sceneInfo);
    getSrcRead({
      boCode: this.kDispose.sceneInfo.topBo,
      boVersion: '1'
    }).then(res => {
      this.boList = JSON.parse(res.data.attrs);
      console.log('源Bo字段列表', this.boList);
    });
  },
  methods: {
    activeIcon(icon, index) {
      this.$set(this.ruleForm, 'icon', icon);
      this.fontIconList.forEach(item => {
        item.isActive = 0;
      });
      this.fontIconList[index].isActive = 1;
    },
    saveDialogIconSet(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('savedialogAddEdit', this.ruleForm);
        } else {
          return false;
        }
      });
    },
    closedialogAddEdit() {
      this.ruleForm = {
        descTxt: '',
        BOFont: [],
        icon: '',
        value: '',
        currencyField: ''
      };
      this.$emit('closedialogAddEdit');
    }
  }
};
</script>

<style lang="scss" scoped>
.fontAddEditBox {
  .form {
    height: 420px;
    overflow: auto;
  }
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
.fontIconList {
  width: 100%;
  height: 350px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  // background: red;
  .item {
    width: 20%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #409eff;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    // &:hover {
    //   color: white;
    //   background: #409eff;
    // }
  }
  .active {
    color: white;
    background: #409eff;
  }
}
</style>