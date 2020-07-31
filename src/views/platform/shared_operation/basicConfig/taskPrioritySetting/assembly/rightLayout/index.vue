<template>
  <!-- 业务对象及布尔逻辑符号 -->
  <div class="objLogic">
    <div class="objBox">
      <businessObject @getObj="getObj" :objTreeData="objTreeData">
        <titleStyle slot="title" titleName='业务对象' />
      </businessObject>
    </div>
    <div>
      <businessLogic @getSlectLogic="getSlectLogic">
        <titleStyle slot="title" titleName='布尔逻辑符号' />
        <titleStyle slot="title2" titleName='常量' />
      </businessLogic>
    </div>
  </div>
</template>

<script>
import businessObject from './business-object';
import businessLogic from './bool-logic';
import titleStyle from './title-style';
export default {
  components: {
    businessObject,
    businessLogic,
    titleStyle
  },
  props: {
    objTreeData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    objTreeData: {
      handler(val) {
        console.log('业务独享树变化', val);
      },
      immediate: true
    }
  },
  data() {
    return {
      treeData: []
    };
  },
  methods: {
    // 获取点击的业务对象
    getObj(info) {
      console.log('获取点击的业务对象', info);
      this.$emit('getClickObj',info)
    },
    // 获取点击的逻辑符号
    getSlectLogic(info) {
      console.log('获取选中逻辑符号', info);
      this.$emit('getClickSlectLogic',info)
    }
  }
};
</script>

<style lang="scss" scoped>
.objLogic {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  .objBox {
    height: 212px;
    overflow: hidden;
  }
  > div {
    flex: 1;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>