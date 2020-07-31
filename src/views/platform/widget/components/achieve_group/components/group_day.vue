<template>
  <div class="main" :style="backgroundImg">
    <div class="unit">单位：天</div>
    <div class="main_title">库存周转天数</div>
    <div class="main_content">
      <div class="main_mess" :style="centerImg">15</div>
    </div>
  </div>
</template>

<script>
import { getMonthDjclsx } from "@/api/platform/achieve/group";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      backgroundImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/group_eff.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      centerImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/number.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      }
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
      getMonthDjclsx({ group1: this.componInfo.parameters || "" }).then(res => {
        //console.log(res, "处理天数");
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  .unit {
    position: absolute;
    right: 8px;
    top: 5px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 44px;
    letter-spacing: 0px;
    color: rgb(235, 222, 222);
  }
  .main_title {
    color: #00e4ff;
    text-indent: 40px;
    font-size: 18px;
  }
  .main_content {
    height: calc(100% - 30px);
    display: flex;
    justify-content: center;
    align-items: center;
    .main_mess {
      width: 220px;
      height: 220px;
      line-height: 220px;
      text-align: center;

      font-family: Impact;
      font-size: 33px;
      letter-spacing: 2px;
      color: #ffffff;
    }
  }
}
</style>
