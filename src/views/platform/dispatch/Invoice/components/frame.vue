<template>
  <ibps-container-frame v-if="frameUrl" :src="frameUrl"></ibps-container-frame>
</template>

<script>
export default {
  name: 'fssc-container-form',
  components: {},
  props: {
    tagVal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      frameUrl: false
    };
  },

  watch: {},
  computed: {},
  methods: {
    beforeLeave() {
      this.frameUrl = false;
    },
    onActivated() {
      console.log('fsfljdfld....', this.tagVal.tagVal);
      this.$nextTick(() => {
        this.frameUrl = this.tagVal.tagVal;
      });
    },
    refresh() {
      this.onActivated();
    }
  },
  created() {},
  mounted() {
    this.refresh();
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>