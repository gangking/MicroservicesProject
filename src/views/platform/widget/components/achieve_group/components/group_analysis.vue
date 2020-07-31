<template>
  <div class="main" :style="backgroundImg">
    <div class="unit">单位：单</div>
    <div class="main_title">新增单据量分析</div>
    <div class="main_top">
      <div class="text" :style="textImg">今日新增单据量</div>
      <div class="number">{{number}}</div>
    </div>
    <div class="main_chart">
      <div class="chart-content" ref="chart1"></div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
import { getPastThirty } from "@/api/platform/achieve/group";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      backgroundImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/rank_bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      textImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/text_bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      myChart: "",
      number: "",
      xdata: [],
      dataVal: []
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          // this.height =
          //   this.$refs.main.clientHeight - this.$refs.top.clientHeight + "px";
        });

        this.myChart && this.myChart.resize();
      }, 150);
    },
    chartName() {
      return this.rank.map(item => {
        return item.name;
      });
    },
    chartValue() {
      return this.rank.map(item => {
        return item.value;
      });
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.getData();
    });

    window.addEventListener("resize", this.chartResize);
  },
  watch: {},
  methods: {
    getData() {
      getPastThirty({
        group1: this.componInfo.parameters || "",
        clTime: this.getNowFormatDate()
      }).then(res => {
       // console.log(res, "返回的数据");
        this.xdata = res.data.datePatam.map(list => {
          return list.substr(5, 5);
        });
        this.dataVal = res.data.longPatam;
        this.number = res.data.drzxdjl;

        setTimeout(() => {
          this.initData();
        }, 100);
      });
    },
    //千分位处理
    format(num) {
      return num.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
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
      let option = {
        backgroundColor: "",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B"
            }
          },
          formatter: function(params) {
            return params[0].name + "<br>" + params[0].data;
          }
        },
        legend: {},
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
            axisLine: {
              lineStyle: {
                color: "#0DB2CE",
                width: 2
              }
            },
            axisTick: {
              show: false
            },
            data: this.xdata
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#65F5FD"
                // fontSize:33
              }
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#385B71"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            // name: '移动',
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3
              }
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "rgba(84,91,255,1)"
                  },
                  {
                    offset: 1,
                    color: "rgba(8,210,255,1)"
                  }
                ]),
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(8,210,255,0)"
                    },
                    {
                      offset: 0.5,
                      color: "rgba(8,210,255,0.05)"
                    },
                    {
                      offset: 1,
                      color: "rgba(84,91,255,0.2)"
                    }
                  ])
                }
              },
              emphasis: {
                color: "rgb(0,196,132)",
                borderColor: "rgba(0,196,132,0.2)",
                extraCssText: "box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);",
                borderWidth: 10
              }
            },
            data: this.dataVal
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
.main {
  width: 100%;
  height: 100%;
  position: relative;
  .unit {
    position: absolute;
    right: 8px;
    top: 5px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 44px;
    letter-spacing: 0px;
    color: rgb(235, 222, 222);
  }
  .main_title {
    color: #00e4ff;
    text-indent: 50px;
    font-size: 18px;
  }
  .main_top {
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 10px;
    .text {
      text-indent: 10px;
      width: 140px;
      font-size: 15px;
      font-weight: bold;
      font-stretch: normal;
      line-height: 25px;
      letter-spacing: 0px;
      color: #00e4ff;
    }
    .number {
      font-family: Impact;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 25px;
      letter-spacing: 0px;
      color: #00eaff;
      margin-left: 10px;
    }
  }
  .main_chart {
    height: calc(100% - 60px);
    .chart-content {
      height: 100%;
    }
  }
}
</style>
