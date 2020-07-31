<template>
  <div class="chart">
    <div class="chart-content" ref="chart1"></div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
import chalk from "../halloween.json";
require("echarts/theme/dark");
export default {
  props: {
    subaufnrData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      myChart: ""
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.myChart && this.myChart.resize();
      }, 150);
    },
    subaufnrXData() {
      return this.subaufnrData.map(item => {
        return item.mold;
      });
    },
    subaufnrYMoney() {
      return this.subaufnrData.map((item, index) => {
        return (item.money / 1000).toFixed(2);
      });
    },
    subaufnrYCount() {
      return this.subaufnrData.map((item, index) => {
        return item.count;
      });
    }
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.chartResize);
  },
  watch: {
    subaufnrData: {
      handler(val) {
        this.initData();
      }
    }
  },
  methods: {
    initData() {
      // let obj = JSON.parse(chalk);
      echarts.registerTheme("chalk", chalk);
      this.myChart = echarts.init(this.$refs.chart1, "chalk");

      let option = {
        title: {
          text: "工序外协",
          x: "50px",
          y: "top",
          textStyle: {
            //字体系列
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 16
          }
        },
        backgroundColor: "rgba(0, 0, 0, 0)",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          // data: ["数量", "金额"]
          data: ["金额"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          name: "账龄天数",
          nameLocation: "start",
          nameTextStyle: {
            color: "#fff"
          }
        },
        yAxis: {
          type: "category",
          name: " 金额万元",
          nameLocation: "end",
          nameTextStyle: {
            color: "#fff"
          },
          data: this.subaufnrXData
        },
        series: [
          // {
          //   name: "数量",
          //   type: "bar",
          //   stack: "总量",
          //   label: {
          //     show: true,
          //     position: "insideRight"
          //   },
          //   data: this.subaufnrYCount
          // },
          {
            name: "金额",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data: this.subaufnrYMoney
          }
        ]
      };

      this.myChart.setOption(option);
    }
  },
  components: {},
  destroyed() {
    window.removeEventListener("resize", this.chartResize);
  }
};
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  .chart-content {
    width: 100%;
    height: 100%;
    background: url("../images/bottom.png");
    background-size: 100% 100%;
  }
}
</style>
