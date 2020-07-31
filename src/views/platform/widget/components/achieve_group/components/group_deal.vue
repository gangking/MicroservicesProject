<template>
  <div class="main" :style="backgroundImg">
    <div class="unit">单位：单</div>
    <div class="main_title">今日已处理单据量</div>
    <div class="main_top">
      <div class="text" :style="textImg">今日已处理量</div>
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
import { getDaycldjlph } from "@/api/platform/achieve/group";
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
          "url(" + require("@/assets/images/achievement/group_back.png") + ")",
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
      number: null
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
    this.getData();
    window.addEventListener("resize", this.chartResize);
  },
  watch: {},
  methods: {
    getData() {
      getDaycldjlph({ group1: this.componInfo.parameters || "" }).then(res => {
        this.rank = res.data.slice(0, res.data.length - 1);
        this.number = res.data[res.data.length - 1]["组今日处理单据量"];
        setTimeout(() => {
          this.initData();
        });
      });
    },
    initData() {
      this.myChart = echarts.init(this.$refs.chart1);
      let option = {
        // backgroundColor: "#18163B",
        grid: {
          top: "15%",
          right: "3%",
          left: "5%",
          bottom: "12%"
        },
        xAxis: [
          {
            type: "category",
            color: "#fff",
            data: this.chartName,
            axisPointer: {
              type: "line"
            },
            axisTick: {
              //y轴
              show: false
            },
            axisLine: {
              textStyle: {
                color: "#59588D"
              },
              lineStyle: {
                color: "#59588D"
              }
            },
            axisLabel: {
              margin: 20,
              color: "#fff",
              textStyle: {
                fontSize: 12
              }
            },
            splitLine: {
              show: false //去掉网格线
            }
          }
        ],
        tooltip: {
          show: true,
          // backgroundColor: "#E8E093",
          // borderColor: "#E8E093",
          // borderWidth: 4,
          // textStyle: {
          //   color: "#354060"
          // },
          formatter: function(data) {
            // console.log(data, "data");
            return data.name + "单据量：" + data.value;
          },
          extraCssText: "box-shadow: 0 0 10px rgba(37,47,77,0.8)"
        },
        yAxis: [
          {
            min: 0,
            axisLabel: {
              formatter: "{value}",
              color: "#59588D"
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false //去掉网格线
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: this.chartValue,
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#41E1D4" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#10A7DB" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 0, 0],
                shadowColor: "rgba(0,255,225,1)",
                shadowBlur: 4
              }
            },
            label: {
              normal: {
                show: true,
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
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
    text-indent: 70px;
    font-size: 18px;
  }
  .main_top {
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 10px;
    .text {
      text-indent: 10px;
      width: 120px;
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
