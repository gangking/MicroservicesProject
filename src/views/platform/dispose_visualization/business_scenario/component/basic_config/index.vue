<template>
  <!-- 基本配置 -->
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" :tableBtnList="tableBtnList" @btnClick="btnClick">
        <!-- 业务情形列表 -->
        <situationList @refreshTabel="refreshTabel" :btnName="btnName" :btnClickFlag="btnClickFlag" v-if="activeName == 'businessCondition'" @getActiveRow="getActiveRow" slot="table" :tabelData="tabelData" />
        <!-- 业务类型列表 -->
        <typeList @refreshTabel="refreshTabel" v-else slot="table" :btnName="btnName" :btnClickFlag="btnClickFlag" :trreTable="trreTable" :tabelData="tabelData" @getActiveRow="getActiveRow" />
      </tableLayout>
    </div>
  </tabBox>
</template>

<script>
import tabBox from '../tab_box';
import situationList from './situation_list';
import typeList from './type_list';
import tableLayout from '../table_layout.vue';
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
    }
  },
  components: {
    tabBox,
    situationList,
    typeList,
    tableLayout
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
    }
  },
  data() {
    return {
      tabList: [
        {
          label: '业务情形',
          name: 'businessCondition'
        },
        {
          label: '业务类型',
          name: 'businessType'
        }
      ],
      activeName: 'businessCondition',
      tbaleTitle: '业务情形',
      tableBtnList: [], // 表格按钮组数据
      tabelData: [], // 表格数据
      trreTable: [], // 业务类型表格树数据
      btnName: '', // 点击的按钮名
      btnClickFlag: false
    };
  },
  created() {
    this.getQueryBusinessSituation();
  },
  methods: {
    ...mapActions(['queryBusinessSituation', 'queryBusinessTypeList', 'queryBusinessTypeTree']),
    handleClick(tab) {
      console.log('tab', tab);
      this.btnName = '';
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      var list = this.breadcrumbList;
      var item = {};
      if (tab.label == '业务情形') {
        this.getQueryBusinessSituation();
        list[3] = '业务情形';
        item = {
          type: 'businessCondition',
          info: {
            label:"业务情形"
          }
        };
      } else {
        this.queryBusinessTypeListFunc();
        list[3] = '业务类型';
        item = {
          type: 'businessType',
          info: {
            label:"业务类型"
          }
        };
      }
      // this.$emit('getTabActive', list,item);
    },
    // 获取业务情形列表
    getQueryBusinessSituation() {
      // 业务情形按钮组
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.queryBusinessSituation({
        bsKey: this.kDispose.sceneId
      }).then(list => {
        console.log('获取业务情形列表,', list);
        this.tabelData = list;
      });
    },
    // 获取业务类型列表
    queryBusinessTypeListFunc() {
      this.tableBtnList = require('./testData/tableBtnList2.json').tableBtnList;
      this.queryBusinessTypeTree({
        bsKey: this.kDispose.sceneId
      }).then(res => {
        this.trreTable = res;
        console.log('业务类型列表', res);
      });
    },
    // 按钮点击
    btnClick(info) {
      console.log('点击的是哪个按钮？', info);
      this.btnName = info.label;
      this.btnClickFlag = this.btnClickFlag ? false : true;
    },
    // 选中数据行
    getActiveRow(item) {
      console.log('选中数据行', item);
    },
    // 表格数据刷新方法
    refreshTabel(info) {
      console.log('表格数据刷新方法', info);
      if (info.type == '业务情形') {
        this.handleClickRefresh({
          label: '业务情形',
          name: 'businessCondition'
        });
      } else {
        this.handleClickRefresh({
          label: '业务类型',
          name: 'businessType'
        });
      }
    },
    handleClickRefresh(tab) {
      this.btnName = '';
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      var list = this.breadcrumbList;
      var item = {};
      if (tab.label == '业务情形') {
        this.getQueryBusinessSituation();
        list[3] = '业务情形';
        item = {
          type: 'businessCondition',
          info: {
            label:"业务情形"
          }
        };
      } else {
        this.queryBusinessTypeListFunc();
        list[3] = '业务类型';
        item = {
          type: 'businessType',
          info: {
            label:"业务类型"
          }
        };
      }
      // this.$emit('getTabActive', list,item);
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