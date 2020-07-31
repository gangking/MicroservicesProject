<template>
  <el-form-item v-if="!hidden" :prop="field.name" :rules="rules" :label="field.label">
    <ibps-approval-opinion
      v-model="dataModel"
      :enable-common="field.field_options.common_statment"
    />
    <div v-if="field && field.desc" class="ibps-help-block">{{ field.desc }}</div>
  </el-form-item>
</template>
<script>
import FormUtil from "@/business/platform/form/utils/formUtil";

import IbpsApprovalOpinion from "@/business/platform/bpmn/components/approval-opinion";

export default {
  components: {
    IbpsApprovalOpinion
  },
  props: {
    models: [Object, Array], // 所有对象数据
    defaultValue: Object,
    field: Object, // 字段

    attrs: Object, // 属性字段
    labelWidth: String,
    rights: {
      // 字段权限
      type: [String, Object],
      default: "e"
    },
    isReadonly: {
      // 只读
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataModel: this.models[this.field.name] || ""
    };
  },
  computed: {
    label() {
      // 显示的文本
      return this.$utils.isNotEmpty(this.field.field_options.units)
        ? this.field.label + "(" + this.field.field_options.units + ")"
        : this.field.label;
    },
    hidden() {
      // 是否隐藏
      return this.rights === "h" || this.field.field_type === "hidden";
    },
    readonly() {
      // 是否只读
      return this.isReadonly ? true : this.rights === "r";
    },
    required() {
      // 必填  【只读隐藏，都设置非必填】
      return this.readonly || this.hidden
        ? false
        : this.rights === "b"
        ? true
        : this.field.field_options.required || false;
    },
    readonlyStyle() {
      if (!this.readonly) {
        return "text";
      }
      return this.attrs.read_style ? this.attrs.read_style : "text";
    },
    rules() {
      if (this.readonly || this.hidden) {
        return;
      }
      return FormUtil.buildFormRules(this.field, this.required);
    }
  },
  watch: {
    dataModel: {
      handler(val) {
        this.handleModels(val);
      },
      deep: true,
      immediate: true
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.field.name];
      }
    },
    rights: {
      handler(val, oldVal) {
        console.log("rights", val);
      }
    }
  },
  methods: {
    handleModels(val) {
      this.models[this.field.name] = val;
      this.$emit("update:models", {
        ...this.models,
        [this.field.name]: val
      });
    },
    /**
     * 进行公式计算
     */
    runCalFormula() {
      if (!this.formula) return;
      const { field, code } = this;
      if (field.isSub) {
        // 子表
        const key = code + "." + field.name;
        const formula = this.formula ? this.formula[key] : null;
        if (formula) {
          FormUtil.runCalFormula(formula, this.models, field, field.row);
        }
      } else {
        field.code = code;
        const key = field.code + "." + field.name;
        const formula = this.formula[key];

        if (formula) {
          const data = FormUtil.runCalFormula(formula, this.models, field);
          this.$emit("update:models", { ...data });
        }
      }
    },
    /**
     * 进行联动数据
     */
    runLinkage() {
      if (!this.linkages) return;
      const { field, code } = this;
      if (field.isSub) {
        // 子表
        const key = code + "." + field.name;
        const linkages = this.linkages ? this.params.linkages[key] : null;
        if (linkages) {
          FormUtil.runLinkage(linkages, this.models, field, field.row);
        }
      } else {
        field.code = code;
        const key = field.code + "." + field.name;
        const linkages = this.linkages ? this.params.linkages[key] : null;

        if (linkages) {
          FormUtil.runLinkage(linkages, this.models, field);
        }
      }
    }
  }
};
</script>

