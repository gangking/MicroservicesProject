<template>
  <div class="chart">
    <div class="chart-content" ref="chart">
      <div ref="chart1"></div>
      <div ref="chart2"></div>
      <div ref="chart3"></div>
      <div ref="chart4"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import chalk from "../chalk.json";
require("echarts/theme/dark");
export default {
  props: {},
  data() {
    return {
      myChart1: "",
      myChart2: "",
      myChart3: "",
      myChart4: ""
    };
  },
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.initData();
    }, 100);

    // window.addEventListener("resize", () => {
    //   this.myChart.resize();
    // });
  },
  watch: {},
  methods: {
    initData() {
      // let obj = JSON.parse(chalk);
      echarts.registerTheme("chalk", chalk);
      this.myChart1 = echarts.init(this.$refs.chart1, "chalk");
      this.myChart2 = echarts.init(this.$refs.chart2, "chalk");
      this.myChart3 = echarts.init(this.$refs.chart3, "chalk");

      this.myChart4 = echarts.init(this.$refs.chart4, "chalk");

      let option = {
        backgroundColor: "rgba(0, 0, 0, 0)",
        tooltip: {
          trigger: "item",
          formatter: " {b}：{c} "
        },
        color: ["#D06052", "#E29F39", "#4C9BC7"], //环形颜色
        graphic: {
          //图形中间文字
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "66",
            textAlign: "center",
            fill: "#fff",
            fontSize: 20
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["30%", "50%"], //饼图大小
            labelLine: {
              //图形外文字线
              normal: {
                length: 35,
                length2: 80
              }
            },
            label: {
              normal: {
                formatter: " {c|{c}%}  \n  {b|{b}}  \n\n", //图形外文字上下显示
                borderWidth: 20,
                borderRadius: 4,
                padding: [0, -80], //文字和图的边距
                rich: {
                  a: {
                    color: "#333",
                    fontSize: 33,
                    lineHeight: 20
                  },
                  b: {
                    //name 文字样式
                    fontSize: 20,
                    lineHeight: 20,
                    color: "#CDCDD0"
                  },
                  c: {
                    //value 文字样式
                    fontSize: 20,
                    lineHeight: 20,
                    color: "#63BF6A",
                    align: "center"
                  }
                }
              }
            },
            data: [
              { value: 5, name: "数据1" },
              { value: 9, name: "数据2" },
              { value: 16, name: "数据3" }
            ]
          }
        ]
      };

      let option2 = {
        backgroundColor: "rgba(0, 0, 0, 0)",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        //   orient: "vertical",
        //   x: "left",
        //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        // },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };

      let option3 = {
        backgroundColor: "rgba(0, 0, 0, 0)",
        angleAxis: {},
        radiusAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四"],
          z: 10
        },
        polar: {},
        series: [
          {
            type: "bar",
            data: [1, 2, 3, 4],
            coordinateSystem: "polar",
            name: "A",
            stack: "a"
          },
          {
            type: "bar",
            data: [2, 4, 6, 8],
            coordinateSystem: "polar",
            name: "B",
            stack: "a"
          },
          {
            type: "bar",
            data: [1, 2, 3, 4],
            coordinateSystem: "polar",
            name: "C",
            stack: "a"
          }
        ],
        legend: {
          show: true,
          data: ["A", "B", "C"]
        }
      };

      this.myChart1.setOption(option);
      this.myChart2.setOption(option2);

      this.myChart3.setOption(option3);
      this.myChart4.setOption(option2);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  .chart-content {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    > div {
      width: 25%;
      height: 100%;
    }
  }
}
</style>
