<template>
  <div class="main" :style="backgroundImg">
    <div class="chart_title" :style="titleImg">
      <h3>共享运营中心绩效大屏</h3>
    </div>
    <div class="group_title">
      <h3 :style="groupImg">
        <span>共享中心组总体处理</span>
      </h3>
    </div>
    <div class="achive_info">
      <achive-item class="item" :list="monthAdd" />
      <achive-item :list="dayAdd" />
      <achive-item :list="monthDeal" />
      <achive-item :list="dayDeal" />
    </div>
    <div class="group">
      <group-item class="groupItem groupItemLine" :rank="monthAddRank" title="本月新增单据量排行" />
      <group-item class="groupItem" :rank="dayAddRank" title="今日新增单据量排行" />
      <group-item class="groupItem groupItemLine" :rank="monthDealRank" title="本月处理单据量排行" />
      <group-item class="groupItem" :rank="dayDealRank" title="今日处理单据量排行" />
    </div>
  </div>
</template>

<script>
import achiveItem from "@/views/platform/widget/components/achieve_screen/components/achive_item";
import groupItem from "@/views/platform/widget/components/achieve_screen/components/group_item";
import mixin from "@/views/platform/widget/components/achieve_screen/minxins/getData";
import {
  getScreen,
  getShareXzDjlPh,
  getShareXzDjlPhDay,
  getShareYclDklphMonth,
  getShareYclDklphDay,
  getGroupName
} from "@/api/platform/achieve/screen";
export default {
  props: {
    props: {
      componInfo: {
        type: Object,
        default: () => {}
      }
    }
  },
  minxins: [mixin],
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
      monthAdd: {
        title: "本月新增单据量",
        lastTitle: "上月总数"
      },
      dayAdd: {
        title: "今日新增单据量",
        lastTitle: "昨日总数"
      },
      monthDeal: {
        title: "本月处理单据量",
        lastTitle: "上月总数"
      },
      dayDeal: {
        title: "今日处理单据量",
        lastTitle: "昨日总数"
      },

      monthAddRank: [],
      dayAddRank: [],
      monthDealRank: [],
      dayDealRank: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
    this.rankData();
  },
  watch: {},
  methods: {
    async initData() {
      let res = await getScreen();
      let data = res.data;
      this.$set(this.monthAdd, "billNum", data["共享中心本月新增单据量"]);
      this.$set(this.monthAdd, "lastNum", data["共享中心上月新增单据量"]);

      this.$set(this.dayAdd, "billNum", data["共享中心本日新增单据量"]);
      this.$set(this.dayAdd, "lastNum", data["共享中心昨日新增单据量"]);

      this.$set(this.monthDeal, "billNum", data["共享中心本月处理单据量"]);
      this.$set(this.monthDeal, "lastNum", data["共享中心上月处理单据量"]);

      this.$set(this.dayDeal, "billNum", data["共享中心今日处理单据量"]);
      this.$set(this.dayDeal, "lastNum", data["共享中心昨日处理单据量"]);
    },
    async rankData() {
      let resRank = await Promise.all([
        getShareXzDjlPh(),
        getShareXzDjlPhDay(),
        getShareYclDklphMonth(),
        getShareYclDklphDay()
      ]);
      // 本月新增

      //console.log(resRank, "rankDatarankDatarankData");

      this.monthAddRank = resRank[0].data.sort(this.aycArray);
      this.dayAddRank = resRank[1].data.sort(this.aycArray);
      this.monthDealRank = resRank[2].data.sort(this.aycArray);
      this.dayDealRank = resRank[3].data.sort(this.aycArray);
      //console.log(this.monthAddRank, "this.monthAddRank");
    },
    aycArray(a, b) {
      return b.value - a.value;
    },
    getName() {
      getGroupName({
        groupId: this.componInfo.parameters || ""
      }).then(res => {
        this.groupName = res;
      });
    }
  },
  components: {
    achiveItem,
    groupItem
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
  .achive_info {
    width: 80%;
    margin: 0 auto;
    position: relative;
    bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .group {
    width: 95%;
    margin: 0 auto;
    height: calc(100% - 300px);
    display: flex;
    flex-wrap: wrap;
    .groupItem {
      width: 49%;
      height: 49%;
    }
    .groupItemLine {
      margin-right: 2%;
    }
  }
}
</style>
