<template>
  <!-- 定义页签 -->
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" @btnClick="btnClick" :tableBtnList="tableBtnList" :tabelData="tabelData">
        <!-- 表单分配列表 -->
        <pageDefinitionList @refreshPage="singleFormItemDefinitionFunc" :thisId="id" :thisCode='code' :clickFlag="clickFlag" :buttonType="buttonType" v-if="activeName == 'pageDefinitionList'" slot="table" :tabelData="tabelData" />
        <!-- 功能按钮列表 -->
        <functionBtnList @refreshBtn="onload" :thisId="id" :thisCode='code' :clickFlag="clickFlag" :buttonType="buttonType" v-else-if="activeName == 'functionBtn'" slot="table" :tabelData="tabelData" :btnTabel="btnTabel" />
      </tableLayout>
    </div>
  </tabBox>
</template>

<script>
import tabBox from '@/views/platform/dispose_visualization/business_scenario/component/tab_box.vue';
import tableLayout from '@/views/platform/dispose_visualization/business_scenario/component/table_layout.vue';
import functionBtnList from './functionBtnList';
import pageDefinitionList from './pageDefinitionList';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  components: {
    tabBox,
    tableLayout,
    functionBtnList,
    pageDefinitionList
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
      id: '',
      code:'',
      activeName: 'functionBtn', // 默认选中栏
      tabList: [
        {
          label: '功能按钮',
          name: 'functionBtn'
        },
        {
          label: '表单分配',
          name: 'pageDefinitionList'
        }
      ], // tab栏数据
      tbaleTitle: '功能按钮', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [], // 表格数据
      btnTabel: [] // 按钮表格数据
    };
  },
  created() {
    // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
    //     this.btnTabel = require('./testData/btnTabel.json').btntabel;
  },
  methods: {
    ...mapActions(['singleFormButtonItemDefinition', 'singleFormItemDefinition']),
    onload() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.singleFormButtonItemDefinition({
        slcfTabKey: this.id
      }).then(res => {
        console.log('单行具体页签功能按钮', res);
        this.btnTabel = res;
      });
    },
    singleFormItemDefinitionFunc() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.singleFormItemDefinition({
        slcfTabKey: this.id
      }).then(res => {
        console.log('单行具体页签表单分配', res);
        this.tabelData = res;
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      if (tab.label == '表单分配') {
        this.singleFormItemDefinitionFunc();
      } else if (tab.label == '功能按钮') {
        this.onload();
      }
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