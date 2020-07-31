<template>
  <!-- <el-tooltip effect="dark" placement="bottom">
    <div slot="content">{{ $t('search.tip') }}<br>
      {{ $t('search.press') }}<span class="panel-search__key">{{ hotkey.open }}</span>
      {{ $t('search.panel') }}<br>
      {{ $t('search.press') }}<span class="panel-search__key">{{ hotkey.close }}</span>
      {{ $t('search.close') }}
    </div>
    <el-button class="ibps-mr btn-text can-hover icontop1" type="text" @click="handleClick">
      <ibps-icon name="search" class="icontop" />
    </el-button>
  </el-tooltip> -->
  <fssc-header-icon :badge-hidden="true" icon="ibps-icon-search" @click="handleClick">
    <div slot="content">{{ $t('search.tip') }}<br>
      {{ $t('search.press') }}<span class="panel-search__key">{{ hotkey.open }}</span>
      {{ $t('search.panel') }}<br>
      {{ $t('search.press') }}<span class="panel-search__key">{{ hotkey.close }}</span>
      {{ $t('search.close') }}
    </div>
  </fssc-header-icon>
</template>

<script>
import { mapState } from 'vuex';
import FsscHeaderIcon from '../header-menu-icon';
export default {
  components: {
    FsscHeaderIcon
  },
  computed: {
    ...mapState('ibps/search', ['hotkey'])
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/public.scss';
.panel-search__key {
  padding: 1px 5px;
  margin: 0px 2px;
  border-radius: 2px;
  background-color: $color-text-normal;
  color: $color-bg;
}
.icontop {
  position: relative;
  top: 1px;
  font-size: 16px;
}
.icontop1 {
  margin: 0 -4px !important;
  width: 46px;
  height: 46px;
}
</style>
