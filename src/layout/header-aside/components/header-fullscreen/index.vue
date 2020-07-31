<template>
  <el-tooltip
    :content="active ? $t('navbar.exitFullscreen'): $t('navbar.fullscreen')"
    effect="dark"
    placement="bottom"
    class="icontop1"
  >
    <el-button class="ibps-mr btn-text can-hover" type="text" @click="toggle">
      <ibps-icon v-if="active" name="compress" size="comp" />
      <ibps-icon v-else name="arrows-alt" class="arrow" />
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('ibps/fullscreen', [
      'active'
    ])
  },
  methods: {
    ...mapActions('ibps/fullscreen', [
      'toggle'
    ])
  }
}
</script>

<style lang="scss" scoped>
.comp{
  font-size: 18px !important;
}
.arrow{
  font-size: 18px;
  // margin-top: 2px;
}
.icontop1 {
  margin: 0 5px !important;
  width: 46px;
  height: 46px;
}
</style>