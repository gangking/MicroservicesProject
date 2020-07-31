<template>
  <div class="sharedOperation">
    <div class="titleBox">
      <div class="mianbao">
        <el-breadcrumb>
          <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!-- 基础设置 (包含组员管理)-->
    <Layout v-if="basicSetting == '主页面'">
      <memberTree slot="treeBox" @handleNodeClick="handleNodeClick" :updateTreeFlag="updateTreeFlag" />
      <contentLayout slot="content" :pageType="pageType" @updateTree="updateTree" @getGroupGoPage="getGroupGoPage" :groupId="groupId" :treeId="treeId" :treeClick="treeClick" />
    </Layout>
    <!-- 任务分配 -->
    <Layout v-else-if="basicSetting == '任务分配'">
      <contentLayout slot="content" :primaryRange="primaryRange" :levelVal="levelVal" :treeId="treeId" :pageType="pageType" @getGroupGoPage="getGroupGoPage" />
    </Layout>
    <!-- 派单策略 -->
    <Layout v-else-if="basicSetting == '派单策略'">
      <btnBoxComponent slot="treeBox" @btnClickType="btnClickType" />
      <contentLayout :treeId="treeId" :manualAuto="manualAuto" slot="content" :pageType="pageType" @getGroupGoPage="getGroupGoPage" />
    </Layout>
  </div>
</template>

