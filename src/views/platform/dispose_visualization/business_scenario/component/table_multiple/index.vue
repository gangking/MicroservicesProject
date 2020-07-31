<template>
  <!-- 单行业务事务 -->
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" @btnClick="btnClick" :tableBtnList="tableBtnList" :tabelData="tabelData">
        <!-- 业务事务列表 -->
        <businessAffairsList @refresh="onload" :clickFlag="clickFlag" :buttonType="buttonType" v-if="activeName == 'businessAffairs'" slot="table" :tabelData="tabelData"/>
      </tableLayout>
    </div>
  </tabBox>
</template>

<script>
import tabBox from '../tab_box';
import tableLayout from '../table_layout.vue';
import businessAffairsList from './businessAffairs';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  inject: ['kDispose'],
  components: {
    tabBox,
    tableLayout,
    businessAffairsList,
  },
  data() {
    return {
      clickFlag: false,
      buttonType: '',
      activeName: 'businessAffairs', // 默认选中栏
      tabList: [
        {
          label: '业务事务定义',
          name: 'businessAffairs'
        },
      ], // tab栏数据
      tbaleTitle: '多行业务事务定义', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [], // 表格数据
      btnTabel: [] // 按钮表格数据
    };
  },
  created() {
    // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
    // this.tabelData = require('./testData/tabelData.json').tabelData;
    this.onload()
  },
  methods: {
    ...mapActions(['multipleFormDefinition']),
    onload() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.multipleFormDefinition({
        bsKey: this.kDispose.sceneId
      }).then(res => {
        this.tabelData = res;
        console.log('多行业务事务表单定义查询', res);
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      if (tab.label == '业务事务定义') {
        this.tabelData = require('./testData/tabelData.json').tabelData;
      } 
    },
    // 按钮点击
    btnClick(info) {
      console.log('点击的是哪个按钮？',info);
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