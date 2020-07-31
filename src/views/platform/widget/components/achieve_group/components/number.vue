<template>
  <div class="main">
    <ul class="number_ul">
      <li class="number_li" v-for="(item,index) in list" :key="index" :style="bgImg">{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    number: {
      type: Number | String,
      default: ""
    }
  },
  data() {
    return {
      bgImg: {
        backgroundImage:
          "url(" +
          require("@/assets/images/achievement/group_number.png") +
          ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      list: []
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    number: {
      handler(value) {
        this.list = (value + "").split("");
      },
      immediate: true
    }
  },
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.main {
  .number_ul {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    .number_li {
      text-indent: 4px;
      width: 48px;
      text-align: center;
      font-family: Impact;
      font-size: 38px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 65px;
      letter-spacing: 5px;
      color: #00eaff;
      margin-bottom: 3px;
    }
  }
}
</style>
