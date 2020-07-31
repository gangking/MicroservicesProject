<template>
  <div class="integrate">
    <el-dialog ref="dialog" title="审批同意" center :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" class="dialog" width="50%" @close="closeDialog" @open="getFormData" append-to-body>
      <div>
        <div class="header-input" ref="headerInput">
          <el-form :inline="true" :model="formInline" class="form-content" ref="ruleForm" :rules="rules" label-width="125px">
            <!-- <el-form-item label="调整类型" prop="creditAdjustId" class="block">
              <el-select
                v-model="formInline.creditAdjustId"
                @change="creditTypechange"
                clearable
                @clear="clearAdjust"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="调整原因" prop="creditCaseId" class="block">
              <!-- <el-select
                v-model="creditCaseIdsArr"
                clearable
                multiple
                @clear="clearReason"
                @change="creditReasonchange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsReason"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-cascader :options="optionsType" :props="props" clearable v-model="creditCaseIdsArr" @clear="clearReason" @change="creditReasonchange"></el-cascader>
            </el-form-item>

            <el-form-item label="审批意见" prop="opinion" class="block areaWidth">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formInline.opinion"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">同 意</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { creditStatus, getCreditAdjustPoList } from '@/api/platform/credit/adjust_type';
import { showLoading, hideLoading } from '@/utils/loading';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('ibps/compositeDolog');
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    itemVal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(['isHasFormExceptions'])
  },
  data() {
    return {
      dialogVisible: true,
      props: { multiple: true },
      loading: false,
      optionsType: [],
      optionsReason: [],
      creditCaseIdsArr: [],
      creditReasonIds: [],
      formInline: {
        creditCaseIds: '',
        creditAdjustId: '',
        opinion: ''
      },
      rules: {
        // creditCaseId: [
        //   { required: true, message: "请选择调整原因", trigger: "change" }
        // ],
        // creditAdjustId: [
        //   { required: true, message: "请选择调整类型", trigger: "change" }
        // ],
        // opinion: [
        //   { required: true, message: "请输入审批意见", trigger: "blur" }
        // ]
      }
    };
  },
  created() {},
  mounted() {
    this.getFormData();
  },
  watch: {
    visible: {
      // handler: function(val, oldVal) {
      //   this.dialogVisible = this.visible;
      // },
      // immediate: true
    }
  },
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    },
    outerSkin: {
      from: 'outerSkin',
      default() {
        return this;
      }
    }
  },
  methods: {
    getFormData() {
      getCreditAdjustPoList({ bpmKey: this.itemVal.creditData.appId }).then(res => {
        let resData = res.data;
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const ressonList = resData[key];
            let optionList = {};
            optionList.label = key;
            optionList.children = [];
            ressonList.forEach((item, index) => {
              optionList.children.push({
                label: item.causeDescribe,
                value: item.id
              });
              this.optionsReason.push({
                label: item.causeDescribe,
                value: item.id
              });

              optionList.value = item.adjustType;
            });

            this.optionsType.push(optionList);
          }
        }
      });
    },
    clearReason() {
      this.formInline.opinion = '';
    },
    //调整原因带出 文字
    creditReasonchange(ids) {
      this.creditReasonIds = [];
      this.formInline.opinion = '';
      this.creditCaseIdsArr.forEach(list => {
        this.optionsReason.forEach(reson => {
          if (reson.value == list[1]) {
            this.formInline.opinion += reson.label + ',';
            this.creditReasonIds.push(list[1]);
          }
        });
      });
    },
    clearForm() {
      this.$refs['ruleForm'].resetFields();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    confirm() {
      if (this.isHasFormExceptions) {
        // this.$message('你有例外消息未处理，请前往例外区查看')
        this.$message.error('您仍有未处理的例外消息，请前往例外区处理。');
        return;
      }
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          showLoading();
          this.formInline.creditCaseIds = this.creditReasonIds.join(',');
          creditStatus({
            ...this.formInline,
            ...this.itemVal.creditData
          }).then(res => {
            hideLoading();
            if (res.state == 200) {
              this.$message({
                message: '成功',
                type: 'success'
              });
              this.outerSkin.handleClose();
              this.ibpsPayable.$emit('exit-multi-form', 'exit-multi-form');
              this.closeDialog();
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  components: {}
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
/deep/ .el-cascader {
  width: 100%;
}
/deep/ .el-textarea {
  width: 215px;
}
</style>
