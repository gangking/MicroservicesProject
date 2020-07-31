<template>
  <form-container ref="formpoc" v-if="isHshowForm" :is-close-header="isCloseFormHeader">
    <!-- 表单头部信息 -->
    <template slot="form-header">
      <container-header />
      <el-dialog :title="dynamicOpenInDailogTitle" v-if="dynamicOpenInDailogType" :visible.sync="dynamicOpenInDailog" @open="onDynamicOpen" append-to-body :before-close="onDynamicbeforeClose">
        <component :ref="dailogdynamicRefName" :item-val="dailogdynamicRefNameItemVal" v-if="dynamicOpenInDailogType" :is="dynamicOpenInDailogType"></component>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dynamicOpenInDailog = false">取 消</el-button>
          <el-button type="primary" @click="dynamicOpenInDailog = false">确 定</el-button>
        </span>
      </el-dialog>
      <component v-if="nativeType" :item-val="nativeParams" ref="dynamic-native" :is="nativeType"></component>
    </template>
    <!-- 表步骤条 -->
    <template slot="step">
      <step-horizontal ref="topstep" :step-val="steps" @step-index="onStepIndexEvent" />
    </template>
    <!-- 表单区域数据 -->
    <template v-slot:default>
      <keep-alive>
        <component v-if="stepValue" :key="stepValue.stepNo" :is="stepContainer" ref="comp" :step-val="stepValue" />
      </keep-alive>
    </template>
    <!-- 流程 -->
    <template v-slot:timeline>
      <time-line />

    </template>
  </form-container>
</template>

<script>
/**
 * 导入动态导入
 */
import '../mixins/components-dynamic-reg';
import SplitPane from 'vue-splitpane';
import container from '../components/container';
import formContainer from '../components/form-container';
import stepHorizontal from '../components/step-horizontal';
import containerHeader from '../components/container-header';
import timeLine from '../components/time-line';
import payableForm from '../components/payable-from';
import MultilineForm from '../components/multiline-form';
import emptyContainer from '../components/emtpy';
import { createNamespacedHelpers, mapGetters as rootGetters } from 'vuex';
import util from '@/utils/util';

import FormButtomFunctions from '../mixins/form-buttom-functions';

const { mapActions, mapState, mapGetters: mapGettersBase, mapMutations } = createNamespacedHelpers(
  'ibps/compositeBase'
);
const { mapActions: mapActionsMultilines } = createNamespacedHelpers('ibps/compositeMultiline');
const { mapGetters, mapActions: mapActionsDolog } = createNamespacedHelpers('ibps/compositeDolog');
const { mapState: comSingleState } = createNamespacedHelpers('ibps/compositeSingle');
const { mapActions: mapActionsPayable, mapState: mapStatePayable } = createNamespacedHelpers(
  'ibps/compositeSingle'
);
console.log('FormButtomFunctions', FormButtomFunctions);
export default {
  components: {
    formContainer,
    payableForm,
    containerHeader,
    stepHorizontal,
    timeLine,
    SplitPane,
    container,
    MultilineForm,
    emptyContainer
  },
  provide() {
    return {
      payable: this
    };
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

  mixins: [FormButtomFunctions],
  props: {
    params: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      stepValue: null,
      loading: false,
      stepDirectionIsVertical: true,
      stepDirectionIsIndex: 0
    };
  },

  computed: {
    ...mapState(['steps', 'instId', 'taskId', 'bsiCode', 'tableHeaderId', 'appId']),
    ...comSingleState(['meetingTabInfo']),
    ...mapGetters(['isHasFormExceptions']),
    ...mapGettersBase([
      'businessSceneName',
      'businessSceneId',
      'businessEventId',
      'currentStepVal',
      'docNumber'
    ]),
    ...mapStatePayable(['current_tag_form_data']),
    isCloseFormHeader() {
      return this.steps ? this.steps.length <= 1 : false;
    },
    ...rootGetters(['userId', 'userInfo']),
    stepContainer() {
      return this.stepValue ? this.stepValue.stepContainer : 'emptyContainer';
    }
  },

  watch: {
    params: {
      handler(val) {
        if (!util.isEmpty(val)) {
          this.loading = true;
          console.log('进入', val);
          this.initCompostite(val).then(() => (this.loading = false));
        }
      },
      immediate: true
    },
    steps(val) {
      val.length > 0 && this.onStepIndexEvent(0, val[0], true);
    }
  },
  methods: {
    ...mapMutations(['setStepVal']),
    ...mapActions(['initCompostite', 'getProcessInfo']),

    onStepIndexEvent(index, item, isInit) {
      this.stepDirectionIsIndex = index;
      this.setStepVal(item);
      // console.log('onStepIndexEvent...', index, item, isInit);
      if (this.stepValue != item) {
        if (this.$refs['comp'] && this.$refs['comp'].onBeforeStepLeave) {
          if (isInit) {
            // console.log('reload...');
            this.stepValue = item;
            this.$refs['comp'].reload();
          } else {
            const beforeValue = this.$refs['comp'].onBeforeStepLeave();
            if (beforeValue && beforeValue.then) {
              beforeValue.then(() => {
                this.stepValue = item;
              });
            } else if (beforeValue !== false) {
              this.stepValue = item;
            }
          }
        } else {
          this.stepValue = item;
        }
      }
      // console.log('indexEvent', index, item)
    }
  }
};
</script>
