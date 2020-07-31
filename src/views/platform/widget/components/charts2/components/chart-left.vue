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
    difaccountMess: {
      type: Array,
      default: () => []
    },
    overaufnrMess: {
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
    difaXData() {
      return this.difaccountMess.map(item => {
        return item.mold;
      });
    },
    difaYMoney() {
      return this.difaccountMess.map((item, index) => {
        return (item.money / 1000).toFixed(2);
      });
    },
    difaYCount() {
      return this.difaccountMess.map((item, index) => {
        return item.count;
      });
    },
    overauXData() {
      return this.overaufnrMess.map(item => {
        return item.dlvcount;
      });
    },
    overauYMoney() {
      return this.overaufnrMess.map((item, index) => {
        return item.cnfmoney;
      });
    },
    overauYCount() {
      return this.overaufnrMess.map((item, index) => {
        return item.cnfcount;
      });
    }
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.chartResize);
  },
  watch: {
    difaccountMess: {
      handler(val, oldVal) {
        this.initDifaccount();
      },
      deep: true
    },
    overaufnrMess: {
      handler(val, oldVal) {
        this.initOveraufnr();
      },
      deep: true
    }
  },
  methods: {
    initDifaccount() {
      // let obj = JSON.parse(chalk);
      echarts.registerTheme("chalk", chalk);
      this.myChart = echarts.init(this.$refs.chart1, "chalk");
      let option = {
        backgroundColor: "rgba(0, 0, 0, 0)",
        title: {
          text: "存货价值差异",
          x: "center",
          y: "top",
          textStyle: {
            // //文字颜色
            // color: "#0ec8e0",
            // //字体风格,'normal','italic','oblique'
            // fontStyle: "normal",
            // //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            // fontWeight: "normal",
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
            label: {
              backgroundColor: "#6a7985"
            }
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
            name: "9999",
            boundaryGap: false,
            data: this.difaXData,
            nameTextStyle: {
              color: "#fff"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "金额（万元）",
            nameTextStyle: {
              color: "#fff"
            }
          }
        ],
        series: [
          { data: this.difaYMoney, type: "line", name: "金额", areaStyle: {} }
          //{ data: this.difaYCount, type: "line", name: "数量", areaStyle: {} }
        ]
      };

      this.myChart.setOption(option);
    },
    initOveraufnr() {
      // let obj = JSON.parse(chalk);
      echarts.registerTheme("chalk", chalk);
      this.myChart2 = echarts.init(this.$refs.chart2, "chalk");
      let option2 = {
        title: {
          text: "完工订单及时性",
          x: "left",
          y: "top",
          textStyle: {
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 16
          }
        },
        backgroundColor: "rgba(0, 0, 0, 0)",
        angleAxis: {
          type: "category",
          data: this.overauXData
        },
        tooltip: {
          formatter: function(params) {
            if (params.seriesName == "金额") {
              return params.name + "<br>金额：" + params.value;
            } else {
              return params.name + "<br>数量：" + params.value;
            }
          }
        },

        radiusAxis: {},
        polar: {},
        series: [
          {
            type: "bar",
            data: this.overauYCount,
            coordinateSystem: "polar",
            name: "数量",
            stack: "a",
            nameTextStyle: {
              color: "#fff"
            }
          },
          {
            type: "bar",
            data: this.overauYMoney,
            coordinateSystem: "polar",
            name: "金额",
            stack: "a",
            nameTextStyle: {
              color: "#fff"
            }
          }
        ],
        legend: {
          show: true,
          data: ["数量", "金额"]
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
    background: url("../images/left.png");
    background-size: 100% 100%;
    .chart-list1 {
      width: 70%;
      height: 48%;
    }
    .chart-list2 {
      width: 80%;
      height: 48%;
    }
  }
}
</style>
