<template>
  <div class="main">
    <div class="list_title">{{message.title}}</div>
    <div class="list_number">
      <div class="list_left">
        <span>{{format(message.billNum)}}</span>
        <img v-if="show" src="@/assets/images/achievement/up.png" />
        <img v-else src="@/assets/images/achievement/down.png" />
      </div>
      <div class="list_right">
        <div class="info_sub">{{message.lastTitle}}</div>
        <div class="info_number">{{format(message.lastNum)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      show: true,
      message: {}
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    list: {
      handler(val) {
        this.message = val;
        if (val.billNum >= val.lastNum) {
          this.show = true;
        } else {
          this.show = false;
        }
        // console.log(this.message, "this.messagethis.messagethis.message");
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //千分位处理
    format(num) {
      return (num + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  .list_title {
    text-align: center;
    height: 25px;
    font-size: 18px;
    letter-spacing: 0px;
    color: #ffffff;
  }
  .list_number {
    margin-top: 5px;
    height: 60px;
    display: flex;
    align-items: center;
    .list_left {
      display: flex;
      align-items: flex-end;
      > span {
        height: 100%;
        font-family: "AgencyFB-Reg";
        font-size: 50px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #00ccff;
      }
      > img {
        margin-left: 3px;
        margin-bottom: 5px;
        width: 15px;
        height: 26px;
      }
    }
    .list_right {
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-left: 15px;
      .info_sub {
        height: 50%;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #00ccff;
        white-space: nowrap;
      }
      .info_number {
        height: 50%;
        font-family: " AgencyFB-Reg";
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 2px;
        color: #ffa200;
      }
    }
  }
}
</style>
