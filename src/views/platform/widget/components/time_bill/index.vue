<template>
  <div class="main" ref="main">
    <!-- <img class="bgImg" :src="bgImg" /> -->
    <div class="title" ref="top">Hi,{{this.$store.getters.name}}，你平均每单处理时长</div>
    <div class="chart">
      <div class="chart-content" ref="chart1" :style="{height:height}"></div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
import { getIndividualProcessingTime } from "@/api/platform/bill/bill";
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
      value: 30,
      bgImg: require("@/assets/images/bill_rank/time.png"),
      time: "", //组的处理时长
      time2: "" //自己的处理时长
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.height =
            this.$refs.main.clientHeight -
            this.$refs.top.clientHeight -
            20 +
            "px";
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
      getIndividualProcessingTime({
        clr: this.$store.getters.userId,
        group1: this.componInfo.parameters || "",
        clTime: this.getNowFormatDate()
      }).then(res => {
        this.time = res.data.individualProcessingTime;
      });
      getIndividualProcessingTime({
        group1: this.componInfo.parameters || "",
        clTime: this.getNowFormatDate()
      }).then(res => {
        this.time2 = res.data.individualProcessingTime;
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

      // "zrmaxcldjl": 0,			//处理时间
    },
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
        cityList: ["您平均每单处理时长", "组内标准处理时长"],
        cityData: [this.time, this.time2]
      };
      var top10CityList = charts.cityList;
      var top10CityData = charts.cityData;
      var color = ["rgba(247,164,26", "rgba(39,92,117"];

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

      console.log(lineY);
      let option = {
        backgroundColor: "#916BFF",
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
                color: "#ffff",
                fontSize: "14",
                fontFamily: "PingFangSC-Regular"
              },
              formatter: function(val) {
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
                  return a.name + " : " + a.value + "分";
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
  components: {}
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  overflow: hidden;
  background: #916bff;
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
}
</style>
