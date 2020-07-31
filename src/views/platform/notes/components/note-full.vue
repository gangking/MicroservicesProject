<template>
  <div class="note-full"></div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="scss">
.note-full {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: red;
  z-index: 999;
}
</style>
