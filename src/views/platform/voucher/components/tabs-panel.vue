<template>
  <div class="tabsBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tablist" :key="index" :label="item.label" :name="item.name" />
    </el-tabs>
    <div class="content">
      <div class="rule" v-show="activeName == 'EffectiveInspection' || activeName == 'Prerequisite'" @click="ruleBlur(form.formtype)">
        <code-codemirror :fromVariable="form.variable" :fromFunc="form.func" :thisValue="form.value" @getSetCode="getSetCode" @getSetEffectiveCode="getSetEffectiveCode" :codeType="codeType" :isEditable="isEditable" :isStepListNull="isStepListNull" :isGetNull="isGetNull" :updateListNull="updateListNull" />
      </div>
      <div class="EnhanceScript" v-show="activeName == 'EnhanceScript'">
        <el-input :disabled="!isEditable" @change="getenhancedScripts" type="textarea" autosize placeholder="请输入增强脚本" v-model="enhancedScripts">
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import codeCodemirror from './code-codemirror';
export default {
  name: 'tabs-panel',
  components: {
    codeCodemirror
  },
  props: {
    form: {
      type: Object,
      default: {}
    },
    codeType: {
      type: String,
      default: ''
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    isStepListNull: {
      type: Boolean,
      default: false
    },
    isGetNull: {
      type: Boolean,
      default: false
    },
    updateListNull: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: JSON.parse(JSON.stringify(this.form.tabs[0].name)),
      tablist: this.form.tabs
    };
  },
  methods: {
    // 传递设置的最新规则
    getSetCode(info) {
      this.$emit('getSetCode', info);
    },
    // 传递有效性检查规则
    getSetEffectiveCode(info) {
      this.$emit('getSetEffectiveCode', info);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 获取增强脚本值
    getenhancedScripts(val) {
      console.log('获取增强脚本值', val);
    },
    ruleBlur(name) {
      this.$emit('thisBlur', name);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabsBox {
  height: 100%;
  .content {
    height: calc(100% - 30px);
    // background: red;
    .rule {
      height: 100%;
    }
    .EnhanceScript {
      height: 100%;
      /deep/ .el-textarea {
        height: 100%;
        overflow: auto;
        textarea {
          height: 100% !important;
        }
      }
    }
  }
}
/deep/ .el-tabs__item {
  height: 30px;
  line-height: 30px;
}
/deep/ .el-tabs__nav {
  margin-left: 20px;
}
/deep/ .el-tabs__active-bar {
  height: 4px;
  padding: 0 10px;
  left: -10px;
}
/deep/ .el-tabs__header {
  margin: 0;
}

/deep/ .vue-codemirror {
  height: 100%;
  position: relative;
  top: 1px;
}

/deep/ .CodeMirror {
  height: 100%;
}

/deep/ .CodeMirror-scroll {
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>