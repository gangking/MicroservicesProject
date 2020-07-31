<template>
  <div>
    <div style="color:red;">值来源</div>
  </div>
</template>

<script>
export default {
  props: {
    template: Object
  },
  data() {
    return {
      width: document.body.clientWidth - 570,
      data: [],
      pkKey: 'id'

    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
      },
      immediate: true
    }
  }
}
</script>
