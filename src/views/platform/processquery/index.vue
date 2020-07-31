<template>
 <el-card style="height: 100%">
    <!-- <template slot="header">
      <p class="header">我的处理流程</p>
    </template> -->

    <div style="height:100%; margin: -16px;margin: 0;">
      <SplitPane :min-percent="0" :default-percent="24" split="vertical" style="height: 100%">
        <template slot="paneL" :splitpanes-size="paneSize">
          <div style="margin: 10px;height:100%">
           <tree
          @getKey="getAppId"
           ></tree>
          </div>
        </template>

        <template slot="paneR">
          <div style="margin: 10px;height:100%">
           <managetable
           :keyId="appId"></managetable>
          </div>
        </template>
      </SplitPane>
    </div>
  </el-card>
</template>

<script>
import SplitPane from "vue-splitpane";
import tree from './components/tree'
import managetable from './components/managetable'
export default {
  data() {
    return {
      // minsize:'1',
      paneSize: "30",
      SelData: {},
      treeData: [],
      appId:''
    };
  },
  mounted() {
    // 加载完成后显示提示
    // this.showInfo();
  },
  watch: {},
  methods: {
    getAppId(val){
      this.appId=val
      
    },
    // 显示提示
    showInfo() {
      this.$notify({
        title: "提示",
        message: "在纵向分割线上拖拽调整分区大小"
      });
    },
    // getSelData(val) {
    //   this.SelData = val;
    // },
    // getTreeData(val) {
    //   this.treeData = val;
    //   console.log("treeData", this.treeData);
    // }
  },
  components: {
    SplitPane,
    tree,
    managetable,
  }
};
</script>

<style lang="scss" scoped>
.header {
  font-weight: 700;
  font-size: 22px;
  margin: 0;
}
.el-card {
  /deep/ .el-card__body {
    height: 95%;
  }
}
</style>