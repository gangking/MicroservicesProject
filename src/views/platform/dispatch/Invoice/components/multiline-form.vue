<script>
import formTabContainer from './form-tab-container';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('ibps/compositeMultiline');
export default {
  extends: formTabContainer,
  methods: {
    ...mapActions(['getBtnsAndTags']),
    currentVm() {
      const _vm = this.getTabRefPane(this.currentTag);
      console.log('fjslfjfl.....', _vm, this.currentTag);
      if (_vm && _vm['currentVm']) {
        // console.log('替换对象....', _vm.currentVm());
        return _vm.currentVm();
      }
      return _vm;
    },
    initCurrentData({ tabs, funcBtns, rightsBtns }) {
      let tabItems = {
        tabItems: {
          closable: false,
          key: 'payableDynamicForm-uuid',
          label: this.stepVal['stepDescribe'],
          name: 'payableDynamicForm-uuid',
          componentType: 'multilineDynamicForm',
          CloseFullScreen: true
        }
      };
      this.addTag(tabItems);

      this.funcBtns = funcBtns;
      this.processBtns = rightsBtns;
      this.payable.$refs['formpoc'].hiddenFold();
    }
  }
};
</script>

