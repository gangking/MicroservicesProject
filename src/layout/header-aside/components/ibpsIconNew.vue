<template>
  <i :class="'icon-'+name" :style="styles" @click="handleClick"></i>
  <!-- <i :class="'icon-'+name" :style="styles" @click="handleClick">{{title}}</i> -->

</template>

<script>
const fontFamily = 'ibps-icon';
export default {
  name: 'ibps-icon-new',
  props: {
    name: {
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: ''
    },
    size: [Number, String],
    color: String,
    fontFamily: {
      type: String,
      default: fontFamily
    },
    custom: {
      type: String,
      default: ''
    }
  },
  watch: {
    info: {
      handler(val) {
        // console.log('选中信息xitong', val);
      },
      immediate: true
    }
  },
  created(){

  },
  computed: {
    classes() {
      return [
        `${fontFamily}`,
        {
          [`${this.fontFamily}-${this.name}`]: this.name !== '',
          [`${this.custom}`]: this.custom !== ''
        }
      ];
    },
    styles() {
      const style = {};
      if (this.size) {
        style['font-size'] = `${this.size}px`;
      }
      if (this.color) {
        style.color = this.color;
      }
      return style;
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    }
  }
};
</script>
<style lang="scss" scoped>
.el-button [class*='ibps-icon-'] + span {
  margin-left: 5px;
}
</style>

