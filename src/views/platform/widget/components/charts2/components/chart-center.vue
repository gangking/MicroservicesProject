<template>
  <div class="chart" ref="chart">
    <div class="chart-content">
      <div class="list-content">
        <ul class="list">
          <li v-for="(item,index) in centerMessage" :key="index" class="list-li">
            <el-tooltip class="item" effect="dark" placement="top" popper-class="chart-main">
              <div slot="content">{{getTitle(item.title)}}</div>
              <h3>{{item.title}}</h3>
            </el-tooltip>
            <!-- <el-popover
              placement="top"
              title
              effect="dark"
              width="200"
              trigger="hover"
              :content="getTitle(item.title)"
            >
              <h3 slot="reference">{{item.title}}</h3>
            </el-popover>-->

            <div>{{item.count}}条</div>
            <div>{{exchangeThousand(item.money)}}万元</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import "lib-flexible";
export default {
  props: {
    centerMessage: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.initData();
    }, 100);
    this.htRem();
    window.onresize = () => {
      this.htRem();
    };
  },
  watch: {},
  methods: {
    htRem() {
      let ww = document.documentElement.clientWidth;
      if (ww > 750) {
        ww = 750;
      }
      this.$nextTick(() => {
        this.$refs.chart.style.fontSize = ww / 7.5 + "px";
      });
    },
    exchangeThousand(num) {
      return (Math.abs(num) / 1000).toFixed(2);
    },
    initData() {},
    getTitle(name) {
      let titleObj = {
        跨期打开订单: "监控已经关闭（TECO）但是有重新打开的订单。",
        存货差异科目:
          "监控存货差异科目物料标准价格和收货价格超过10%的物料、行项目差异总金额超过20万的物料。",
        完工订单及时性:
          "在制订单实际生产完工后，必须系统报工、收货完毕。已收货的订单（DLV）系统报工完毕（CNF），已报工完毕的订单（CNF），系统应已收货（DLV）。",
        完工订单投料率:
          "生产完工订单投料率满足98%≤目标值≤102%(投料率=(|实际直接材料-材料价差|)/计划直接材料）。",
        外协收货及时性:
          "工序外协采购订单应在下单后30天内完成收货。生产订单收货后，外协采购订单必须收货。",
        长期在制订单:
          "主机订单实际下达日期 >90天、其他订单实际下达日期 >30天的生产订单（珠海港机、重能按照提交报告的天数考核）。"
      };
      return titleObj[name];
    }
  },
  components: {}
};
</script>
<style lang="scss">
.chart-main {
  width: 200px;
  > div {
    font-size: 0.14rem;
  }
}
</style>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  .chart-content {
    width: 100%;
    height: 100%;
    //  display: flex;
    // justify-content: space-between;
    // > div {
    //   width: 25%;
    //   height: 100%;
    // }
    .list-content {
      width: 95%;
      margin: 15% auto;
      .list {
        display: flex;
        flex-wrap: wrap;
        .list-li {
          width: 30%;
          height: 30%;
          margin: 0 3% 20px 0;
          background: url("../images/center-list.png");
          background-size: 100% 100%;
          h3 {
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            text-shadow: 0 0 10px #24c6dc;
            font-size: 0.2rem;
            white-space: nowrap;
            overflow: hidden;
          }
          > div {
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-weight: bold;
            font-size: 0.2rem;
            color: #24c6dc;
            text-shadow: 0 0 10px;
            // text-shadow: 1px 1px 1px #9c7373;
          }
        }
      }
    }
  }
}
</style>
