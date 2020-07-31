<template>
  <div class="box">
    <component :primaryRange="primaryRange" :treeId="treeId" :treeClick="treeClick" :groupId="groupId" :manualAuto="manualAuto" :is="isShowPage" @updateTree="updateTree" @getGroupGoPage="getGroupGoPage"></component>
  </div>
</template>

<script>
import orgaManage from '../orgaManage';
import sharedPool from '../sharedPool';
import businessGroupSet from '../businessGroupSet';
import strategy from '../businessGroupSet/strategy';
import ruleSetAuto from '../businessGroupSet/strategy/automatic/ruleSet';
import ruleSetManual from '../businessGroupSet/strategy/manual/ruleSet';
import taskAllocation from '../businessGroupSet/task_allocation/oneLevelSetup';
import taskAllocationTwo from '../businessGroupSet/task_allocation/twoLevelSetup';
import teamManage from '../businessGroupSet/team_manage';
import teamManageAssignment from '../businessGroupSet/team_manage/assignment';
export default {
  components: {
    orgaManage,
    sharedPool,
    businessGroupSet,
    strategy,
    ruleSetAuto,
    ruleSetManual,
    taskAllocation,
    taskAllocationTwo,
    teamManage,
    teamManageAssignment
  },
  props: {
    pageType: {
      type: String,
      default: ''
    },
    manualAuto: {
      type: String,
      default: 'Automatic'
    },
    treeId: {
      type: String,
      default: ''
    },
    treeClick:{
      type:Boolean,
      default:false
    },
    groupId: {
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
  watch: {
    pageType: {
      handler(val) {
        console.log('切换页面', val);
        switch (val) {
          case 'organization':
            this.isShowPage = 'orgaManage';
            break;
          case 'sharedPool':
            this.isShowPage = 'sharedPool';
            break;
          case 'businessGroup':
            this.isShowPage = 'businessGroupSet';
            break;
          case 'teamManage':
            this.isShowPage = 'teamManage';
            break;
          case 'teamManageAssignment':
            this.isShowPage = 'teamManageAssignment';
            break;
          case 'taskAllocation':
            this.isShowPage = 'taskAllocation';
            break;
          case 'taskAllocationTwo':
            this.isShowPage = 'taskAllocationTwo';
            break;
          case 'strategy':
            this.isShowPage = 'strategy';
            break;
          case 'ruleSetAuto':
            this.isShowPage = 'ruleSetAuto';
            break;
          case 'ruleSetManual':
            this.isShowPage = 'ruleSetManual';
            break;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      isShowPage: 'orgaManage'
    };
  },
  methods: {
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    updateTree(){
      this.$emit('updateTree')
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: calc(100%);
  // height: calc(100% - 50px);
  width: 100%;
  overflow: auto;
}
</style>