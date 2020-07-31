<template>
  <div class="box">
    <Layout>
      <leftLayout :treeId="treeId" :primaryRange="primaryRange" :condtion="condtion" :condtionAttr="condtionAttr" slot="left" @isEditableFunc="isEditableFunc" @getGroupGoPage="getGroupGoPage" @getActiveBusObj="getActiveBusObj" @activePriority="activePriority" />
      <centerLayout slot="center" :isEditable='isEditable' :formDataOne="formDataOne" @getRuleTime="getRuleTime"/>
      <rightLayout slot="right" :objTreeData="objTreeData" @getClickObj="getClickObj" @getClickSlectLogic="getClickSlectLogic" />
    </Layout>
  </div>
</template>

<script>
import Layout from './layout';
import leftLayout from './assembly/leftLayout';
import centerLayout from './assembly/centerLayout';
import rightLayout from './assembly/rightLayout';
import { buildTree } from '@/api/platform/form/formDef';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
import { showLoading, hideLoading } from '@/utils/loading';
export default {
  inject: ['busSet'],
  props: {
    treeId: {
      type: String,
      default: ''
    },
    primaryRange:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  components: {
    Layout,
    leftLayout,
    centerLayout,
    rightLayout
  },
  data() {
    return {
      objTreeData: [], // 业务对象树
      isEditable: false, // 是否编辑条件
      condtion:'',
      condtionAttr:'',
      // 先决条件
      formDataOne: {
        tabs: [
          {
            label: '先决条件',
            name: 'Prerequisite'
          }
        ],
        formula: {
          variable: {}, // 用于编辑填入业务对象
          func: {}, // 用于编辑填入逻辑符号
          value: '' // 用于存储并展示规则
        },
        formtype: 'Prerequisite'
      },
      activePriorityValue: {} // 所选的优先级
    };
  },
  created() {},
  methods: {
    ...mapActions(['queryBusObjTree']),
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    // 获取选中的业务对象模块,并加载对象树
    getActiveBusObj(info) {
      // 查询业务对象树
      showLoading();
      buildTree({
        boCode: info.code,
        boDefId: info.id,
        mode: 'bo'
      })
        .then(response => {
          this.objTreeData = response.data;
          hideLoading();
        })
        .catch(e => {
          this.$message.error('业务对象树获取失败');
          hideLoading();
        });
    },
    // 是否编辑
    isEditableFunc() {
      this.isEditable = !this.isEditable;
    },
    // 获取点击的业务对象
    getClickObj(info) {
      this.setRuleValue(info, 'variable');
    },
    // 获取点击的逻辑符号
    getClickSlectLogic(info) {
      this.setRuleValue(info);
    },
    // 规则编辑赋值
    setRuleValue(info, flag) {
      if (this.isEditable) {
        if (JSON.stringify(this.activePriorityValue) != '{}') {
          var form = JSON.parse(JSON.stringify(this.formDataOne));
          if (flag == 'variable') {
            this.$set(this.formDataOne, 'variable', {});
            setTimeout(() => {
              this.$set(this.formDataOne, 'variable', info);
            }, 10);
          } else {
            this.$set(this.formDataOne, 'func', {});
            setTimeout(() => {
              this.$set(this.formDataOne, 'func', info);
            }, 10);
          }
        } else {
          this.$message.error('请选择要编辑的优先级。');
        }
      } else {
        this.$message.error('显示状态下无法编辑。');
      }
    },
    // 根据所选的优先级，来展示对应的规则信息
    activePriority(info) {
      console.log('所选的优先级',info)
      this.activePriorityValue = info;
      // 获取并设置规则内容
      this.$set(this.formDataOne, 'value', info.condtionAttr ? JSON.parse(info.condtionAttr) : '');
    },
    // 获取实时编辑的先决条件
    getRuleTime(info) {
      console.log('获取实时编辑的先决条件',info)
      this.condtionAttr = info.condtionAttr;
      this.condtion = info.condtion;
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: 50%;
  width: 100%;
  overflow: auto;
}
</style>