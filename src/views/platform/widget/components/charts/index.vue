<template>
  <div class="chart-bg chart1">
    <div class="chart-top">
      <div class="chart-left">
        <chart-left />
      </div>
      <div class="chart-right">
        <chart-right />
      </div>
    </div>

    <div class="center">
      <chart-center />
    </div>
    <div class="bottom">
      <chart-bottom />
    </div>

    <div class="chartFull">
      <img @click="fullHandler" src="@/assets/images/desktop/amplification.png" />
    </div>
    <!-- 全屏 -->
    <chart-full :visible.sync="hidden" alias="chart_notes" />
  </div>
</template>

<script>
import chartLeft from "./components/chart-left";
import chartRight from "./components/chart-right";
import chartCenter from "./components/chart-center";
import chartBottom from "./components/chart-bottom";
import chartFull from "./components/chart-full";
export default {
  props: {},
  data() {
    return {
      hidden: false // 全局组件是否显示
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    hidden: {
      handler(val, oldVal) {},
      immediate: true
    }
  },
  methods: {
    fullHandler() {
      this.hidden = true;
    }
  },
  components: {
    chartLeft,
    chartRight,
    chartBottom,
    chartCenter,
    chartFull
  }
};
</script>

<style scoped lang="scss">
.chart-bg {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("./bg2.jpg");
  background-size: 100% 100%;
  .chart-top {
    height: 40%;
    display: flex;
    justify-content: space-around;
    .chart-left {
      width: 49%;
      height: 100%;
    }
    .chart-right {
      width: 49%;
      height: 100%;
    }
  }

  .center {
    width: 100%;
    height: 30%;
  }
  .bottom {
    width: 100%;
    height: 30%;
  }
  .chartFull {
    position: absolute;
    width: 15px;
    height: 15px;
    z-index: 9999;
    right: 5px;
    top: 5px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

