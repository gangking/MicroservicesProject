<template>
  <div class="integrate">
    <el-dialog ref="dialog" :title="dailogTitle" center :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" class="dialog" width="768px" @close="closeDialog" @open="getFormData" append-to-body>
      <div>
        <div class="header-input" ref="headerInput">
          <el-form :inline="true" :model="formInline" class="form-content" ref="ruleForm" :rules="rules" label-width="125px">

            <el-form-item label="是否需要整改" class="block">
              <el-select v-model="formInline.rectification" clearable placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="formInline.rectification==1" label="是否本岗位调整" class="block">
              <el-select v-model="formInline.postAdjustment" clearable placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="调整类型" prop="creditAdjustIds" class="block">
              <el-cascader :options="optionsType" :props="props" clearable v-model="formInline.creditAdjustIds" @change="creditTypechange"></el-cascader>
              <!-- <el-select v-model="formInline.creditAdjustIds" @change="creditTypechange" @clear="clearAdjust" clearable placeholder="请选择">
                <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
            </el-form-item>

            <el-form-item label="调整原因" prop="creditCaseId" class="block">
              <el-select v-model="formInline.creditCaseId" @change="creditTxtchange" clearable placeholder="请选择">
                <el-option v-for="item in optionsReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="审核意见" prop="desc" class="block areaWidth">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formInline.desc"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">确 认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  creditStatus,
  getCreditAdjustPoList,
  getCreditAdjustReson,
} from '@/api/platform/credit/adjust_type';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dailogTitle: {
      type: String,
      default: '',
    },
    creditData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      props: { multiple: false },
      dialogVisible: false,
      loading: false,
      optionsType: [],
      optionsReason: [],
      formInline: {
        desc: '',
        creditCaseId: '',
        creditCaseName: '',
        creditAdjustIds: '',
        creditAdjustName: '',
        rectification: 0,
        postAdjustment: 0,
      },
      rules: {
        creditCaseId: [{ required: true, message: '请选择调整原因', trigger: 'change' }],
        desc: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
        creditAdjustIds: [
          { required: true, message: '调整类型adjustType值为null', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.formInline = {
          desc: '',
          creditCaseId: '',
          creditCaseName: '',
          creditAdjustIds: '',
          creditAdjustName: '',
          rectification: 0,
          postAdjustment: 0,
        };
        this.dialogVisible = this.visible;
      },
      immediate: true,
    },
  },
  methods: {
    getFormData() {
      getCreditAdjustPoList({ bpmKey: this.creditData.appId }).then((res) => {
        // getCreditAdjustPoList({ bpmKey: '' }).then(res => {
        console.log('调整类型', res);
        for (const key in res.data) {
          if (res.data.hasOwnProperty(key)) {
            const ressonList = res.data[key];
            let optionList = {};
            optionList.label = key;
            optionList.children = [];
            ressonList.forEach((item, index) => {
              optionList.children.push({
                label: item.causeDescribe,
                value: item.id,
              });
              this.optionsReason.push({
                label: item.causeDescribe,
                value: item.id,
              });

              optionList.value = item.adjustType;
            });

            this.optionsType.push(optionList);
          }
        }
        // this.optionsType = res.data.map(item => {
        //   console.log('调整类型item',item)
        //   return {
        //     label: item.adjustDescribe,
        //     value: item.adjustType
        //   };
        // });
        // console.log('调整类型',res,this.optionsType);
      });
    },
    clearAdjust() {
      this.optionsReason = [];
      this.formInline.creditCaseId = '';
    },
    // 调整原因值变化
    creditTxtchange(txtId) {
      // console.log('调整原因值变化', txtId,this.optionsReason);
      this.optionsReason.forEach((item) => {
        if (item.value == txtId) {
          this.formInline.creditCaseName = item.label;
          this.$set(this.formInline, 'desc', item.label);
        }
      });
    },
    // 调整类型值变化
    creditTypechange(typeId) {
      // console.log('调整类型值变化', typeId);
      this.optionsType.forEach((item) => {
        if (item.value == typeId) {
          this.formInline.creditAdjustName = item.label;
        }
      });
      this.formInline.creditCaseId = '';
      getCreditAdjustReson({
        parameters: [
          {
            key: 'Q^ADJUST_TYPE^SL',
            value: typeId,
          },
        ],
        requestPage: {
          limit: 1000,
          pageNo: 1,
        },
        sorts: [
          {
            field: 'SERIAL_NUMBER_',
            order: 'SERIAL_NUMBER_',
          },
        ],
      }).then((res) => {
        let data = res.data.dataResult.filter((item) => {
          return item.status == 1;
        });
        this.optionsReason = data.map((item) => {
          return {
            label: item.causeDescribe,
            value: item.id,
          };
        });
      });
    },
    clearForm() {
      this.$refs['ruleForm'].resetFields();
    },
    closeDialog() {
      this.$emit('close', false);
    },
    confirm() {
      // console.log('测试是否本岗位调整',this.formInline);
      var params = JSON.parse(JSON.stringify(this.formInline));
      params['creditAdjustIds'] = params.creditAdjustIds.join(',');
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('creditStatus', params);
        } else {
          return false;
        }
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.block {
  width: 70%;
}
/deep/.el-form-item__content {
  width: calc(100% - 125px);
}
.areaWidth {
  width: 100%;
  /deep/.el-form-item__content {
    width: calc(100% - 125px);
    .el-textarea {
      width: 80%;
    }
  }
}
.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
/deep/ .el-input__inner {
  width: 215px;
}
/deep/ .el-textarea {
  width: 215px;
}
</style>
