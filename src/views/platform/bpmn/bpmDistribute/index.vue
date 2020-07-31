<template>
  <el-card style="height: 100%" class="elcard" id="tableNode">
    <template slot="header">
      <p class="header">业务场景功能配置文件关联</p>
    </template>
    <SplitPane :min-percent="0" :default-percent="30" split="vertical" style="height: 100%">
      <template slot="paneL" :splitpanes-size="paneSize">
        <div style="margin: 10px;">
          <node-table :height="height" @clearTable="clearTable" @tableSelect="tableSelect" />
        </div>
      </template>

      <template slot="paneR" class="white">
        <div style="margin: 10px;">
          <node-details
            :height="height"
            :defId="defId"
            :nodeId="nodeId"
            ref="details"
            :clear="clear"
          />
        </div>
      </template>
    </SplitPane>
  </el-card>
</template>

<script>
import SplitPane from "vue-splitpane";
import nodeTable from "./components/node-table";
import nodeDetails from "./components/node-details";
export default {
  data() {
    return {
      paneSize: "30",
      loading: false,
      height: 0,
      defId: "",
      nodeId: "",
      clear: 0
    };
  },
  mounted() {
    // 加载完成后显示提示
    // this.showInfo();
    this.getHeight();
    window.addEventListener(
      "resize",
      () => {
        this.getHeight();
      },
      false
    );
  },
  watch: {},
  methods: {
    clearTable(bool) {
      //this.clear++;

      this.$refs.details.tableData = [];
    },
    // 显示提示
    showInfo() {
      this.$notify({
        title: "提示",
        message: "在纵向分割线上拖拽调整分区大小"
      });
    },
    getHeight() {
      if (document.querySelector("#tableNode")) {
        this.height = document.querySelector("#tableNode").clientHeight;
      }

      // console.log(this.height);
    },
    tableSelect(defId, nodeId) {
      this.defId = defId;
      this.nodeId = nodeId;
      setTimeout(() => {
        this.$refs.details.getDetail();
      }, 10);
    }
  },
  components: {
    SplitPane,
    nodeTable,
    nodeDetails
  }
};
</script>

<style lang="scss" scoped>
.elcard {
  /deep/ .el-card__header {
    padding: 8px 20px;
  }
  .header {
    font-weight: 700;
    font-size: 20px;
    margin: 0;
  }
  /deep/.el-card__body {
    background-color: #fff;
    padding: 0;
    height: calc(100% - 40px);
  }
}
.white {
  background-color: #fff;
}
</style>