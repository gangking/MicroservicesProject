<template>
  <div class="chart">
    <div class="chart-content" ref="chart1"></div>
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/dark");
export default {
  props: {},
  data() {
    return {
      myChart: ""
    };
  },
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.initData();
    }, 100);

    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
  },
  watch: {},
  methods: {
    initData() {
      this.myChart = echarts.init(this.$refs.chart1, "dark");
      let option = {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        title: {
          text: "监控BHJ",
          x: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        // legend: {
        //   data: ["2011年", "2012年"]
        // },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: ["ABG", "bhj", "mkh", "KJL", "HHJ", "hjk"]
        },
        series: [
          {
            name: "2011年",
            type: "bar",
            data: [18203, 23489, 29034, 104970, 131744, 45213]
          },
          {
            name: "2012年",
            type: "bar",
            data: [19325, 23438, 31000, 121594, 134141, 145222]
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  .chart-content {
    width: 100%;
    height: 100%;
    // height: calc(100% - 30px);
  }
}
</style>
