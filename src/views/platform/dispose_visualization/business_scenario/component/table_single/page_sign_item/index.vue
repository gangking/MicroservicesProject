<template>
  <!-- 定义页签 -->
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" @btnClick="btnClick" :tableBtnList="tableBtnList" :tabelData="tabelData">
        <!-- 页签定义列表 -->
        <basicParamList @refreshPage="onload" :thisId="id" :thisCode="code" :clickFlag="clickFlag" :buttonType="buttonType" v-if="activeName == 'basicParamList'" slot="table" :tabelData="tabelData" />
        <!-- 功能按钮列表 -->
        <functionBtnList @refreshBtn="singleFormButtonDefinitionFunc" :thisId="id" :thisCode="code" :clickFlag="clickFlag" :buttonType="buttonType" v-else-if="activeName == 'functionBtn'" slot="table" :tabelData="tabelData" :btnTabel="btnTabel" />
      </tableLayout>
    </div>
  </tabBox>
</template>

<script>
// import tabBox from './tab_box';
import tabBox from '../../tab_box';
import tableLayout from '../../table_layout.vue';
import functionBtnList from './functionBtnList';
import basicParamList from './basicParamList';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  inject: ['kDispose'],
  components: {
    tabBox,
    tableLayout,
    functionBtnList,
    basicParamList
  },
  props: {
    tabActive: {
      type: Object,
      default: () => {
        return {};
      }
    },
    activeInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    tabActive: {
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          this.id = this.activeInfo.id;
          this.code = this.activeInfo.code
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
          // console.log('进入具体单行', val);
          // this.id = val.id;
          // this.code = val.code
          // this.onload();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      clickFlag: false,
      buttonType: '',
      activeName: 'basicParamList', // 默认选中栏
      id: '',
      code:'',
      tabList: [
        {
          label: '页签定义',
          name: 'basicParamList'
        },
        {
          label: '功能按钮',
          name: 'functionBtn'
        }
      ], // tab栏数据
      tbaleTitle: '页签定义', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [], // 表格数据
      btnTabel: [] // 按钮表格数据
    };
  },
  methods: {
    ...mapActions(['singleFormPageDefinition', 'singleFormButtonDefinition']),
    btnSelectionChange(list) {
      this.activeAllBtn = list;
    },
    onload() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.singleFormPageDefinition({
        slcfKey: this.id
      }).then(res => {
        console.log('单行页签定义', res);
        this.tabelData = res;
      });
    },
    singleFormButtonDefinitionFunc() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.singleFormButtonDefinition({
        slcfKey: this.id
      }).then(res => {
        console.log('功能按钮', res);
        this.btnTabel = res;
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      if (tab.label == '页签定义') {
        this.onload();
      } else if (tab.label == '功能按钮') {
        this.singleFormButtonDefinitionFunc();
      }
    },
    // 按钮点击
    btnClick(info) {
      // console.log('点击的是哪个按钮1？', info);
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