<template>
  <div class="financial" ref="main">
    <div class="redblock_title" ref="title">
      <span class="redblock"></span>
      <label>我的金额</label>
      <!-- <a href="#"><img class="bigger" src="@/assets/images/desktop/amplification.png"></a> -->
    </div>
    <div class="jetitle" ref="tabs">
      <a
        href="#"
        class="djprogress"
        :style="isActive=='borrowFinacial'?'color:#E61A23;':''"
        @click="change(borrowFinacial,'borrowFinacial')"
      >借支金额</a>
      <el-divider direction="vertical" />
      <a
        href="#"
        class="djprogress"
        :style="isActive=='persionalFinacial'?'color:#E61A23;':''"
        @click="change(persionalFinacial,'persionalFinacial')"
      >个人帐金额</a>
    </div>

    <div class="compon">
      <component :is="currentView" :height="height" :componInfo="componInfo"></component>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import borrowFinacial from "./borrowFinacial.vue";
import persionalFinacial from "./persionalFinacial.vue";

export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      borrowFinacial,
      persionalFinacial,
      currentView: "borrowFinacial",
      isActive: "borrowFinacial",
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
    window.addEventListener("resize", this.chartResize);
  },
  components: {
    borrowFinacial,
    persionalFinacial
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
      background-color: #ccc;
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

.jetitle {
  text-align: center;
  padding: 20px 0 25px 0;
  font-size: 16px;
  .el-divider--vertical {
    width: 2px;
    background: #cdcece;
    position: relative;
    top: -2px;
  }
  .djprogress {
    color: #9ea0a2;
  }
}
.compon {
  height: calc(100% - 103px);
}
</style>