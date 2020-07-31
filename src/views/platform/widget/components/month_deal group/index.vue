<template>
  <div class="main">
    <div class="mianLeft">
      <div class="ring" :style="bgImg">
        <i class="iconfont icon-danju2" />
      </div>
    </div>
    <div class="mainRight">
      <div class="center">
        <h3>本月已处理单据量</h3>
        <div class="number">
          <span>{{number}}</span>
          <i v-if="parseInt(percentage)>=0" class="iconfont icon-shangsheng" />
          <i v-else class="iconfont icon-xiajiang" />
        </div>
        <div class="tip">同比{{computedPer}}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMonthAndtre } from "@/api/platform/bill/bill";
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

      bgImg: {
        backgroundImage:
          "url(" + require("@/assets/images/bill_rank/deal.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto"
      }
    };
  },
  computed: {
    computedPer() {
      let num = parseInt(this.percentage);
      if (num > 0) {
        return "增长" + num;
      } else {
        return "下降" + num;
      }
    }
  },
  created() {},
  mounted() {
    this.initData();
  },
  watch: {},
  methods: {
    computPer(num) {
      if (num) {
      }
    },
    initData() {
      getMonthAndtre({
        group1: this.componInfo.parameters || "",
        clTime: this.getNowFormatDate()
      }).then(res => {
        this.number = res.data.bycldjl;
        this.percentage = res.data.bycldjlbl;
      });
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
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  .mianLeft {
    width: 35%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .ring {
      width: 125px;
      height: 125px;
      display: flex;
      justify-content: center;
      align-items: center;

      > i {
        display: inline-block;
        font-size: 50px;
        color: #fff;
      }
    }
  }
  .mainRight {
    width: 65%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .center {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      > h3 {
        color: #333;
        font-weight: bolder;
        line-height: 35px;
        font-size: 22px;
      }
      .number {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
          display: inline-block;
          font-weight: bolder;
          font-size: 22px;
          margin-right: 10px;
        }
        > i {
          color: #e74c3c;
          font-size: 20px;
        }
      }
      .tip {
        height: 40px;
        line-height: 40px;
        color: #ccc;
      }
    }
  }
}
</style>
