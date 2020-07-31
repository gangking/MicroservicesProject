<script>
import formTabContainer from './form-tab-container';
import { createNamespacedHelpers } from 'vuex';
import util from '@/utils/util';
const { mapActions } = createNamespacedHelpers('ibps/compositeSingle');
export default {
  extends: formTabContainer,
  methods: {
    ...mapActions(['getBtnsAndTags']),

    //等待后续有需求在扩展
    /* currentVm() {
      let _vm = this.getTabRefPane(this.currentTag), self;
      return new Proxy(_vm, {
        get: function(target, propKey, receiver) {
          console.log(`getting ${propKey}!`);
          if (Reflect.has(self, propKey)) {

          } else {

          }
          return Reflect.get(target, propKey, receiver);
        },
        set: function(target, propKey, value, receiver) {
          console.log(`setting ${propKey}!`);
          return Reflect.set(target, propKey, value, receiver);
        }
      });
      return this.getTabRefPane(this.currentTag);
    }, */
    initCurrentData({ tabs, funcBtns, rightsBtns }) {
      let tabItems = tabs.map(item => {
        return {
          ...item,
          tabItems: {
            closable: false,
            key: item.id,
            label: item.describe,
            name: item.id,
            componentType: 'payableDynamicForm'
          }
        };
      });

      this.addTag(tabItems);
      console.log('this.tags', this.tags, tabItems);
      this.funcBtns = funcBtns;
      this.processBtns = rightsBtns;
    }
  }
};
</script>

