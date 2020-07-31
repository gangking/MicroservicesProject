<template>
  <div class="borfinall">
    <div class="chart-content left" ref="chart1"></div>
    <div class="right">
      <el-table :data="tableData">
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop="receivables" label="收款方"></el-table-column>
        <el-table-column prop="money" label="余额"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      myChart: "",
      tableData: [
        {
          bukrs: "公司1",
          receivables: "客户1",
          money: "5623"
        },
        {
          bukrs: "公司2",
          receivables: "客户1",
          money: "5423"
        },
        {
          bukrs: "公司3",
          receivables: "客户1",
          money: "1123"
        },
        {
          bukrs: "公司4",
          receivables: "客户1",
          money: "123"
        }
      ]
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.myChart && this.myChart.resize();
      }, 150);
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.initData();
    }, 100);

    window.addEventListener("resize", this.chartResize);
  },
  watch: {},
  methods: {
    initData() {
      this.myChart = echarts.init(this.$refs.chart1);
      let option = {
        backgroundColor: "#00265f",
        title: {
          text: "个人余额",
          x: "center",
          y: "4%",
          textStyle: {
            color: "#fff",
            fontSize: "22"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "15%",
          right: "3%",
          left: "5%",
          bottom: "12%"
        },
        xAxis: [
          {
            type: "category",
            data: ["余额1", "余额2", "余额3", "余额4", "余额5", "余额6"],
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)"
              }
            },
            axisLabel: {
              margin: 10,
              color: "#e2e9ff",
              textStyle: {
                fontSize: 14
              }
            }
          }
        ],
        yAxis: [
          {
            name: "单位：万元",
            axisLabel: {
              formatter: "{value}",
              color: "#e2e9ff"
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "rgba(255,255,255,1)"
              }
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: [5000, 2600, 1300, 1300, 1250, 1500],
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
                      color: "rgba(0,244,255,1)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(0,77,167,1)" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 30, 30],
                shadowColor: "rgba(0,160,221,1)",
                shadowBlur: 4
              }
            },
            label: {
              normal: {
                show: true,
                lineHeight: 30,
                width: 80,
                height: 30,
                backgroundColor: "rgba(0,160,221,0.1)",
                borderRadius: 200,
                position: ["-8", "-60"],
                distance: 1,
                formatter: ["    {d|●}", " {a|{c}}     \n", "    {b|}"].join(
                  ","
                ),
                rich: {
                  d: {
                    color: "#3CDDCF"
                  },
                  a: {
                    color: "#fff",
                    align: "center"
                  },
                  b: {
                    width: 1,
                    height: 30,
                    borderWidth: 1,
                    borderColor: "#234e6c",
                    align: "left"
                  }
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

<style lang="scss" scoped>
.borfinall {
  height: 100%;
  display: flex;
  .left {
    height: 100%;
    width: 70%;
  }
  .right {
    height: 100%;
    margin-left: 3px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }
}
</style>



