<template>
  <!-- 规则策略 -->
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" v-if="activeName == 'disStrategy' || activeName == 'printTemplate'" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" :tableBtnList="tableBtnList" @btnClick="btnClick" :tabelData="tabelData">
        <!-- 分步策略列表 -->
        <disStrategy @refresh="onload" :clickFlag="clickFlag" :buttonType="buttonType" v-if="activeName == 'disStrategy'" slot="table" :tabelData="tabelData" />
        <printTemplate @refresh="printTemplateFunc" :clickFlag="clickFlag" :buttonType="buttonType" v-else-if="activeName == 'printTemplate'" slot="table" :tabelData="tabelData" />
      </tableLayout>
    </div>
    <validityCheck :BusSceId="id" v-else-if="activeName == 'validityCheck'" slot="tableSlot" />
    <subRrules :BusSceId="id" v-else-if="activeName == 'subRrules'" slot="tableSlot" />
    <credentialRules :BusSceId="id" v-else-if="activeName == 'credentialRules'" slot="tableSlot" />
  </tabBox>
</template>

<script>
import tabBox from '../tab_box';
import tableLayout from '../table_layout.vue';
import disStrategy from './disStrategy';
import printTemplate from './printTemplate';
import validityCheck from './validityCheck';
import subRrules from './subRrules';
import credentialRules from './credentialRules';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  inject: ['kDispose'],
  props: {
    tabActive: {
      type: Object,
      default: () => {
        return {};
      }
    },
    breadcrumbList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    activeInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  provide() {
    return {
      ruleStrategyProvideQ: this
    };
  },
  components: {
    tabBox,
    tableLayout,
    disStrategy,
    printTemplate,
    validityCheck,
    subRrules,
    credentialRules
  },
  watch: {
    tabActive: {
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          this.handleClick({
            label: val.label,
            name: val.name
          });
        }
      },
      immediate: true
    },
    activeInfo: {
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          // this.kDispose.sceneId = this.kDispose.sceneId;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      clickFlag: false,
      buttonType: '',
      id: '',
      tabList: [
        {
          label: '分步策略',
          name: 'disStrategy'
        },
        {
          label: '打印模板',
          name: 'printTemplate'
        },
        {
          label: '有效性检查',
          name: 'validityCheck'
        },
        {
          label: '替代规则',
          name: 'subRrules'
        },
        {
          label: '凭证规则',
          name: 'credentialRules'
        }
      ], // tab栏数据
      activeName: 'disStrategy', // 默认选中栏
      tbaleTitle: '分步策略', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [] // 表格数据
    };
  },
  created() {
    this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
    // this.tabelData = require('./testData/tabelData.json').tabelData;
  },
  methods: {
    ...mapActions(['distributionStrategy', 'printTemplate']),
    onload() {
      // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.distributionStrategy({
        bsKey: this.kDispose.sceneId
      }).then(res => {
        console.log('分步策略', res);
        this.tabelData = res;
      });
    },
    printTemplateFunc() {
      // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.printTemplate({
        bsKey: this.kDispose.sceneId
      }).then(res => {
        console.log('打印模板', res);
        this.tabelData = res;
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.activeName = tab.name;
      var list = this.breadcrumbList;
      var item = {
        type: 'disStrategy',
        info: {
          label: '规则策略'
        }
      };
      switch (tab.label) {
        case '分步策略':
          this.tbaleTitle = tab.label;
          list[3] = '分步策略';
          this.onload();
          break;
        case '打印模板':
          this.tbaleTitle = tab.label;
          list[3] = '打印模板';
          this.$nextTick(() => {
            this.printTemplateFunc();
          });
          break;
        case '有效性检查':
          this.tableBtnList = [];
          this.tbaleTitle = tab.label;
          list[3] = '有效性检查';
          break;
        case '替代规则':
          this.tableBtnList = [];
          this.tbaleTitle = tab.label;
          list[3] = '替代规则';
          break;
        case '凭证规则':
          this.tableBtnList = [];
          this.tbaleTitle = tab.label;
          list[3] = '凭证规则';
          break;
      }

      this.$emit('getTabActive', list,item);
    },
    // 按钮点击
    btnClick(info) {
      // console.log('点击的是哪个按钮？', info);
      this.clickFlag = this.clickFlag ? false : true;
      this.buttonType = info.label;
    }
  }
};
</script>

<style lang="scss" scoped>
.tableSlot {
  height: 100%;
  overflow: auto;
}
</style>