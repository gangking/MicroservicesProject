<template>
  <div class="display-form-container">
    <div class="form-header">
      <slot name="header" />
    </div>
    <div class="form-content">

      <slot name="content" />

    </div>
  </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" >
@mixin full-box {
  height: 100%;
  width: 100%;
}

.display-form-container {
  @include full-box;
  background-color: white;
  display: flex;
  flex-direction: column;
  > .form-header {
    flex-basis: 66px;
    padding: 0;
    border-bottom: 1px #d4d4de solid;
  }
  > .form-content {
    color: #333;
    text-align: center;
    flex-grow: 1;
    padding: 0;
    position: relative;
    height: 10px;
  }
}
</style>
