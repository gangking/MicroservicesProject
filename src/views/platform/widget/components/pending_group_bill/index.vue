<template>
  <div class="main" ref="main">
    <div class="mainTop" ref="mainTitle">
      <div class="title">组待处理单据量</div>
    </div>
    <div class="chart1">
      <div class="chart-content" ref="chart1" :style="{height:height1}"></div>
    </div>
    <div class="messsage" ref="messDay">
      <span>库存周转天数天</span>
      <i class="iconfont icon-overtime" />
    </div>
    <div class="chart chart2" :style="{height:height2}">
      <div class="chart-content chartLeft" ref="chart2" :style="{height:height2}"></div>
      <div class="chart-content chartRight" ref="chart3" :style="{height:height2}"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
import {
  getSddcldjlfb,
  getOverNormalGroup,
  getZztJk
} from "@/api/platform/bill/bill";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      personName: [], //组员的名字
      timeout4: [], //超时4H
      timeout8: [], //超时8H
      timeout24: [], //超时24H
      timeout48: [], //超时48H
      timeoutMore: [], //超时48以上H
      title: "本月处理单据",
      myChart: "",
      myChart1: "",
      myChart2: "",
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
        this.myChart2 && this.myChart2.resize();
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
      getOverNormalGroup({
        group1: this.componInfo.parameters || ""
      }).then(res => {
        this.overtimeData[0].value = res.data.zcdcldjl4Group;
        this.overtimeData[1].value = res.data.zcdcldjl8Group;
        this.overtimeData[2].value = res.data.zcdcldjl24Group;
        this.overtimeData[3].value = res.data.zcdcldjl48Group;
        this.overtimeData[4].value = res.data.zcdcldjl48ysGroup;

        // setTimeout(() => {
        //   this.initData();
        // }, 100);
      });
      //柱状图
      getZztJk({
        group1: this.componInfo.parameters || ""
      }).then(res => {
        console.log("组的处理量", res);
        this.personName = res.data.map(item => {
          return item.name;
        });
        this.timeout4 = res.data.map(item => {
          return item["超时4H"];
        });
        this.timeout8 = res.data.map(item => {
          return item["超时8H"];
        });

        this.timeout24 = res.data.map(item => {
          return item["超时24H"];
        });
        this.timeout48 = res.data.map(item => {
          return item["超时48H"];
        });

        this.timeoutMore = res.data.map(item => {
          return item["超时48H以上"];
        });

        setTimeout(() => {
          this.initData();
        }, 100);
      });
    },
    initData() {
      this.myChart = echarts.init(this.$refs.chart1);
      this.myChart1 = echarts.init(this.$refs.chart2);
      this.myChart2 = echarts.init(this.$refs.chart3);

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

      // 第三张图
      let option2 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["超时4H", "超时8H", "超时24H", "超时48h", "超时48h以上"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          max: 500
        },
        yAxis: {
          type: "category",
          data: this.personName
        },
        series: [
          {
            name: "超时4H",
            type: "bar",
            stack: "总量",
            barWidth: 30,
            itemStyle: {
              normal: {
                color: "#CD6155",
                barBorderRadius: [20, 20, 20, 20]
              }
            },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            z: 10,
            data: this.timeout4
          },
          {
            name: "超时8H",
            type: "bar",
            stack: "总量",
            barWidth: 30,
            itemStyle: {
              normal: {
                color: "#C0392B",
                barBorderRadius: [20, 20, 20, 20]
              }
            },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            z: 10,
            data: this.timeout8
          },
          {
            name: "超时24H",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                color: "#A93226",
                shadowBlur: [0, 0, 0, 10],
                shadowColor: "#ebe806",
                barBorderRadius: [20, 20, 20, 20],
                shadowOffsetX: -20
              }
            },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            z: 5,
            data: this.timeout24
          },
          {
            name: "超时48h",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 20, 20],
                color: "#B03A2E",
                shadowBlur: [0, 0, 0, 10],
                shadowColor: "#B03A2E",
                shadowOffsetX: -20
              }
            },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.timeout48
          },
          {
            name: "超时48h以上",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 20, 20],
                color: "#7B241C",
                shadowBlur: [0, 0, 0, 10],
                shadowColor: "#7B241C",
                shadowOffsetX: -20
              }
            },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.timeoutMore
          }
        ]
      };

      this.myChart.setOption(option);
      this.myChart1.setOption(option1);
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
    display: flex;
    .chartLeft {
      width: 50%;
    }
    .chartRight {
      width: 50%;
    }
  }
}
</style>
