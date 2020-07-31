<template>
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" @btnClick="btnClick" :tableBtnList="tableBtnList" :tabelData="tabelData">
        <!-- 按钮分配列表 -->
        <btnAssignList @refreshBtn="onload" :thisId="id" :thisCode="code" :clickFlag="btnClickFlag" :buttonType="btnClickType" v-if="activeName == 'btnAssign'" slot="table" :tabelData="tabelData" :btnTabel="btnTabel" />
        <!-- 字段分配列表 -->
        <fieldAssignList @refreshPage="multipleLeftFontDefinitionFunc" :thisId="id" :thisCode="code" :clickFlag="btnClickFlag" :buttonType="btnClickType" v-else-if="activeName == 'fieldAssign'" slot="table" :tabelData="tabelData" />
        <!-- 显示规则定义列表 -->
        <showRuleList @update="handleClick" :btnClickType="btnClickType" :thisId="id" :thisCode="code" :btnClickFlag="btnClickFlag" v-else-if="activeName == 'showRule'" slot="table" :tabelData="tabelData" />
      </tableLayout>
    </div>
  </tabBox>
</template>

<script>
import tabBox from '../../../tab_box';
import tableLayout from '../../../table_layout.vue';
import btnAssignList from './btnAssignList.vue';
import fieldAssignList from './fieldAssignList.vue';
import showRuleList from './showRuleList.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  components: {
    tabBox,
    tableLayout,
    btnAssignList,
    fieldAssignList,
    showRuleList
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
          // console.log('进入具体单行2', val);
          // this.id = val.id;
          // this.code=val.code;
          // this.onload();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      id: '',
      code:'',
      activeName: 'btnAssign', // 默认选中栏
      tabList: [
        {
          label: '按钮分配',
          name: 'btnAssign'
        },
        {
          label: '字段分配',
          name: 'fieldAssign'
        },
        {
          label: '显示规则定义',
          name: 'showRule'
        }
      ], // tab栏数据
      tbaleTitle: '按钮分配', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [], // 表格数据
      btnTabel: [],
      btnClickType: '', // 点击的按钮类型
      btnClickFlag: false
    };
  },
  created() {
    //   this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
    //   this.tabelData = require('./testData/tabelData1.json').tabelData;
    //   this.btnTabel = require('./testData/tabelData1_1.json').btntabel;
  },
  methods: {
    ...mapActions([
      'multipleLeftButtonDefinition',
      'multipleLeftFontDefinition',
      'multipleLeftFontSetDefinition'
    ]),
    onload() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.multipleLeftButtonDefinition({
        btKey: this.id
      }).then(res => {
        console.log('多行业务事务左侧栏按钮分配', res);
        this.btnTabel = res;
      });
    },
    multipleLeftFontDefinitionFunc() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.multipleLeftFontDefinition({
        btKey: this.id
      }).then(res => {
        console.log('多行业务事务左侧栏字段分配', res);
        this.tabelData = res;
      });
    },
    multipleLeftFontSetDefinitionFunc() {
      this.tbaleTitle = '排版设置';
      this.tableBtnList = [
        {
          label: '预览',
          incon: '',
          type: 'primary'
        },
        {
          label: '保存',
          incon: '',
          type: 'primary'
        }
      ];
      this.multipleLeftFontSetDefinition({
        btKey: this.id
      }).then(res => {
        console.log('多行业务事务左侧栏字段设置', res);
        this.tabelData = res;
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      if (tab.label == '按钮分配') {
        // this.tabelData = require('./testData/tabelData1.json').tabelData;
        // this.btnTabel = require('./testData/tabelData1_1.json').btntabel;
        // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
        this.onload();
      } else if (tab.label == '字段分配') {
        // this.tabelData = require('./testData/tabelData2.json').tabelData;
        // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
        this.multipleLeftFontDefinitionFunc();
      } else if (tab.label == '显示规则定义') {
        this.multipleLeftFontSetDefinitionFunc();
        this.tbaleTitle = '排版设置';
        // this.tabelData = require('./testData/tabelData3.json').tabelData;
        this.tableBtnList = [
          {
            label: '预览',
            incon: '',
            type: 'primary'
          },
          {
            label: '保存',
            incon: '',
            type: 'primary'
          }
        ];
      }
    },
    // 按钮点击
    btnClick(info) {
      // console.log('点击的是哪个按钮？', info);
      this.btnClickType = info.label;
      this.btnClickFlag = this.btnClickFlag ? false : true;
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