<template>
  <div class="main">
    <div class="mainleft">
      <h3>加签单据量</h3>
      <div class="num">
        <span>{{number}}单</span>
      </div>
    </div>
    <div class="mainRight">
      <h3>加签单据时长</h3>
      <ul class="signUl">
        <li class="signLi">
          <div class="icon icon1">
            <i class="iconfont icon-burningTime" />
          </div>
          <div class="time">{{highTime}}</div>
          <div class="timeDescribe">最高</div>
        </li>

        <li class="signLi">
          <div class="icon icon2">
            <i class="iconfont icon-burningTime" />
          </div>
          <div class="time">{{lowTime}}</div>
          <div class="timeDescribe">最低</div>
        </li>

        <li class="signLi">
          <div class="icon icon3">
            <i class="iconfont icon-burningTime" />
          </div>
          <div class="time">{{averageTime}}</div>
          <div class="timeDescribe">平均</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getCountersign } from "@/api/platform/bill/bill";
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
      highTime: "",
      lowTime: "",
      averageTime: ""
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
  },
  watch: {},
  methods: {
    initData() {
      getCountersign({
        group1: this.componInfo.parameters || ""
      }).then(res => {
        this.number = res.data.jqdjl;
        this.highTime = res.data.jqdjzgsc;

        this.lowTime = res.data.jqdjzdsc;
        this.averageTime = res.data.jqdcAvgTime;
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
  position: relative;
  .mainleft {
    float: left;
    width: 25%;
    height: 100%;
    background: -moz-linear-gradient(90deg, #6885fe 0, #2ac9fd);
    background: -webkit-gradient(90deg, #6885fe 0, #2ac9fd);
    background: -webkit-linear-gradient(90deg, #6885fe 0, #2ac9fd);
    background: -o-linear-gradient(90deg, #6885fe 0, #2ac9fd);
    background: -ms-linear-gradient(90deg, #6885fe 0, #2ac9fd);
    background: linear-gradient(90deg, #6885fe 0, #2ac9fd);
    > h3 {
      height: 50px;
      line-height: 50px;
      font-weight: bolder;
      color: #fff;
      font-size: 20px;
      text-indent: 5px;
      padding-top: 5px;
    }
    .num {
      display: flex;
      height: calc(100% - 55px);
      justify-content: center;
      align-items: center;
      > span {
        font-weight: bolder;
        color: #fff;
        font-size: 25px;
        letter-spacing: 2px;
      }
    }
  }
  .mainRight {
    float: left;
    width: 75%;
    height: 100%;
    background: #fff;
    > h3 {
      height: 50px;
      line-height: 50px;
      font-weight: bolder;
      color: #333;
      font-size: 20px;
      text-indent: 5px;
      padding-top: 5px;
    }
    .signUl {
      margin: 0;
      padding: 0;
      height: calc(100% - 55px);
      display: flex;
      justify-content: center;
      align-items: center;
      .signLi {
        width: 33%;
        //  height: 33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #ccc;
        .icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          > i {
            display: inline-block;
            color: #fff;
            font-size: 23px;
            margin-left: 3px;
          }
        }
        .icon1 {
          background: #9e3bea;
        }
        .icon2 {
          background: #f99133;
        }
        .icon3 {
          background: #6eb533;
        }
        .time {
          color: #333;
          font-size: 23px;
          font-weight: bolder;
          margin-top: 10px;
        }
        .timeDescribe {
          color: #333;
          font-size: 22px;
          margin-top: 15px;
        }
      }
      > li:last-child {
        border: none !important;
      }
    }
  }
}
</style>
