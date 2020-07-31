<template>
  <el-card style="height: 100%">
    
    <template slot="header">
      <p class="header">19年6月差旅费用B</p>
      <div class="zy">
        <a href="#">摘要</a>
        <a href="#">详细信息</a>
        <a href="#">发票</a>
      </div>
    </template>

    <div style="height: 400px; margin: -16px;margin: 0;">
      <SplitPane :min-percent="20" :default-percent="38" split="vertical" style="height: 126%">

        <template slot="paneL" :splitpanes-size="paneSize">
          <div style="margin: 10px;">
            <leftside></leftside>
          </div>
        </template>

        <template slot="paneR" >
          <div style="margin: 10px;">
            <rightside></rightside>
          </div>
        </template>

      </SplitPane>
    </div>
    
  </el-card>
</template>

<script>
import SplitPane from "vue-splitpane";
import leftside from "./leftside.vue";
import rightside from "./rightside.vue";
export default {
  data() {
    return {
      // minsize:'1',
      paneSize:'30'
    }
  },
  mounted() {
    // 加载完成后显示提示
    // this.showInfo();
    
  },
  methods: {
    // 显示提示
    showInfo() {
      this.$notify({
        title: "提示",
        message: "在纵向分割线上拖拽调整分区大小"
      });
    }
  },
  components: {
    leftside,
    rightside,
    SplitPane
  }
};
</script>

<style lang="scss" scoped>
.header {
  font-weight: 400;
  font-size: 22px;
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
</style>