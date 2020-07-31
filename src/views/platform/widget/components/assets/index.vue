<template>
  <div class="financial" ref="main">
    <div class="redblock_title" ref="title">
      <span class="redblock"></span>
      <label>我的资产</label>
      <!-- <a href="#"><img class="bigger" src="@/assets/images/desktop/amplification.png"></a> -->
    </div>
    <div class="tabs" ref="tabs">
      <span
        class="djprogress"
        :class="isActive=='myAssets'?'tabActive':''"
        @click="change(myAssets,'myAssets')"
      >个人资产</span>
      <el-divider direction="vertical" v-if="showDepart" />
      <span
        v-if="showDepart"
        class="djprogress"
        :class="isActive=='departmentAssets'?'tabActive':''"
        @click="change(departmentAssets,'departmentAssets')"
      >部门资产</span>
    </div>

    <div class="compon">
      <transition name="fade" mode="out-in">
        <component :is="currentView" class="opacity"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import departmentAssets from "@/views/platform/widget/components/assets/components/department-assets";
import myAssets from "@/views/platform/widget/components/assets/components/my-assets";
import { getBmzc, getUserNo } from "@/api/platform/assets/assets";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showDepart: true,
      departmentAssets,
      myAssets,
      userid: this.$store.getters.userId,
      currentView: "myAssets",
      isActive: "myAssets",
      height: "200px"
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.height =
            this.$refs.main.clientHeight -
            this.$refs.title.clientHeight -
            this.$refs.tabs.clientHeight +
            "px";
        });
        //  console.log(this.height, "888888");
      }, 150);
    }
  },
  methods: {
    change(tabItem, active) {
      this.currentView = tabItem;
      this.isActive = active;
    }
  },
  mounted() {
    getUserNo({ subPid: this.userid }).then(result => {
      this.userNo = result.data.userId;
      getBmzc({
        userNo: this.userNo,
        limit: 10,
        page: 1
      }).then(response => {
        if (response.data && response.data.length > 0) {
          this.showDepart = true;
        } else {
          this.showDepart = false;
        }
      });
    });
    window.addEventListener("resize", this.chartResize);
  },
  components: {
    departmentAssets,
    myAssets
  },
  destroyed() {
    window.removeEventListener("resize", this.chartResize);
  }
};
</script>

<style lang="scss" scoped>
.financial {
  height: 100%;
  background: #fff;
  .redblock_title {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    .redblock {
      display: inline-block;
      width: 5px;
      height: 17px;
      background-color: #e61a23;
      margin-right: 15px;
    }
    > label {
      display: inline-block;
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.tabs {
  text-align: center;
  padding-bottom: 15px;
  > span {
    cursor: pointer;
    font-size: 20px;
  }
  .el-divider--vertical {
    width: 2px;
    background: #cdcece;
    position: relative;
    top: -2px;
    height: 25px;
  }
  .djprogress {
    color: #9ea0a2;
    font-size: 19px;
    font-weight: bold;
  }
  .tabActive {
    color: #e61a23;
  }
}

.compon {
  height: calc(100% - 90px);
}
// .fade-enter,
// .fade-leave-to {
//   opacity: 0;
//   transform: translateX(100%);
// }

// .fade-enter-active,
// .fade-leave-active {
//   transition: all 0.5s ease;
// }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>