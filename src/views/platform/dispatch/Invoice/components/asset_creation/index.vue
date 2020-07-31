<template>

  <data-template-render-preview class="asset-creation" ref="preview" v-if="isload" :is-dialog="false" :data="dataTemplate" :invoiceInfo="headerInfo" data-template-key="ASSET_CREATE" @close="onClose" />

</template>
<script>
import DataTemplateRenderPreview from '@/business/platform/data/templaterender/preview/index.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters: mapGettersBase } = createNamespacedHelpers(
  'ibps/compositeBase'
);
export default {
  data() {
    return {
      dataTemplate: {},
      isload: false
    };
  },
  computed: {
    ...mapState(['headerInfo'])
  },
  components: {
    DataTemplateRenderPreview
  },
  created() {
    this.isload = true;
  },
  mounted() {
    this.$refs['preview'].getFormData();
  },
  methods: {
    onClose() {},
    onActivated() {
      console.log('资产新建....');
    }
  }
};
</script>
<style lang="scss">
.asset-creation {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>