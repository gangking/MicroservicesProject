<template>
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" @btnClick="btnClick" :tableBtnList="tableBtnList" :tabelData="tabelData">
        <!-- 业务类型分配列表 -->
        <businessTypeAssign @refreshPage="onload" :thisId="id" :thisCode="code" :clickFlag="clickFlag" :buttonType="buttonType" v-if="activeName == 'businessTypeAssign'" slot="table" :tabelData="tabelData" />
      </tableLayout>
    </div>
  </tabBox>
</template>

<script>
import tabBox from '../../../tab_box';
import tableLayout from '../../../table_layout.vue';
import businessTypeAssign from './businessTypeAssign.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  components: {
    tabBox,
    tableLayout,
    businessTypeAssign
  },
  props: {
    activeInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    activeInfo: {
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          console.log('进入具体单行2', val);
          this.id = val.id;
          this.code = val.code
          this.onload();
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
      activeName: 'businessTypeAssign', // 默认选中栏
      tabList: [
        {
          label: '业务类型分配',
          name: 'businessTypeAssign'
        }
      ], // tab栏数据
      tbaleTitle: '业务类型分配', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [] // 表格数据
    };
  },
  created() {
    // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
    // this.tabelData = require('./testData/tabelData.json').tabelData;
  },
  methods: {
    ...mapActions(['multipleBusTypeSetDefinition']),
    onload() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.multipleBusTypeSetDefinition({
        btKey: this.id
      }).then(res => {
        console.log('多行业务事务业务类型分配', res);
        this.tabelData = res.dataResult;
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      if (tab.label == '业务类型分配') {
        // this.tabelData = require('./testData/tabelData.json').tabelData;
        this.onload()
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