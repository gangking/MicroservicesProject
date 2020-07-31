<template>
  <div class="ruleBox">
    <div class="boxFrom">
      <el-form :inline="true" :rules="rules" ref="ruleForm" :model="formInline" class="demo-form-inline">
        <el-form-item label="设置手动派单规则编码:" prop="ruleNo">
          <el-input v-model="formInline.ruleNo" placeholder="设置手动派单规则编码"></el-input>
        </el-form-item>
        <el-form-item label="设置手动派单规则名称:" prop="name">
          <el-input v-model="formInline.name" placeholder="设置手动派单规则名称"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :rules="rules" ref="ruleForm2" :model="formInline" class="demo-form-inline">
        <el-form-item label="规则状态:" prop="status">
          <el-select v-model="formInline.status" placeholder="选择规则状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核标准时长:" prop="auditStandardDuration">
          <el-input v-model="formInline.auditStandardDuration" placeholder="审核标准时长"></el-input>
        </el-form-item>
      </el-form>
      <div class="lastForm">
        <el-form :rules="rules" ref="ruleForm3" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="超时单据是否回滚到共享池:">
            <el-radio v-model="formInline.overtimeReturn " label="Y">是</el-radio>
            <el-radio v-model="formInline.overtimeReturn " label="N">否</el-radio>
          </el-form-item>
          <el-form-item label="占位">
            <el-input v-model="formInline.auditStandardDuration" placeholder="审核标准时长" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>

    </div>

    <div class="btnBox">
      <el-button size="medium" type="primary" @click="onSubmit('ruleForm','ruleForm2','ruleForm3')">确认</el-button>
      <el-button size="medium" type="primary" @click="closeBox">取消</el-button>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    isAddEditTitle: {
      type: String,
      default: ''
    },
    formRule: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    isAddEditTitle: {
      handler(val) {
        if (val == '编辑手动派单规则') {
          var rule = this.formRule;
          this.formInline = rule;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      formInline: {
        ruleNo: '',
        name: '',
        status: '',
        ruleType:'MAN',
        auditStandardDuration: '',
        overtimeReturn : 'Y',
        billTimeList:[]
      },
      rules: {
        ruleNo: [{ required: true, message: '请输入规则编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入规则名', trigger: 'blur' }],
        status: [{ required: true, message: '请选择规则状态', trigger: 'blur' }],
        auditStandardDuration:[{ required: true, message: '请选择规则状态', trigger: 'blur' }]
      },
    };
  },
  methods: {
    onSubmit(...formName) {
      // console.log('submit!');
      this.$refs[formName[0]].validate(valid => {
        if (valid) {
          // for (var i = 0; i < this.formInline.billTimeList.length; i++) {
          //   var item = this.formInline.billTimeList[i];
          //   item['startTime'] = item.time[0];
          //   item['endTime'] = item.time[1];
          // }
          // console.log('提交规则!', this.formInline);
          // this.$emit('addAutoRule', this.formInline);
          // this.closeBox();
          this.$refs[formName[1]].validate(valid => {
            if (valid) {
              this.$refs[formName[2]].validate(valid => {
            if (valid) {
              console.log('提交规则!', this.formInline);
              this.$emit('addAutoRule', this.formInline);
          this.closeBox();
            } else {
              return false;
            }
          });
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    closeBox() {
      // this.$emit('getGroupGoPage', {
      //   pageType: '派单策略'
      // });
      this.formInline = {
        ruleNo: '',
        name: '',
        status: '',
        ruleType:'MAN',
        auditStandardDuration: '',
        overtimeReturn : 'Y',
        billTimeList:[]
      };
      this.$emit('closeAddBox');
    }
  }
};
</script>
<style lang="scss" scoped>
.ruleBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  > div {
    // border: 1px solid #ccc;
    // border-radius: 4px;
  }
  .boxFrom {
    height: 120px;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    // line-height: 100px;
    .lastForm {
      /deep/ .el-form {
        .el-form-item {
          &:last-child{
            opacity: 0;
          }
        }
      }
    }
    /deep/ .el-form {
      // display: inline-block;
      .el-form-item__label {
        width: 250px;
      }
      &:last-child {
        .el-form-item__label {
          width: 250px;
        }
        // &:last-child{
        //   .el-form-item {
        //     opacity: 0;
        //   }
        // }
      }
      .el-form-item__content {
        display: inline-block;
        .el-input {
          width: 362px;
        }
        // line-height: 100px;
      }
    }
  }

  .btnBox {
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 0;
    /deep/ .el-button {
      margin-right: 20px;
    }
  }
  // background: red;
}
</style>