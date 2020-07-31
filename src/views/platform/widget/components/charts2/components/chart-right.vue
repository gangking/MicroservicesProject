<template>
  <div class="chart">
    <div class="chart-content">
      <div class="chart-list1" ref="chart1"></div>
      <div class="chart-list2" ref="chart2"></div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
import chalk from "../halloween.json";
require("echarts/theme/dark");
export default {
  props: {
    wipaufnrData: {
      type: Array,
      default: () => []
    },
    feedaufnrData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      myChart: "",
      myChart2: ""
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.myChart && this.myChart.resize();
        this.myChart2 && this.myChart2.resize();
      }, 150);
    },
    wipaufnrXData() {
      return this.wipaufnrData.map(item => {
        return item.mold;
      });
    },
    wipaufnrYMoney() {
      return this.wipaufnrData.map((item, index) => {
        return item.money;
      });
    },
    wipaufnrYCount() {
      return this.wipaufnrData.map((item, index) => {
        return item.count;
      });
    },
    feedaufnrXData() {
      return this.feedaufnrData.map(item => {
        return item.AUART;
      });
    },
    feedaufnrYMoney() {
      return this.feedaufnrData.map((item, index) => {
        return item.money;
      });
    },
    feedaufnrYCount() {
      return this.feedaufnrData.map((item, index) => {
        return item.count;
      });
    }
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.chartResize);
  },
  watch: {
    wipaufnrXData: {
      handler(val) {
        this.initWipaufnr();
      },
      deep: true
    },
    feedaufnrData: {
      handler(val) {
        this.initFeedaufnr();
      }
    }
  },
  methods: {
    initWipaufnr() {
      echarts.registerTheme("chalk", chalk);
      this.myChart = echarts.init(this.$refs.chart1, "chalk");
      let option = {
        backgroundColor: "rgba(0, 0, 0, 0)",
        title: {
          text: "在制长期订单",
          x: "left",
          y: "top",
          textStyle: {
            //字体系列
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 16
          }
        },
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
          data: ["数量"]
        },
        xAxis: [
          {
            type: "category",
            data: this.wipaufnrXData,
            boundaryGap: false,
            name: "账龄天数",
            nameLocation: "end",
            nameTextStyle: {
              color: "#fff"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            nameTextStyle: {
              color: "#fff"
            }
          }
          // {
          //   type: "value",
          //   name: "金额",
          //   // min: 0,
          //   // max: 25,
          //   // interval: 5,
          //   axisLabel: {
          //     formatter: "{value} "
          //   }
          // }
        ],
        series: [
          {
            name: "数量",
            type: "bar",
            data: this.wipaufnrYMoney
          }
          // {
          //   name: "金额",
          //   type: "line",
          //   yAxisIndex: 1,
          //   data: this.wipaufnrYCount
          // }
        ]
      };
      this.myChart.setOption(option);
    },
    initFeedaufnr() {
      echarts.registerTheme("chalk", chalk);
      this.myChart2 = echarts.init(this.$refs.chart2, "chalk");
      let option2 = {
        title: {
          text: "投料率不合格订单",
          x: "left",
          y: "top",
          textStyle: {
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 16
          }
        },
        backgroundColor: "rgba(0, 0, 0, 0)",
        // title: {
        //   text: "柱状图动画延迟"
        // },
        legend: {
          // data: ["金额", "数量"]
        },
        // toolbox: {
        //   // y: 'bottom',
        //   feature: {
        //     magicType: {
        //       type: ["stack", "tiled"]
        //     },
        //     dataView: {},
        //     saveAsImage: {
        //       pixelRatio: 2
        //     }
        //   }
        // },
        tooltip: {},
        xAxis: {
          name: "订单类型",
          nameLocation: "start",
          data: this.feedaufnrXData,
          splitLine: {
            show: true
          },
          nameTextStyle: {
            color: "#fff"
          }
        },
        yAxis: {
          name: "数量（条）",
          nameTextStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "数量",
            type: "bar",
            data: this.feedaufnrYCount,
            animationDelay: function(idx) {
              return idx * 10;
            }
          }
          // {
          //   name: "金额",
          //   type: "bar",
          //   data: this.feedaufnrYMoney,
          //   animationDelay: function(idx) {
          //     return idx * 10 + 100;
          //   }
          // }
        ],
        animationEasing: "elasticOut",
        animationDelayUpdate: function(idx) {
          return idx * 5;
        }
      };

      this.myChart2.setOption(option2);
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
    // height: calc(100% - 30px);
    background: url("../images/right.png");
    background-size: 100% 100%;
    .chart-list1 {
      margin-left: 16%;
      width: 82%;
      height: 48%;
    }
    .chart-list2 {
      margin-left: 20%;
      margin-top: 2%;
      width: 80%;
      height: 48%;
    }
  }
}
</style>
