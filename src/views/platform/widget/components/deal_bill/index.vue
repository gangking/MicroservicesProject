<template>
  <div class="main" ref="main">
    <!-- <img class="bgImg" :src="bgImg" /> -->
    <div class="title" ref="top">Hi,{{this.$store.getters.name}}，今日处理单据量</div>
    <div class="chart">
      <div class="chart-content" ref="chart1" :style="{height:height}"></div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
import { getAvgMaxDjl } from "@/api/platform/bill/bill";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      height: "200px",
      value: 30,
      myChart: "",
      bgImg: require("@/assets/images/bill_rank/bg-right.png"),
      title: "",
      zrcldjl: "",
      zravgcldjl: "",
      zrmaxcldjl: ""
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          if (this.$refs.main && this.$refs.top) {
            this.height =
              this.$refs.main.clientHeight -
              this.$refs.top.clientHeight -
              20 +
              "px";
          }
        });

        this.myChart && this.myChart.resize();
      }, 150);
    }
  },
  created() {},
  mounted() {
    this.getData();
    window.addEventListener("resize", this.chartResize);
  },
  watch: {},
  methods: {
    getData() {
      getAvgMaxDjl({
        clr: this.$store.getters.userId,
        group1: this.componInfo.parameters || "",
        clTime: this.getNowFormatDate()
      }).then(res => {
        this.zrcldjl = res.data.zrcldjl;
        this.zravgcldjl = res.data.zravgcldjl;
        this.zrmaxcldjl = res.data.zrmaxcldjl;
        this.$nextTick(() => {
          this.height =
            this.$refs.main.clientHeight -
            this.$refs.top.clientHeight -
            20 +
            "px";
        });
        setTimeout(() => {
          this.initData();
        }, 100);
      });

      //   "zrcldjl": 0,			// XX人XX组 日处理单据量
      // "zravgcldjl": 0,			//XX组 日平均处理单据量
      // "zrmaxcldjl": 0,			//XX组 日最高处理单据量
    },
    //获取当前日期
    //获取当前日期
    getNowFormatDate() {
      var date = new Date();
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.date = date.getDate();
      this.hour =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      this.minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      this.second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      this.milliSeconds = date.getMilliseconds();
      var currentTime =
        this.year +
        "-" +
        this.month +
        "-" +
        this.date +
        " " +
        this.hour +
        ":" +
        this.minute +
        ":" +
        this.second;
      return currentTime;
    },
    initData() {
      this.myChart = echarts.init(this.$refs.chart1);
      var charts = {
        // 按顺序排列从大到小
        cityList: ["您今日处理单量", "组内平均处理单量", "组内最高处理单量"],
        cityData: [this.zrcldjl, this.zravgcldjl, this.zrmaxcldjl]
      };
      var top10CityList = charts.cityList;
      var top10CityData = charts.cityData;
      var color = ["rgba(131,96,195", "rgba(15,155,15", "rgba(21,101,192"];

      let lineY = [];
      for (var i = 0; i < charts.cityList.length; i++) {
        var x = i;
        if (x > color.length - 1) {
          x = color.length - 1;
        }
        var data = {
          name: charts.cityList[i],
          color: color[x] + ")",
          value: top10CityData[i],
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                [
                  {
                    offset: 0,
                    color: color[x] + ", 0.3)"
                  },
                  {
                    offset: 1,
                    color: color[x] + ", 1)"
                  }
                ],
                false
              ),
              barBorderRadius: 10
            },
            emphasis: {
              shadowBlur: 15,
              shadowColor: "rgba(0, 0, 0, 0.1)"
            }
          }
        };
        lineY.push(data);
      }

     // console.log(lineY, "lineYlineYlineYlineY");
      let option = {
        backgroundColor: "#455EEE",
        title: {
          show: false
        },
        tooltip: {
          trigger: "item"
        },
        grid: {
          borderWidth: 0,
          top: "10%",
          left: "5%",
          right: "15%",
          bottom: "3%"
        },
        color: color,
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false,
              inside: false
            },
            data: top10CityList
          },
          {
            type: "category",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              inside: false,
              textStyle: {
                color: "#fff",
                fontSize: "14",
                fontFamily: "PingFangSC-Regular"
              },
              formatter: function(val) {
                //console.log(val);
                return "";
              }
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: top10CityData
          }
        ],
        xAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        series: [
          {
            name: "",
            type: "bar",
            zlevel: 2,
            barWidth: "10px",
            data: lineY,
            animationDuration: 1500,
            label: {
              normal: {
                color: "#fff",
                show: true,
                position: [0, "-24px"],
                textStyle: {
                  fontSize: 16
                },
                formatter: function(a, b) {
                  return a.name + " : " + a.value + "单";
                }
              }
            }
          }
        ],
        animationEasing: "cubicOut"
      };
      this.myChart.setOption(option);
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.chartResize);
  },
  components: {}
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  overflow: hidden;
  background: #455eee;
  position: relative;
  .bgImg {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 170px;
    height: 120px;
  }
  .title {
    margin: 50px 0 0 70px;
    height: 45px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }
  .block {
    margin-left: 70px;
    margin-right: 100px;
  }
  .chart {
    width: 100%;
    // height: calc(100vh - 100px);
    min-height: 100px;
    .chart-content {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
