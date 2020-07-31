<template>
  <div class="main" ref="main">
    <div class="chart">
      <div class="chart-content" ref="chart1" :style="{height:height}"></div>
    </div>

    <div class="messsage" ref="top">
      <div class="messLeft">
        <img :src="sing" />
        <span>累计已处理单据量：{{format(number1)}}</span>
      </div>

      <div class="messRight">
        <img :src="sing" />
        <span>累计逾期已处理单据量：{{format(number2)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";
import liquidFill from "echarts-liquidfill";
import { getYqycldhlzb } from "@/api/platform/bill/bill";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      number1: "",
      number2: "",
      value: 0,
      sing: require("@/assets/images/bill_rank/triangle.png"),
      myChart: "",
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
      getYqycldhlzb({
        clr: this.$store.getters.userId,
        group1: this.componInfo.parameters || "",
      }).then(res => {
       // console.log(res, "返回的数据");
        this.number1 = res.data["累计已处理单据量"];
        this.number2 = res.data["累计逾期已处理单据量"];
        this.value = parseInt(res.data["逾期处理单据占比"])/100;
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
      return (num + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
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
        title: {
          text: "逾期单量占比"
        },
        series: [
          {
            type: "liquidFill",
            data: [
              {
                name: "逾期单量占比",
                value: this.value
              },
              0.5,
              0.4,
              0.3
            ],
            name: "逾期单量占比",
            outline: {
              show: true
            }
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
  background: #fff;
  position: relative;
  .messsage {
    display: flex;
    align-items: center;
    align-items: center;
    .messLeft {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        line-height: 35px;
        color: #363331;
        font-size: 14px;
        font-weight: bold;
      }
      > img {
        width: 10px;
        height: 10px;
        padding-right: 5px;
      }
    }
    .messRight {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      > span {
        line-height: 35px;
        color: #363331;
        font-size: 14px;
        font-weight: bold;
      }
      > img {
        width: 10px;
        height: 10px;
        padding-right: 5px;
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
