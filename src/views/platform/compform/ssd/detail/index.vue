<template>
  <div class="main-container">
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick"
    >
      <!-- <el-tab-pane label="组织明细" name="detail">
        <detail :id="id" readonly />
      </el-tab-pane> -->
      <!-- <el-tab-pane label="基本参数" name="orgCharge">
        <org-charge :id="id" :height="height" :is-tree-all="isTreeAll"  :visible="activeName==='employee'" />
      </el-tab-pane> -->
      <el-tab-pane label="基本参数" name="orgCharge">
        <org-charge :id="id" :height="height" :visible="activeName==='orgCharge'" />
      </el-tab-pane>
      <!-- <el-tab-pane label="按钮信息" name="persion">
        <org-employee :id="id" :rights-arr="rightsArr" :is-tree-all="isTreeAll" :height="height" :visible="activeName==='persion'" />
      </el-tab-pane> -->
       <el-tab-pane label="抬头功能" name="OrgPosition">
        <org-position :id="id" :rights-arr="rightsArr" :height="height" :visible="activeName==='persion'" />
      </el-tab-pane>
      <el-tab-pane label="表头信息" name="employee3">
        <org-employee :id="id" :rights-arr="rightsArr" :is-tree-all="isTreeAll" :height="height" :visible="activeName==='employee'" />
      </el-tab-pane>
     
   
    </el-tabs>
  </div>
</template>
<script>
// 组件
import Detail from '../edit'
import OrgCharge from './base-param'
import OrgPosition from './persion'
// import OrgPosition from './org-position/index'
import OrgEmployee from './org-employee'
// import OrgRole from './org-role'
// import OrgAuth from '../../auth/list'
// import ExtAttr from '../../components/attr/ext-attr'
export default {
  components: {
    Detail,
    OrgCharge,
    OrgPosition,
    // OrgPosition,
    OrgEmployee,
    // OrgRole,
    // OrgAuth,
    // ExtAttr
  },
  props: {
    id: {
      type: [String, Number]
    },
    orgName: String,
    isAuth: {
      type: Boolean,
      default: false
    },
    rightsArr: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isTreeAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: 'detail',
      height: 500
    }
  },
  watch: {
    id() {
      this.activeName = 'detail'
    }
  },
  mounted() {
    this.height = this.$parent.$el.offsetHeight - 75
  },
  methods: {
    handleTabClick(tab) {
    }
  }
}
</script>