<script>
import Layout from '../components/layout.vue';
import contentLayout from './contentLayout';
import memberTree from '../components/member_tree';
import btnBoxComponent from '../components/btnBox';
export default {
  components: {
    memberTree,
    Layout,
    contentLayout,
    btnBoxComponent
  },
  provide() {
    return {
      busSet: this
    };
  },
  data() {
    return {
      pageType: 'organization', // 要展示的页面类型 organization，sharedPool，businessGroup
      basicSetting: '主页面', // 组员管理，任务分配，派单策略
      breadcrumb: [' 共享运营平台', '组织管理'],
      manualAuto: 'Automatic',
      treeId: '', // 所选组织树ID
      groupId: '',
      parentId: '',
      rangeId: '',
      levelVal: '',
      ruleId: '', // 手动规则Id
      autoRuleId: '', // 自动规则ID
      updateTreeFlag: false,
      treeClick: false,
      shoolId: '', // 共享池ID
      primaryRange: {} // 一级范围信息
    };
  },
  methods: {
    // 业务组跳转页面使用
    getGroupGoPage(info) {
      // 获取业务组跳转页面数据
      console.log('获取业务组跳转页面数据', info, this.shoolId);
      switch (info.pageType) {
        case '主页':
          this.basicSetting = '主页面';
          this.breadcrumb[1] = '组织管理';
          this.pageType = 'organization';
          break;
        case '业务组管理':
          this.basicSetting = '主页面';
          this.breadcrumb[1] = '业务组管理';
          this.pageType = 'businessGroup';
          this.treeId = info.data.id;
          this.groupId = info.data.groupId;
          break;
        case '返回业务组管理':
          this.basicSetting = '主页面';
          this.breadcrumb[1] = '业务组管理';
          this.pageType = 'businessGroup';
          this.treeId = this.shoolId;
          break;
        case '组员管理':
          if (info.data.level == 1) {
            this.basicSetting = '主页面';
            this.breadcrumb[1] = '业务组成员管理'; // 一级组员管理
            this.pageType = 'teamManage';
            this.levelVal = info.data.levelVal;
            this.treeId = info.data.id;
            this.groupId = info.data.orgGroupId;
            this.rangeId = info.data.businessRangeId;
          } else {
            this.basicSetting = '主页面';
            this.breadcrumb[1] = '业务组成员分派'; // 二三级组员分派
            this.pageType = 'teamManageAssignment';
            this.treeId = info.data.id;
            this.groupId = info.data.groupId;
            this.parentId = info.data.parentId;
          }

          break;
        case '任务分配':
          this.basicSetting = '任务分配';
          this.breadcrumb[1] = '派单范围列表';
          this.pageType = 'taskAllocation';
          this.levelVal = info.data.levelVal;
          this.treeId = info.data.id;
          this.groupId = info.data.orgGroupId;
          this.rangeId = info.data.businessRangeId;
          break;
        case '二级设置':
          this.basicSetting = '任务分配';
          this.breadcrumb[1] = '派单范围二级设置';
          this.pageType = 'taskAllocationTwo';
          this.treeId = info.data.id;
          this.primaryRange = info.data;
          this.groupId = info.data.orgGroupId;
          break;
        case '派单策略':
          this.basicSetting = '派单策略';
          this.levelVal = info.data.levelVal;
          this.breadcrumb[1] = '派单规则列表-自动规则列表';
          this.pageType = 'strategy';
          this.manualAuto = 'Automatic';
          this.treeId = info.data.id;
          this.autoRuleId = info.data.autoRuleId;
          this.ruleId = info.data.ruleId;
          break;
        case '派单策略自动规则设置':
          this.basicSetting = '派单策略';
          this.breadcrumb[1] = '派单规则列表-自动规则设置';
          this.pageType = 'ruleSetAuto';
          this.treeId = info.data.id;
          this.autoRuleId = info.data.autoRuleId;
          this.ruleId = info.data.ruleId;
          break;
        case '派单策略手动规则设置':
          this.basicSetting = '派单策略';
          this.breadcrumb[1] = '派单规则列表-手动动规则设置';
          this.pageType = 'ruleSetManual';
          this.treeId = info.data.id;
          this.autoRuleId = info.data.autoRuleId;
          this.ruleId = info.data.ruleId;
          break;
      }
    },
    handleNodeClick(info) {
      console.log('基础设置选中树节点', info);
      this.basicSetting = '主页面';
      this.treeClick = this.treeClick ? false : true;
      this.shoolId = '';
      switch (info.data.type) {
        case 'organization':
          this.breadcrumb[1] = '组织管理';
          this.pageType = 'organization';
          this.treeId = '';
          this.groupId = '';
          break;
        case 'O':
          this.breadcrumb[1] = '共享池管理';
          this.pageType = 'sharedPool';
          this.treeId = info.data.id;
          this.groupId = info.data.id;
          break;
        case 'P':
          this.breadcrumb[1] = '业务组管理';
          this.pageType = 'businessGroup';
          this.shoolId = info.data.id;
          this.treeId = info.data.id;
          this.groupId = info.data.groupId;
          break;
        case 'G':
          this.breadcrumb[1] = '业务组成员管理'; // 一级组员管理
          this.shoolId = info.data.parentId;
          this.pageType = 'teamManage';
          this.treeId = info.data.id;
          this.groupId = info.data.groupId;
          break;
        case 'NG':
          this.breadcrumb[1] = '业务组成员分派'; // 二三级组员分派
          this.pageType = 'teamManageAssignment';
          this.treeId = info.data.id;
          this.groupId = info.data.groupId;
          this.parentId = info.data.parentId;
          break;
      }
    },
    // 选中的手动还是自动
    btnClickType(type) {
      console.log('选中的手动还是自动', type);
      this.manualAuto = type;
      this.breadcrumb[1] =
        type == 'Automatic' ? '派单规则列表-自动规则列表' : '派单规则列表-手动规则列表';
      this.pageType = 'strategy';
    },
    // 刷新树
    updateTree() {
      this.updateTreeFlag = !this.updateTreeFlag;
    }
  }
};
</script>

<style lang="scss" scoped>
.sharedOperation {
  width: 100%;
  height: 100%;
  .titleBox {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: white;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;
    .mianbao {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      text-align: left;
      line-height: 56px;
      padding: 0 10px;
      box-sizing: border-box;
      /deep/ .el-breadcrumb {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>