<template>
  <container class="form-container el-card  is-always-shadow">
    <template v-slot:header>
      <slot name="form-header">表单头部</slot>
    </template>
    <template v-slot:content>
      <split-pane :min-percent="15" :default-percent="foldStyle=='icon-uniE14A'?85:100" split="vertical">
        <template slot="paneL">
          <container class="payable-form" :class="{'colse-steps':isCloseHeader || payable.stepDirectionIsVertical }">
            <template v-slot:header>
              <slot name="step">步骤条区域</slot>
            </template>
            <template v-slot:content>
              <slot>单行表单或者多行表单区域</slot>
            </template>
          </container>
        </template>
        <template slot="paneR">
          <i id="foldBtn" :class="foldStyle" @click="foldToggle" />
          <slot v-if="foldStyle=='icon-uniE14A'?true:false" name="timeline">流程进度区域</slot>
        </template>
      </split-pane>
    </template>
  </container>
</template>

<script>
import SplitPane from 'vue-splitpane';
import container from './container';

export default {
  components: {
    SplitPane,
    container
  },
  props: {
    isCloseHeader: {
      type: Boolean,
      default: false
    }
  },
  inject: ['payable'],
  data() {
    return {
      active: 0,
      foldStyle: 'icon-uniE14A' // 默认为收缩按钮，icon-uniE14E为展开按钮
    };
  },
  methods: {
    foldToggle() {
      this.foldStyle = this.foldStyle == 'icon-uniE14A' ? 'icon-uniE14E' : 'icon-uniE14A';
    },
    hiddenFold() {
      this.foldStyle = 'icon-uniE14E';
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" >
#foldBtn {
  color: #14a6fe;
  position: absolute;
  right: 10px;
  top: 13px;
  cursor: pointer;
  font-size: 20px;
}

.display-form-container.form-container {
  overflow: hidden;
}

.display-form-container.payable-form {
  > .form-header {
    flex-basis: 49px;
    padding-top: 5px;
    box-sizing: border-box;
  }
}

.display-form-container.payable-form.colse-steps {
  > .form-header {
    display: none;
  }
  > .form-content {
    height: 100%;
  }
}
</style>
