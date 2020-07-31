<template>
  <div class="centerBox">
    <tabsPanel :form="formDataOne" codeType="先决条件" @getSetCode="getSetCode" :isEditable="isEditable" :isStepListNull="isStepListNull" />
  </div>
</template>

<script>
import tabsPanel from './tabs-panel';
export default {
  components: {
    tabsPanel
  },
  props: {
    isEditable: {
      type: Boolean,
      default: false
    },
    formDataOne: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isStepListNull: false, // 范围表是否为空标识
      ruleItem: {} // 规则
    };
  },
  methods: {
    // 获取当前选中焦点
    thisBlurActive(type) {
      // console.log(type)
      switch (type) {
        case 'Prerequisite':
          this.blurFormFlag = 'formDataOne';
          break;
      }
    },
    // 获取设置的先决条件最新规则信息
    getSetCode(info) {
      this.ruleItem['condtion'] = this.splicingRule(info);
      this.ruleItem['condtionAttr'] = JSON.stringify(info);
      this.$emit('getRuleTime',this.ruleItem)
    },
    // 拼接规则
    splicingRule(info) {
      var ruleTxt = '';
      for (var i = 0; i < info.length; i++) {
        var item = info[i];
        if (item.tableName != undefined) {
          ruleTxt += item.tableName + '.get("' + item.key+'")';
        } else if (item.type == 'btn') {
          ruleTxt += item.name;
        } else {
          ruleTxt += item;
        }
      }
      return ruleTxt;
    }
  }
};
</script>

<style lang="scss" scoped>
.centerBox {
  width: 100%;
  height: 100%;
}
</style>