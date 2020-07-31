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
        // title: {
        //   text: "监控图表",
        //   x: "center"
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ["line", "bar"] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        legend: {
          data: ["蒸发量", "降水量", "平均温度"]
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "水量",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value} ml"
            }
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value} °C"
            }
          }
        ],
        series: [
          {
            name: "蒸发量",
            type: "bar",
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ]
          },
          {
            name: "降水量",
            type: "bar",
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: "平均温度",
            type: "line",
            yAxisIndex: 1,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
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
