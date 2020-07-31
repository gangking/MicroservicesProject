<template>

  <fssc-header-icon @click.native.stop="slideToggle" :badge-hidden="true" :icon="toggleSlide? 'icon-hidelist' :'icon-showlist'">
    <div slot="content">{{ toggleSlide? $t('navbar.slideHide'):$t('navbar.slideShow') }}</div>
  </fssc-header-icon>

</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import setting from '@/setting.js';
import FsscHeaderIcon from '../header-menu-icon';
export default {
  components: {
    FsscHeaderIcon
  },
  computed: {
    ...mapState('ibps', {
      asideCollapse: state => state.menu.asideCollapse,
      toggleSlide: state => state.menu.toggleSlide
    })
  },

  methods: {
    ...mapMutations('ibps/menu', ['asideToggle']),
    // 切换菜单
    slideToggle() {
      if (this.toggleSlide) {
        document.querySelector('.toggle-aside-main').style.display = 'none';
        document.querySelector('#slideToggle').style.width = '0px';
      } else {
        document.querySelector('.toggle-aside-main').style.cssText = 'display:block';
        if (this.asideCollapse) {
          document.querySelector('#slideToggle').style.width = '65px';
        } else {
          document.querySelector('#slideToggle').style.width = '210px';
        }
      }
      this.asideToggle(this.toggleSlide);
    }
  }
};
</script>
<style lang="scss" scoped>
.imgtop {
  margin-top: 2px;
  width: 18px;
  height: 18px;
}
.icontop {
  display: inline-block;
  position: relative;
  // top: -1px;
  font-size: 19px;
  // margin-top: 3px;
}
.icontop1 {
  margin: 0 0 0 5px !important;
  width: 46px;
  height: 46px;
}
</style>
