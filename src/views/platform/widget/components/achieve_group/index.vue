<template>
  <div class="main" :style="backgroundImg">
    <div class="chart_title" :style="titleImg">
      <h3>共享运营中心绩效大屏</h3>
    </div>
    <div class="group_title">
      <h3 :style="groupImg">
        <span>{{groupName}}</span>
      </h3>
    </div>
    <div class="group">
      <div class="left">
        <!-- 排行榜 -->
        <div class="left_rank">
          <rank-item :componInfo="componInfo"></rank-item>
        </div>
        <!-- 单据处理时效 -->
        <div class="left_eff">
          <group-efficien :componInfo="componInfo"></group-efficien>
        </div>
      </div>
      <div class="center">
        <div class="center_month">
          <!-- <div class="line"></div> -->
          <div class="wrapper">
            <div class="text">本月新增单据量</div>
            <div class="number">
              <group-number :number="number1"></group-number>
            </div>
            <div class="text">本月已处理单据量</div>
            <div class="number">
              <group-number :number="number2"></group-number>
            </div>
          </div>
        </div>

        <div class="center_deal">
          <group-deal :componInfo="componInfo"></group-deal>
        </div>
      </div>
      <div class="right">
        <!-- 今日新增 -->
        <div class="right_analy">
          <group-analysis :componInfo="componInfo"></group-analysis>
        </div>
        <!-- 周转天数 -->
        <div class="right_turnover">
          <group-turnover :componInfo="componInfo"></group-turnover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupNumber from "@/views/platform/widget/components/achieve_group/components/number";
import groupTurnover from "@/views/platform/widget/components/achieve_group/components/group_turnover";
import groupAnalysis from "@/views/platform/widget/components/achieve_group/components/group_analysis";
import groupDeal from "@/views/platform/widget/components/achieve_group/components/group_deal";
import rankItem from "@/views/platform/widget/components/achieve_group/components/rank_item";
import groupEfficien from "@/views/platform/widget/components/achieve_group/components/group_efficien";
import { getGroupXzYclDjl, getGroupName } from "@/api/platform/achieve/group";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      groupName: "",
      backgroundImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/chart_bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      titleImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/title.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      groupImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/group_title.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      number1: "",
      number2: ""
    };
  },
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.initData();
    });
    this.getName();
  },
  watch: {
    componInfo: {
      handler(val) {
        //console.log(val);
      },
      immediate: true
    }
  },
  methods: {
    initData() {
      getGroupXzYclDjl({ group1: this.componInfo.parameters || "" }).then(
        res => {
          this.number1 = res.data["本月新增单据量"];
          this.number2 = res.data["本月处理单据量"];
        }
      );
    },
    getName() {
      getGroupName({
        groupId: this.componInfo.parameters || ""
      }).then(res => {
        this.groupName = res.data;
      });
    }
  },
  components: {
    rankItem,
    groupEfficien,
    groupDeal,
    groupAnalysis,
    groupTurnover,
    groupNumber
  }
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  position: relative;
  color: #fff;
  background-size: 100% auto;
  .chart_title {
    display: flex;
    justify-content: space-around;
    height: 95px;
    width: 95%;
    margin: 0 auto;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
  }
  .group_title {
    width: 95%;
    margin: 0 auto;
    position: relative;
    bottom: 50px;
    > h3 {
      width: 354px;
      height: 100px;
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      > span {
        margin-left: 106px;
      }
    }
  }

  .group {
    position: relative;
    bottom: 40px;
    width: 95%;
    margin: 0 auto;
    height: calc(100% - 170px);
    display: flex;
    .left {
      width: 350px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .left_rank {
        width: 100%;
        height: 60%;
      }
      .left_eff {
        width: 100%;
        flex: 1;
        margin-top: 20px;
      }
    }
    .center {
      padding: 0 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .center_month {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .wrapper {
          margin-left: 30%;
          .text {
            font-size: 25px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #ffffff;
            margin-bottom: 10px;
          }
          .number {
            // font-family: Impact;
            // font-size: 38px;
            // font-weight: normal;
            // font-stretch: normal;
            // line-height: 36px;
            // letter-spacing: 5px;
            // color: #00eaff;
            // margin-bottom: 3px;
          }
        }
      }
      .center_deal {
        width: 100%;
        height: 50%;
      }
    }
    .right {
      width: 350px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .right_analy {
        width: 100%;
        height: 60%;
      }
      .right_turnover {
        width: 100%;
        flex: 1;
        margin-top: 20px;
      }
    }
  }
}
</style>
