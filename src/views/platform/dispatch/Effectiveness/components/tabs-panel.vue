<template>
  <div class="tabsBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tablist" :key="index" :label="item.label" :name="item.name" />
    </el-tabs>
    <div class="content">
      <div class="rule" v-show="activeName != 'EnhanceScript'" @click="ruleBlur(form.formtype)">
        <code-codemirror :fromVariable="form.variable" :fromFunc="form.func" :thisValue="form.value" @getSetCode="getSetCode" @getSetEffectiveCode="getSetEffectiveCode" :codeType="codeType" :isEditable="isEditable" :isStepListNull="isStepListNull" />
      </div>
      <div class="EnhanceScript" v-show="activeName == 'EnhanceScript'">
        <el-input ref="scriptTxt" @click.native="clickScript" @focus="ruleBlur(form.formtype+'Script')" :disabled="!isEditable" @change="getenhancedScripts" type="textarea" autosize placeholder="请输入增强脚本" v-model="enhancedScripts">
        </el-input>
      </div>
      <div v-show="activeName == 'EnhanceScript'">
        <slot name="objTable"></slot>
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
    }
  },
  data() {
    return {
      activeName: JSON.parse(JSON.stringify(this.form.tabs[0].name)),
      tablist: this.form.tabs,
      enhancedScripts: '',
      scriptIndex: 0
    };
  },
  watch: {
    'form.variableScript': {
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          console.log('点击变量编辑增强脚本时', val.tableName);
          console.log(
            this.$refs.scriptTxt,
            '当前焦点位置',
            this.$refs.scriptTxt.$el.firstElementChild.selectionStart
          );
          if (val.attrType == 'field') {
            // var newstr = '';
            // var str = JSON.parse(JSON.stringify(this.enhancedScripts));
            // var index = 0;
            // for(let item,index of str) {
            //   index++;
            //   if(index<)
            // }
            this.scriptIndex = this.$refs.scriptTxt.$el.firstElementChild.selectionStart;
            var newstr =
              this.enhancedScripts.substring(0, this.scriptIndex) +
              val.tableName +
              '.' +
              val.key +
              this.enhancedScripts.substring(this.scriptIndex, this.enhancedScripts.length);
            console.log('最新值', newstr);
            this.enhancedScripts = newstr;
            this.$emit('getNewScriptVal', newstr, this.form.formtype);
          } else {
            this.$message.error('请选择业务对象属性。');
          }
        }
      }
    },
    'form.script': {
      handler(val) {
        console.log('回显增强脚本', val);
        this.enhancedScripts = val;
      }
    }
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
      console.log('获取增强脚本值', val, this.form.value);
      this.$emit('getNewScriptVal', val, this.form.formtype);
    },
    // 点击增强脚本文本域
    clickScript() {
      // console.log('点击增强脚本文本域', this.$refs.scriptTxt.$el.firstElementChild.selectionStart);
      // 记录焦点位置
      this.scriptIndex = this.$refs.scriptTxt.$el.firstElementChild.selectionStart;
    },
    ruleBlur(name) {
      this.$nextTick(() => {
        this.$emit('thisBlur', name);
      });
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
      height:  calc(100% - 32px);
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