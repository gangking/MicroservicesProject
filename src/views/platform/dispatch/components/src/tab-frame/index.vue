<template>
  <ibps-container-frame v-if="frameUrl" :src="frameUrl"></ibps-container-frame>
</template>

<script>
import ComponentProps from '../../../Invoice/mixins/components-props';
export default {
  mixins: [ComponentProps],
  data() {
    return {
      frameUrl: false
    };
  },
  methods: {
    beforeLeave() {
      console.log('离开打开页面组件');
      this.frameUrl = false;
    },

    onActivated() {
      this.$nextTick(() => {
        this.frameUrl = this.tagVal;
      });
    },
    refresh() {
      this.onActivated();
    }
  },
  mounted() {
    this.onActivated();
  }
};
</script>
