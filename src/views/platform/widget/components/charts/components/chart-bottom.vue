<template>
  <div class="chart">
    <div class="chart-content" ref="chart1"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import chalk from "../chalk.json";
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
      // let obj = JSON.parse(chalk);
      echarts.registerTheme("chalk", chalk);
      this.myChart = echarts.init(this.$refs.chart1, "chalk");

      let option = {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        title: {
          text: "区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["点图1", "demo2", "测试", "测试数据", "测试数据"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "点图1",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "demo2",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "测试",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "测试数据",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "测试数据",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
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
  }
}
</style>
