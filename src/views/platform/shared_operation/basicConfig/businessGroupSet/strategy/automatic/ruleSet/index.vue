<template>
  <div class="ruleBox">
    <div class="boxFrom">
      <el-form :inline="true" :rules="rules" ref="ruleForm" :model="formInline" class="demo-form-inline">
        <el-form-item label="规则编码:" prop="ruleNo">
          <el-input v-model="formInline.ruleNo " placeholder="规则编码"></el-input>
        </el-form-item>
        <el-form-item label="规则名称:" prop="name">
          <el-input v-model="formInline.name " placeholder="规则名称"></el-input>
        </el-form-item>
        <el-form-item label="审核标准时长:" prop="auditStandardDuration">
          <el-input v-model="formInline.auditStandardDuration" placeholder="审核标准时长"></el-input>
        </el-form-item>
        <el-form-item label="规则状态:" prop="status">
          <el-select v-model="formInline.status" placeholder="选择规则状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="超时单据是否回滚到共享池:">
          <el-radio v-model="formInline.overtimeReturn " label="Y">是</el-radio>
          <el-radio v-model="formInline.overtimeReturn " label="N">否</el-radio>
        </el-form-item>
      </el-form>
    </div>

    <div class="setTime">
      <h3>设置派单时间
        <el-button type="primary" icon="el-icon-plus" circle @click="addTime"></el-button>
      </h3>
      <div class="fromBox">
        <el-form v-for="(item,index) in formInline.billTimeList" :key="index" :inline="true" :model="item" class="demo-form-inline">
          <el-form-item label="设置季节或月份:">
            <el-select v-model="item.workingDateId" placeholder="设置季节或月份">
              <el-option v-for="(item,index) in seasonMonthVal" :key="index" :label="item.label" :value="item.val" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自动派单起止时间:">
            <el-time-picker v-model="item.startTime" value-format="HH:mm:ss" :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }" placeholder="开始时间">
            </el-time-picker>
            <el-time-picker v-model="item.endTime" value-format="HH:mm:ss" :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }" placeholder="结束时间">
            </el-time-picker>
            <el-button type="primary" icon="el-icon-minus" circle @click="removeTime(index)"></el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>

    <div class="btnBox">
      <el-button size="medium" type="primary" @click="onSubmitRuleForm('ruleForm')">确认</el-button>
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
        if (val == '编辑自动派单规则') {
          console.log('编辑自动派单规则', this.formRule);
          var rule = this.formRule;
          this.formInline = JSON.parse(JSON.stringify(this.formRule));
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
        ruleType: 'AUTO',
        overtimeReturn: 'Y',
        auditStandardDuration: '',
        billTimeList: [
          {
            workingDateId: '',
            startTime: '',
            endTime: ''
          }
        ]
      },
      rules: {
        ruleNo: [{ required: true, message: '请输入规则编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入规则名', trigger: 'blur' }],
        status: [{ required: true, message: '请选择规则状态', trigger: 'blur' }],
        auditStandardDuration: [{ required: true, message: '请输入审核标准时长', trigger: 'blur' }]
      },
      formTime1: {
        workingDateId: '',
        time: []
      },
      formTime2: {
        workingDateId: '',
        time: []
      },
      formTime3: {
        workingDateId: '',
        time: []
      },
      seasonMonthVal: [
        {
          label: '全年',
          val: 'all'
          // disabled: true
        },
        {
          label: '夏季工作制',
          val: 'summer'
          // disabled: true
        },
        {
          label: '冬季工作制',
          val: 'winter'
          // disabled: true
        },
        {
          label: '一月',
          val: '1'
        },
        {
          label: '二月',
          val: '2'
        },
        {
          label: '三月',
          val: '3'
        },
        {
          label: '四月',
          val: '4'
        },
        {
          label: '五月',
          val: '5'
        },
        {
          label: '六月',
          val: '6'
        },
        {
          label: '七月',
          val: '7'
        },
        {
          label: '八月',
          val: '8'
        },
        {
          label: '九月',
          val: '9'
        },
        {
          label: '十月',
          val: '10'
        },
        {
          label: '十一月',
          val: '11'
        },
        {
          label: '十二月',
          val: '12'
        }
      ]
    };
  },
  methods: {
    // 新增时间设置框
    addTime() {
      var arry = JSON.parse(JSON.stringify(this.formInline.billTimeList));
      arry.push({
        workingDateId: '',
        startTime: '',
        endTime: ''
      });
      this.$set(this.formInline, 'billTimeList', arry);
    },
    removeTime(index) {
      var arr = JSON.parse(JSON.stringify(this.formInline.billTimeList));
      arr.splice(index, 1);
      this.$set(this.formInline, 'billTimeList', arr);
    },
    // 删除时间设置框
    subtracTime() {},
    // 提交规则
    onSubmitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('addAutoRule', this.formInline);
          this.closeBox();
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
        ruleType: 'AUTO',
        overtimeReturn: 'Y',
        auditStandardDuration: '',
        billTimeList: [
          {
            workingDateId: '',
            startTime: '',
            endTime: ''
          }
        ]
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
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .boxFrom {
    height: 100px;
    // overflow-x: auto;
    text-align: center;
    // line-height: 60px;
    /deep/ .el-form {
      position: relative;
      top: -10px;
      .el-form-item {
        line-height: 80px;
        &:last-child {
          position: relative;
          top: -50px;
        }
        .el-form-item__content {
          display: inline-block;
          line-height: 80px;
          .el-form-item__error {
            top: 70%;
          }
          .el-input--small {
            width: 150px;
          }
        }
      }
    }
  }
  .setTime {
    height: 300px;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    // overflow: auto;
    /deep/ .el-button {
      float: right;
      position: relative;
      z-index: 10;
    }
    h3 {
      text-align: left;
      height: 40px;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;
    }
    .fromBox {
      // background: red;
      height: calc(100% - 60px);
      overflow: auto;
      /deep/ .el-button {
        margin-left: 10px;
      }
    }
  }

  .btnBox {
    height: 80px;
    line-height: 80px;
    text-align: center;
    /deep/ .el-button {
      margin-right: 20px;
    }
  }
  // background: red;
}
</style>