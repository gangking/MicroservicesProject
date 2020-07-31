<template>
  
    <el-card style="height: 100%" class="elcard">
      <template slot="header">
        <p class="header">业务场景显示状态配置文件</p>
      </template>

      <div style="height: 100%; margin: -16px;margin: 0;">
        <SplitPane :min-percent="0" :default-percent="30" split="vertical" style="height: 100%">
          <template slot="paneL" :splitpanes-size="paneSize">
            <div style="margin: 10px;height: 100%">
              <profiles
                @getSelInfo="getSelData"
                @getTreeInfo="getTreeData"
                @getSelDefInfo="getSelectDefInfo"
                @getLoading="getLoadingData"
                @getInputInfo="getInpInfo"
              ></profiles>
            </div>
          </template>

          <template slot="paneR" class="white">
            <div style="margin: 10px;height: 100%">
              <tree
                :getSelectInfo="SelData"
                :getTreeInfo="treeData"
                :getSelDefInfo="SelectDefData"
                :getInputInfo="inpInfo"
                :getLoadingInfo="loading"
              ></tree>
            </div>
          </template>
        </SplitPane>
      </div>
    </el-card>

</template>

<script>
import SplitPane from "vue-splitpane";
import profiles from "./components/profiles";
import tree from "./components/tree";
export default {
  data() {
    return {
      // minsize:'1',
      paneSize: "25",
      SelData: {},
      treeData: [],
      SelectDefData: [],
      inpInfo: "",
      loading: false
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
        title: "提示",
        message: "在纵向分割线上拖拽调整分区大小"
      });
    },
    getSelData(val) {
      this.SelData = val;
      console.log("SelData", this.SelData);
    },
    getTreeData(val) {
      this.treeData = val;
      // console.log("treeData", this.treeData);
    },
    getSelectDefInfo(val) {
      this.SelectDefData = val;
      // console.log("SelectDefData", this.SelectDefData);
    },
    getInpInfo(val) {
      this.inpInfo = val;
    },
    getLoadingData(val) {
      this.loading = val;
    }
  },
  components: {
    SplitPane,
    profiles,
    tree
  }
};
</script>

<style lang="scss" scoped>
.elcard {
  /deep/ .el-card__header {
    padding: 8px 20px;
  }
  /deep/ .el-card__body {
    height: 90%;
  }
  .header {
    font-weight: 700;
    font-size: 20px;
    margin: 0;
  }
  .zy {
    margin-top: 1%;

    a {
      font-size: 12px;
      margin-right: 3%;
      margin-left: 1%;
      color: #409eff;
    }
  }
  /deep/.el-card__body{
    background-color: #fff;
  }
}
.white{
  background-color: #fff;
}
</style>