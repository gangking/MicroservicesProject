<template>
  <container class="header-btns-lines">
    <template v-slot:header>
      <div class="form-tab-btns">
        <container-btns :right-btns="processBtns" :data="funcBtns" @click="onActionEvent" />
      </div>

    </template>
    <template v-slot:content>
      <div class="form-tab-content">
        <div class="form-tab-content-left" v-show="payable.stepDirectionIsVertical">
          <vertical-label></vertical-label>
        </div>
        <div class="form-tab-content-rigth">
          <el-tabs class="scss-form-tab" :class="{'hidden-tabs-header':ishiddenTabHeader}" :value="currentTag" ref="tabContainer" :before-leave="beforeTabsLeave" @tab-remove="removeTag" @input="TagshandleClick">
            <el-tab-pane v-for="item in tags" :closable="item.closable" :name="item.key" :key="item.key" style="heigth:100%" :label="' '+item.label+' '" :lazy="true">
              <full-screen-container :is-hidden-full-screen="item.CloseFullScreen">
                <component slot="screen-content" :is="item.componentType" :ref="item.key" :item-val="manageTagsParams[item.key]" />
              </full-screen-container>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </template>
  </container>
</template>

<script>
import container from './container';
import containerBtns from './container-btns.vue';
import payableDynamicForm from './payable-dynamic-form';
import multilineDynamicForm from './multiline-container';
import util from '@/utils/util';
import FormTagsMethods from '../mixins/form-tags-methods';
import VerticalLabel from './vertical_label/vertical_label';
import FullScreenContainer from './full-screen-container';
export default {
  components: {
    VerticalLabel,
    container,
    containerBtns,
    payableDynamicForm,
    multilineDynamicForm,
    FullScreenContainer
  },
  mixins: [FormTagsMethods],
  props: {
    stepVal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  provide() {
    return {
      stepContainer: this
    };
  },
  inject: {
    payable: {
      from: 'payable',
      default() {
        return this;
      }
    }
  },

  computed: {
    ishiddenTabHeader() {
      return this.tags.length <= 1;
    }
  },

  data() {
    return {
      processBtns: [],
      funcBtns: [],
      cacheStepVal: {}
    };
  },

  activated() {
    console.log('loading...activated...');
    this._formLoad();
  },

  methods: {
    reload() {
      this._formLoad();
    },

    _formLoad() {
      // console.log('loading...activated', this.stepVal)
      if (!util.isEmpty(this.stepVal) && this.cacheStepVal != this.stepVal) {
        console.log('loading...activated, methods', this.getBtnsAndTags, this.stepVal);
        this.cacheStepVal = this.stepVal;
        this.getBtnsAndTags &&
          this.getBtnsAndTags(this.stepVal).then(data => {
            this.initCurrentData(data);
          });
      }
      this.onActivated();
    },

    /**
     * 离开当前步骤之前执行一点什么
     */
    onBeforeStepLeave() {
      console.log('当前不显示我了 。。。。。');
      const tmpContent = this.currentVm();
      return tmpContent ? (tmpContent.BeforeStepLeave ? tmpContent.BeforeStepLeave() : true) : true;
    },

    /**
     * 当前控件激活的时候
     */
    onActivated() {
      const tmpContent = this.currentVm();
      console.log('onActivated', tmpContent);
      return tmpContent ? (tmpContent.onActivated ? tmpContent.onActivated() : true) : true;
    },
    onActionEvent(action, val) {
      this.payable.onActionEvent(action, val, this);
    }
  }
};
</script>
<style lang="scss">
.scss-form-tab.el-tabs.el-tabs--top {
  height: 100%;
  display: flex;
  flex-direction: column;
  > .el-tabs__header {
    margin: 0 0 3px;
    .el-tabs__nav-scroll {
      margin-left: 10px;
      .el-tabs__nav {
        margin-left: 20px;
      }
    }
  }
  > .el-tabs__content {
    flex-grow: 1;
    height: 10px;
    div[role='tabpanel'] {
      height: 100%;
    }
  }
}

.scss-form-tab.el-tabs {
  .el-tabs__active-bar {
    height: 3px;
    padding: 0 10px;
    left: -10px;
    /*     max-width: 180px; */
    min-width: 56px;
  }
  .el-tabs__item {
    min-width: 56px;
    /* max-width: 180px; */
  }
}

.form-tab-btns {
  margin-right: 25px;
  padding-top: 8px;
}
.form-tab-content {
  height: 100%;
  display: flex;
  .form-tab-content-left {
    border-right: 1px solid #d4d4de !important;
    height: 100%;
    flex-basis: 100px;
    padding-top: 10px;
    box-sizing: border-box;
    /deep/ .el-tabs--left .el-tabs__nav-wrap.is-left::after {
      width: 0 !important;
    }
  }
  .form-tab-content-rigth {
    flex-grow: 1;
    width: 100%;
  }
}
.hidden-tabs-header.el-tabs.el-tabs--top {
  > .el-tabs__header {
    display: none;
  }
  > .el-tabs__content {
    height: 100% !important ;
  }
}
.display-form-container.header-btns-lines {
  > .form-header {
    flex-basis: 38px;
  }
}
</style>
