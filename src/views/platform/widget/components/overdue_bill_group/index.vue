<template>
  <div class="main" ref="main">
    <div class="messsage" ref="top">
      <div class="messLeft">
        <h3>今日逾期处理量</h3>
        <h3>{{format(number)}}</h3>
        <h3>比昨天{{computedPer}}%</h3>
      </div>
      <div class="messRight">
        <i class="iconfont icon-overtime" />
      </div>
    </div>
    <div class="chart">
      <div class="chart-content" ref="chart1" :style="{height:height}"></div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
import { getPastThirtyOverdue } from "@/api/platform/bill/bill";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      number: "",
      percentage: "",
      title: "本月处理单据",
      myChart: "",
      dataVal: [],
      xdata: [],
      height: "200px"
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.height =
            this.$refs.main.clientHeight - this.$refs.top.clientHeight + "px";
        });

        this.myChart && this.myChart.resize();
      }, 150);
    },
    computedPer() {
      let num = parseInt(this.percentage);
      if (num >= 0) {
        return "提升了" + num;
      } else {
        return "下降了" + num;
      }
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
      getPastThirtyOverdue({
        group1: this.componInfo.parameters || "",
        clTime: this.getNowFormatDate()
      }).then(res => {
        console.log(res, "返回的数据");
        this.xdata = res.data.datePatam.map(list => {
          return list.substr(5, 5);
        });
        this.dataVal = res.data.longPatam;
        this.number = res.data.drzxdjl + "";
        this.percentage = res.data.percentage;
        this.$nextTick(() => {
          this.height =
            this.$refs.main.clientHeight - this.$refs.top.clientHeight + "px";
        });
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
      //  backgroundColor: "#e74c3c",
      let option = {
        backgroundColor: "#e74c3c",
        grid: {
          left: "2%",
          right: "4%",
          bottom: "10%",
          top: "14%",
          containLabel: true
        },
        tooltip: {
          show: true,
          backgroundColor: "#E8E093",
          borderColor: "#E8E093",
          borderWidth: 4,
          textStyle: {
            color: "#354060"
          },
          formatter: function(data) {
            if (data.componentType == "series") {
              return data.name + "日:" + "</br>" + "单据量：" + data.value;
            } else if (data.componentType == "markPoint") {
              return data.name + ":" + data.value;
            }
          },
          extraCssText: "box-shadow: 0 0 10px rgba(37,47,77,0.8)"
        },

        title: {
          //text: "交易总量统计",
          x: "2%",
          y: "2%",
          textStyle: {
            color: "#fff",
            fontSize: "22"
          }
        },
        xAxis: {
          show: false,
          type: "category",
          data: this.xdata,
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "#DFDFDF"
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },

        yAxis: {
          show: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.2)"
            }
          }
        },

        series: [
          {
            type: "line",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              color: "#fff"
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: "#333"
                  }
                }
              },
              data: [
                {
                  type: "max",
                  name: "最大值"
                },
                {
                  type: "min",
                  name: "最小值"
                }
              ]
            },
            data: this.dataVal
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
.main {
  height: 100%;
  overflow: hidden;
  background: #e74c3c;
  position: relative;
  .messsage {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 20px 0 30px;
    .messLeft {
      width: 70%;
      > h3 {
        line-height: 35px;
        color: #fff;
        font-size: 25px;
      }
    }
    .messRight {
      > i {
        color: #fff;
        font-size: 50px;
      }
    }
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
