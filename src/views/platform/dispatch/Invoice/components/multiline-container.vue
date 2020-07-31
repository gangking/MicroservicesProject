<template>
  <div class="two-layout-box-container">
    <split-pane :min-percent="0" :default-percent="40" split="vertical">
      <template slot="paneL">
        <outline-table ref="outlineTable" @action-event="onActionEvent" />
      </template>
      <template slot="paneR">
        <el-tabs class="scss-form-tab" ref="multiTab" :value="currentTag" :before-leave="beforeTabsLeave" @tab-remove="removeTag" @input="TagshandleClick">
          <el-tab-pane v-for="item in tags" :closable="item.closable" :name="item.key" :key="item.key" style="heigth:100%" :label="' '+item.label+' '" :lazy="true">
            <full-screen-container>
              <component slot="screen-content" :is="item.componentType" :item-val="manageTagsParams[item.key]" />
            </full-screen-container>
          </el-tab-pane>
        </el-tabs>
      </template>
    </split-pane>
  </div>
</template>

<script>
import SplitPane from 'vue-splitpane';
import outlineTable from './outline-table';
import multilineDynamicForm from './multiline-dynamic-form';
import { createNamespacedHelpers } from 'vuex';
import multiline from '@/views/platform/dispatch/Invoice/mixins/multiline.js';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeMultiline');
import FormTagsMethods from '../mixins/form-tags-methods';
import ComponentProps from '../mixins/components-props';
import util from '@/utils/util';
import FullScreenContainer from './full-screen-container';
export default {
  name: 'multiline-container',
  components: {
    SplitPane,
    outlineTable,
    multilineDynamicForm,
    FullScreenContainer
  },
  provide() {
    return {
      multiline: this
    };
  },
  mixins: [FormTagsMethods, ComponentProps],

  data() {
    return {};
  },
  created() {
    this.tabContainerName = 'multiTab';
  },
  mounted() {
    this.onActionEvent('businessTypeDataCreate', { buttonName: '业务类型' });
  },
  methods: {
    reloadOutlineTableData(index, isEmitSelectRowEvent, isRefresh = false) {
      const outlineTable = this.$refs['outlineTable'];
      isRefresh
        ? outlineTable.refreshLoadTbaleDataAndActiveIndex(isEmitSelectRowEvent)
        : outlineTable.LoadTableDefineAndData(index, isEmitSelectRowEvent);
    },

    // 按钮点击接收
    onActionEvent(action, btnVal, ...args) {
      this.payable.onActionEvent.apply(this.payable, [action, btnVal, this, ...args]);
    },
    // 获取业务类型数据
    setBusinessType(info) {
      console.log('获取业务类型数据', info);
      this.businessData = info;
    }
  }
};
</script>

<style lang="scss" scoped>
.two-layout-box-container {
  height: 100%;
}
</style>
