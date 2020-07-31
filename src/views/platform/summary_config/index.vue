<template>
  <div class="summary-container">
    <el-row type="flex" class="row-bg">
      <el-col :span="24">
        <div class="grid-content bg-margin">
          <config-left @objTree="objTree" :treeData="treeData" />
        </div>
      </el-col>
      <!-- <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <config-right :treeData="treeData" />
        </div>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import configLeft from "./components/config-left";
import configRight from "./components/config-right";
export default {
  props: {},
  data() {
    return {
      treeData: []
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    objTree(data) {
      this.treeData = data;
      this.treeData.shift();
    }
  },
  components: {
    configLeft,
    configRight
  }
};
</script>

<style scoped lang="scss">
.summary-container {
  width: 100%;
  height: 100%;
  background: #fff;
  .row-bg {
    height: 100%;
    padding: 10px;
    .grid-content {
      height: 100%;
    }
    .bg-margin {
      margin-right: 15px;
    }
  }
}
</style>
