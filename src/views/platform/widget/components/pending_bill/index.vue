<template>
  <div class="main" ref="main">
    <div class="mainTop" ref="mainTitle">
      <div class="title">待处理单据量</div>
    </div>
    <div class="chart1">
      <div class="chart-content" ref="chart1" :style="{height:height1}"></div>
    </div>
    <div class="messsage" ref="messDay">
      <span>库存周转天数5天</span>
      <i class="iconfont icon-overtime" />
    </div>
    <div class="chart chart2">
      <div class="chart-content" ref="chart2" :style="{height:height2}"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
import { getSddcldjlfb, getOverNormal } from "@/api/platform/bill/bill";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: "本月处理单据",
      myChart: "",
      myChart1: "",
      dataVal: [],
      xdata: [],
      height1: "200px",
      height2: "200px",
      overtimeData: [
        {
          value: 0,
          name: "超时4h"
        },
        {
          value: 0,
          name: "超时8h"
        },
        {
          value: 0,
          name: "超时24h"
        },
        {
          value: 0,
          name: "超时48h"
        },
        {
          value: 0,
          name: "超时48h以上"
        }
      ]
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.height1 =
            (this.$refs.main.clientHeight -
              this.$refs.mainTitle.clientHeight -
              this.$refs.messDay.clientHeight) *
              0.4 +
            "px";

          this.height2 =
            (this.$refs.main.clientHeight -
              this.$refs.mainTitle.clientHeight -
              this.$refs.messDay.clientHeight) *
              0.6 +
            "px";
        });

        this.myChart && this.myChart.resize();
        this.myChart1 && this.myChart1.resize();
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
      getSddcldjlfb({
        clr: this.$store.getters.userId,
        group1: this.componInfo.parameters || ""
      }).then(res => {
        console.log(res, "返回的数据");
        this.xdata = res.data["时间分布"].map(list => {
          return list.substr(11, 15);
        });
        this.dataVal = res.data["数量"];
        // this.number = res.data.drzxdjl + "";
        // this.percentage = res.data.percentage;
        this.$nextTick(() => {
          this.height1 =
            (this.$refs.main.clientHeight -
              this.$refs.mainTitle.clientHeight -
              this.$refs.messDay.clientHeight) *
              0.4 +
            "px";

          this.height2 =
            (this.$refs.main.clientHeight -
              this.$refs.mainTitle.clientHeight -
              this.$refs.messDay.clientHeight) *
              0.6 +
            "px";
        });
      });
      getOverNormal({
        clr: this.$store.getters.userId,
        group1: this.componInfo.parameters || ""
      }).then(res => {
        this.overtimeData[0].value = res.data.zcdcldjl4;
        this.overtimeData[1].value = res.data.zcdcldjl8;
        this.overtimeData[2].value = res.data.zcdcldjl24;
        this.overtimeData[3].value = res.data.zcdcldjl48;
        this.overtimeData[4].value = res.data.zcdcldjl48ys;

        setTimeout(() => {
          this.initData();
        }, 100);
      });
    },
    initData() {
      this.myChart = echarts.init(this.$refs.chart1);
      this.myChart1 = echarts.init(this.$refs.chart2);

      let option = {
        backgroundColor: "#B165FB",
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
              return data.name + "</br>" + "单据量：" + data.value;
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

      // 第二张图

      var center = ["50%", "50%"];
      var radius = {
        内: ["54%", "60%"],
        pie: ["60%", "70%"],
        中: ["70%", "76%"],
        外: ["70%", "85%"]
      };

      var legenddata = this.overtimeData.map(item => item.name);
      let option1 = {
        backgroundColor: "#ffffff",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          top: "center",
          align: "left",
          itemHeight: 20,
          itemWidth: 20,
          textStyle: {
            color: "#333333"
          },
          data: legenddata
        },
        series: [
          {
            name: "超时处理单据",
            type: "pie",
            radius: radius["pie"],
            center: center,
            avoidLabelOverlap: false,
            color: ["#CD6155", "#C0392B", "#A93226", "#B03A2E", "#7B241C"],
            label: {
              normal: {
                show: false,
                position: "center",
                formatter: "{b}\n\n{c}"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "15",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.overtimeData
          },
          {
            name: "背景外圆环",
            type: "pie",
            radius: radius["外"],
            center: center,
            color: "rgba(0,0,0,.2)",
            silent: true,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                name: "",
                value: 100
              }
            ]
          },
          {
            name: "背景中圆环",
            type: "pie",
            radius: radius["中"],
            center: center,
            color: "rgba(0,0,0,.3)",
            silent: true,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                name: "",
                value: 100
              }
            ]
          },
          {
            name: "背景内圆环",
            type: "pie",
            radius: radius["内"],
            center: center,
            color: "rgba(0,0,0,.1)",
            silent: true,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                name: "",
                value: 100
              }
            ]
          }
        ]
      };

      this.myChart.setOption(option);
      this.myChart1.setOption(option1);
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
  .mainTop {
    background: #b165fb;
    .title {
      height: 50px;
      line-height: 50px;
      color: #fff;
      font-size: 20px;
      text-indent: 15px;
      font-weight: bold;
    }
  }
  .messsage {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    background: #a051ea;
    height: 50px;
    > span {
      display: inline-block;
      color: #fff;
      font-size: 16px;
      margin-right: 10px;
      font-size: 18px;
      font-weight: bold;
    }
    > i {
      margin-right: 10px;
      display: inline-block;
      color: #fff;
      font-size: 25px;
    }
  }

  .chart {
    width: 100%;
    //height: calc(50vh - 100px);
    min-height: 100px;
    .chart-content {
      width: 100%;
      height: 100%;
    }
  }
  .chart2 {
    background: #fff;
  }
}
</style>
