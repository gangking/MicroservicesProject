<template>
  <el-card class="card-box">
    <template slot="header">
      <p class="header">流程按钮配置文件配置</p>
    </template>

    <div class="SplitPaneBox">
      <SplitPane :min-percent="20" :default-percent="45" split="vertical" style="height: 100%">
        <template slot="paneL" :splitpanes-size="paneSize">
          <div class="leftTabel">
            <definition @getSelInfo="getSelData" @getTreeInfo="getTreeData" @getSelDefInfo="getSelectDefInfo"></definition>
          </div>
        </template>

        <template slot="paneR">
          <div class="rightTabel">
            <configuration :getSelectInfo="SelData" :getTreeInfo="treeData" :getSelDefInfo="SelectDefData" :getselectData="selectData"></configuration>
          </div>
        </template>
      </SplitPane>
    </div>
  </el-card>
</template>

<script>
import SplitPane from 'vue-splitpane';
import definition from './components/definition';
import configuration from './components/configuration';
export default {
  data() {
    return {
      // minsize:'1',
      paneSize: '30',
      SelData: {},
      treeData: [],
      SelectDefData: [],
      selectData: {}
    };
  },
  mounted() {
    // 加载完成后显示提示
    // this.showInfo();
  },
  watch: {
    SelData: {
      handler: function(val) {
        // console.log("newval", val);
        // console.log("SelData", this.SelData);
      }
    }
  },
  methods: {
    // 显示提示
    showInfo() {
      this.$notify({
        title: '提示',
        message: '在纵向分割线上拖拽调整分区大小'
      });
    },
    getSelData(val) {
      this.SelData = val;
    },
    getTreeData(val, val2) {
      this.treeData = val;
      this.selectData = val2;
      console.log('selectData', this.selectData);
    },
    getSelectDefInfo(val) {
      this.SelectDefData = val;
      // console.log("SelectDefData", this.SelectDefData);
    }
    // getInpInfo(val){
    //   this.inpInfo=val
    // }
  },
  components: {
    SplitPane,
    definition,
    configuration
  }
};
</script>

<style lang="scss" scoped>
.card-box {
  height: 100%;
  /deep/ .el-card__header {
    height: 50px;
    line-height: 50px;
    padding: 0 18px;
    .header {
      font-weight: 700;
      font-size: 22px;
      margin: 0;
    }
  }

  /deep/ .el-card__body {
    height: calc(100% - 60px);
    overflow: auto;
    padding: 15px;
    box-sizing: border-box;
    .SplitPaneBox {
      height: 100%;
      border: 1px solid #ccc;
      box-sizing: border-box;
      .leftTabel,.rightTabel {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }
}
</style>