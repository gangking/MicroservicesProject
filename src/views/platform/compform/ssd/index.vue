<template>
  <div class="main-container">
    <div class="step-bgc">
      <el-steps :active="active" finish-status="success">
        <el-step title="参数"></el-step>
        <el-step title="业务"></el-step>
        <el-step title="发布"></el-step>
      </el-steps>
    </div>
    
    <ibps-layout ref="layout">
      <div slot="west">
        <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :loading="loading"
        :data="orgTreeData"
        :contextmenus="orgTreeContextmenus"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
      <!-- title="共享目录配置" -->
      <ibps-container
        :margin-left="width+'px'"
        class="page"
      >
      <detail
          v-if="show==='detail'"
          :id="orgId"
          :org-name="orgName"
          :rights-arr="rightsArr"
          :is-tree-all="false"
          :is-edit="true"
        />
        <edit
          v-else-if="show==='edit'"
          :id="orgId"
          :parent-id="parentId"
          @callback="search"
          @success="successCallback"
        />
        <edit-position
          v-else-if="show==='addPosition'"
          :org-id="orgId"
          @callback="successCallback"
        />

        <el-alert
          v-else
          :closable="false"
          title="尚未指定一个组织"
          type="warning"
          show-icon
          style="height:50px;"
        />
      </ibps-container>
      <!--设置管理员-->
      <!-- <auth-edit
        :visible="authEditVisible"
        :org-id="orgId"
        :org-name="orgName"
        @close="visible => authEditVisible = false"
      /> -->
      <!--移动节点-->
      <!-- <move-node
        :id="orgId"
        :visible="moveNodeVisible"
        :data="orgTreeData"
        @callback="search"
        @close="visible => moveNodeVisible = visible"
      /> -->
      <!--节点排序-->
      <!-- <node-sort
        :data="sortData"
        :visible="nodeSortVisible"
        title="组织排序"
        @close="visible => nodeSortVisible = visible"
        @callback="search"
      /> -->
      </div>
    </ibps-layout>
  </div>
</template>

<script>
import { findTreeData, remove } from '@/api/platform/org/org'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

import Edit from './edit'
import Detail from './detail'

export default {
  components: {
     Edit,
     Detail,
  },
  mixins: [FixHeight],
  data() {
    return {
       show: '',
       active: 0, // 进度条状态
       width: 230,
       height: document.clientHeight,
       loading: false,
       orgTreeData: [],
       orgId: '',
       orgName: '',
       // 设置分级管理员
      authEditVisible: false,
      // 移动节点
      moveNodeVisible: false,
      // 节点排序
      sortData: [],
      nodeSortVisible: false,
      loading: false,
      rightsArr: ['join', 'delete'],
       orgTreeContextmenus: [
        { icon: 'add', label: '添加', value: 'add' },
        { icon: 'edit', label: '编辑', value: 'edit', rights: ['node'] },
        { icon: 'remove', label: '删除', value: 'remove', rights: ['node'] },
        { type: 'divided', rights: ['node'] },
        { icon: 'arrows-v', label: '移动节点', value: 'moveNode', rights: ['node'] },
        { type: 'divided', rights: ['node'] },
        { icon: 'cog', label: '设置分级管理员', value: 'authEdit', rights: ['node'] },
        { icon: 'add', label: '新增岗位', value: 'addPosition', rights: ['node'] },
        { type: 'divided' },
        { icon: 'sort', label: '节点排序', value: 'nodeSort' }
      ],
    }
  },
   mounted() {
    this.loadTreeData()
  },
  methods: {
    // 加载数据
   loadTreeData() {
      this.loading = true
      findTreeData({
        type: 1
      }).then(response => {
        this.loading = false
        this.orgTreeData = response.data
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      return ActionUtils.formatParams(
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
        this.pagination,
        this.sorts)
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        const id = data.id
        switch (command) {
        // 组织负责人
          case 'add':// 添加
            this.handleEdit('', id)
            break
          case 'edit':// 编辑
            this.handleEdit(id)
            break
          case 'remove':// 删除
            ActionUtils.removeRecord(id).then((ids) => {
              this.handleRemove(ids)
            }).catch(() => { })
            break
          case 'moveNode':// 移动节点
            this.handleMoveNode(id)
            break
          case 'authEdit':// 设置分级管理员
            this.handleAuthEdit(id, data.name)
            break
          case 'addPosition':// 新增岗位
            this.handleAddPosition(data)
            break
          case 'nodeSort':// 排序
            this.handleNodeSort(data)
            break
          default:
            break
        }
      }
    },
    // 树点击
    handleNodeClick(data) {
      if (data.id === 0 || data.id === '0') {
        this.show = 'empty'
        return
      }
      this.orgId = data.id
      this.orgName = data.name
      this.show = 'detail'
      // debugger
    },
    // 收缩方法
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
      debugger
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    },
    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination)
      ActionUtils.setSorts(this.sorts)
      this.loadData()
    },
    // 返回右明细模块未显示
    successCallback(rtn) {
      if (rtn) {
        this.orgId = ''
        this.show = 'no'
      }
    },
     // 添加 编辑
    handleEdit(id = '', parentId) {
      this.show = 'edit'
      this.orgId = id
      this.parentId = parentId
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadData()
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加等级'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑等级'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '等级明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ levelIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.container-component{
  margin-top:80px;
}
.step-bgc{
  background:#fff;
  padding:10px;
}
</style>