<template>
  <div class="borfinall">
    <div class="chart-content left" ref="chart1"></div>
    <div class="right">
      <div>
        <div class="imgbox">
          <img src="@/assets/images/desktop/finacial/Havetoborrow.png" alt />
          <p>已借金额</p>
        </div>
        <div class="money">
          <span>￥100.00</span>
        </div>
      </div>

      <div>
        <div class="imgbox">
          <img src="@/assets/images/desktop/finacial/return.png" alt />
          <p>已还金额</p>
        </div>

        <div class="money">
          <span>￥100.00</span>
        </div>
      </div>

      <div>
        <div class="imgbox">
          <img src="@/assets/images/desktop/finacial/notreturn.png" alt />
          <p>未还金额</p>
        </div>

        <div class="money">
          <span>￥100.00</span>
        </div>
      </div>
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
      myChart: ""
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
        backgroundColor: "#fff",

        title: {
          left: "center",
          top: 20,
          textStyle: {
            color: "#333"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "资金金额",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "资金1" },
              { value: 310, name: "资金2" },
              { value: 274, name: "资金3" },
              { value: 235, name: "资金4" },
              { value: 400, name: "资金5" }
            ].sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: "angle",
            label: {
              normal: {
                textStyle: {
                  color: "#333"
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "#333"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: "#c23531",
                shadowBlur: 200,
                shadowColor: "rgba(0, 0, 0, 0.5)"
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
    // border: 2px solid #3d6;
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 33%;
     // border: 1px solid #396293;
      .imgbox {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40%;
        margin: 0 auto;
        > img {
          width: 35px;
          height: 35px;
        }
        > p {
          color: #999a9d;
          font-size: 12px;
          margin: 10px 0 8px 0;
        }
      }
      .money {
        flex: 1;
        span {
          color: #57585a;
          font-weight: 700;
          font-size: 14px;
          color: rgb(160, 156, 156);
        }
      }
    }
  }
}
</style>



