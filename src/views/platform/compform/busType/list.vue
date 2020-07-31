<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :data="orgTreeData"
        :options="orgTreeoptions"
        :contextmenus="orgTreeContextmenus"
        title="岗位管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
    </div>
    <ibps-crud
      ref="crud"
      :style="{ marginLeft: width+'px' }"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      
      :pagination="pagination"
      :loading="loading"
      :index-row="false"
      @row-click="handleRowClick"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
    >
      <!-- <div slot="versionCount" slot-scope="scope">
        默认：
        <span class="version" @click="handleVersion(scope.row.id)">版本({{ scope.row.version }})</span>
        <span class="version" style="margin-left:10px;" @click="handleVersionCount(scope.row.code)">更多版本({{ scope.row.versionCount }})</span>
      </div> -->
    </ibps-crud>
    <!-- 添加编辑明细 -->
    <!-- <edit
      :id="editId"
      :code="code"
      :visible="dialogFormVisible"
      :readonly="readonly"
      title="业务对象添加"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    /> -->
     <edit
      :id="editId"
      :code="code"
      :visible="dialogFormVisible"
      :readonly="readonly"
      title="业务对象添加"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 设置分类 -->
    <setting-type
      :visible="settingTypeFormVisible"
      title="设置流程分类"
      category-key="BO_TYPE"
      @save="saveSettingType"
      @close="visible => settingTypeFormVisible = visible"
    />
    <!-- 导入 -->
    <import-bo
      :id="editId"
      :visible="importFormVisible"
      @callback="search"
      @close="visible => importFormVisible = visible"
    />
    <!-- 更多版本 -->
    <more-versions
      :code="code"
      :visible="versionsFormVisible"
      @callback="search"
      @close="visible => versionsFormVisible = visible"
    />
    <!-- 复制 -->
    <copy
      :id="editId"
      :copy-data="copyData"
      :visible="copyFormVisible"
      @callback="search"
      @close="visible => copyFormVisible = visible"
    />
  </ibps-layout>
</template>
<script>
 //import { queryPageList, remove, syncBoTable, genBoTable, setCategory, exportFile } from '@/api/platform/bo/boDef'
import {getTreeData, queryPageList, remove, syncBoTable, genBoTable, setCategory, exportFile } from '@/api/platform/compform/type'
import { taskTypeOptions, createTabelOptions, statusOptions } from './constants'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'

import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import SettingType from '@/business/platform/cat/type/setting-type'
import Edit from './edit'
import Copy from './copy'
import importBo from './import'
import MoreVersions from './more-versions'

export default {
  components: {
    IbpsTypeTree,
    SettingType,
    MoreVersions,
    Edit,
    importBo,
    Copy
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      settingTypeFormVisible: false, // 弹窗
      dialogFormVisible: false,
      versionsFormVisible: false,
      importFormVisible: false,
      copyFormVisible: false,
      readonly: false,
      editId: '', // 编辑dialog需要使用
      code: '',
      copyData: {},
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      orgTreeData: [],
       // 组织树配置
      orgTreeoptions: {},
      orgTreeContextmenus: [
        { icon: 'add', label: '添加', value: 'add' },
        { icon: 'edit', label: '编辑', value: 'edit', rights: ['node'] },
        { icon: 'remove', label: '删除', value: 'remove', rights: ['node'] },
        { type: 'divided', rights: ['node'] },
        { icon: 'arrows-v', label: '移动节点', value: 'moveNode', rights: ['node'] },
        { type: 'divided' },
        { icon: 'sort', label: '节点排序', value: 'nodeSort' }
      ],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'save' },
          // { key: 'search' },
          // { key: 'add' }
          // { key: 'edit' },
          // { key: 'remove' },
          // {
          //   key: 'setCategory',
          //   label: '设置分类',
          //   icon: 'ibps-icon-cog'
          // },
          // {
          //   key: 'export',
          //   label: '导出',
          //   icon: 'ibps-icon-export'
          // },
          // {
          //   key: 'import',
          //   label: '导入',
          //   icon: 'ibps-icon-import'
          // }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: '业务类型名称' },
            { prop: 'Q^CODE_^SL', label: '业务类型编码' },
            {
              prop: 'Q^IS_CREATE_TABLE_^S',
              label: '表单',
              fieldType: 'select',
              options: createTabelOptions
            },
            {
              prop: 'Q^IS_CREATE_TABLE_^S',
              label: 'BO',
              fieldType: 'select',
              options: createTabelOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          // { prop: 'name', label: '名称', width: 150 },
          { prop: 'code', label: '编码', width: 150 },
          { prop: 'name', label: '服务目录名称列表', width: 150 },
          { prop: 'code', label: 'BO', width: 150 },
          { prop: 'status', label: '状态', width: 100, tags: statusOptions },
          // { prop: 'versionCount', label: '版本信息', fieldType: 'slot', slotName: 'versionCount' },
          // { prop: 'boType', label: '对象类型', width: 100, tags: taskTypeOptions },
          // { prop: 'isCreateTable', label: '生成表', tags: createTabelOptions, width: 80 }
        ],
        // 管理列  :row-handle="listConfig.rowHandle"  =23l
        rowHandle: {
          actions: [
            {
              key: 'genBoTable',
              label: '生成表',
              icon: 'ibps-icon-cog',
              hidden: (row, index) => {
                return !(row.boType === 'object' && row.isCreateTable === 'N')
              }
            },
            {
              key: 'syncBoTable',
              label: '同步表结构',
              icon: 'ibps-icon-exchange',
              hidden: (row, index) => {
                return row.boType !== 'out'
              }
            },
            {
              key: 'copy',
              label: '复制',
              icon: 'ibps-icon-copy',
              hidden: (row, index) => {
                return row.boType === 'out'
              }
            },
            { key: 'edit' },
            { key: 'remove' },
            { key: 'detail' }
          ]
        }
      },
      pagination: {},
      sorts: {}

    }
  },
  created() {
    this.loadData()
    this.loadTreeData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadData(id = '') {
      this.loading = true
      const response ={"state":200,"request":null,"message":"","cause":"","variables":{},"data":{"dataResult":[{"pk":"id","name":"成本中心","ip":null,"createBy":"1","createTime":"2019-08-19 06:18:15","updateBy":null,"updateTime":null,"tenantId":null,"dataStatus":null,"dbtype":null,"id":"613013866988699648","code":"COSTCENTER","desc":"","dataFormat":"json","version":1,"isMain":"Y","boType":"object","isCreateTable":"Y","status":"actived","state":"exist","dsAlias":"","typeId":"592689459300925440","options":"{\"struType\":\"list\",\"idKey\":\"id\",\"pIdKey\":\"id\",\"key\":\"id\"}","saveType":"SAVE","versionCount":1,"isComb":"N","tblName":null,"dsName":null,"parentId":null,"fk":null,"fromAttr":null,"relation":null,"path":null,"attrList":[],"commonAttrList":[],"fkRelAttribute":null,"subDefList":[],"boDefRelList":[],"data":null,"pkAttr":null,"fkAttr":null,"subMap":{}},{"pk":"id","name":"会计中心","ip":null,"createBy":"1","createTime":"2019-08-19 06:18:15","updateBy":null,"updateTime":null,"tenantId":null,"dataStatus":null,"dbtype":null,"id":"613013866988699648","code":"COSTCENTER","desc":"","dataFormat":"json","version":1,"isMain":"Y","boType":"object","isCreateTable":"Y","status":"actived","state":"exist","dsAlias":"","typeId":"592689459300925440","options":"{\"struType\":\"list\",\"idKey\":\"id\",\"pIdKey\":\"id\",\"key\":\"id\"}","saveType":"SAVE","versionCount":1,"isComb":"N","tblName":null,"dsName":null,"parentId":null,"fk":null,"fromAttr":null,"relation":null,"path":null,"attrList":[],"commonAttrList":[],"fkRelAttribute":null,"subDefList":[],"boDefRelList":[],"data":null,"pkAttr":null,"fkAttr":null,"subMap":{}}],"pageResult":{"limit":20,"page":1,"totalCount":7,"totalPages":1}}}
      // queryPageList(this.getFormatParams(id)).then(response => {
        ActionUtils.handleListData(this, response.data)
        console.log(this.listData)
        this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams(id = '') {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^TYPE_ID_^S'] = id
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    // 获取树的数据
    loadTreeData() {
      getTreeData().then(response => {
         const data = response.data
        // const data = [{"pk":"","name":"表数据1","ip":null,"createBy":null,"createTime":"2019-08-26 07:55:45","updateBy":null,"updateTime":null,"tenantId":null,"dataStatus":null,"dbtype":null,"id":"615575117837107200","partyType":null,"parentId":"0","path":"615575117837107200.","depth":null,"sn":null,"positionId":null,"levelID":"466946423468851200","type":"no","desc":"ceshi1","posAlias":"ceshi1","orgID":"","relRoles":null,"level":null,"levelName":null,"orgName":null,"isMainPost":"N","isPrincipal":"N","hasChild":false},{"pk":"","name":"钢铁侠","ip":null,"createBy":null,"createTime":"2019-08-26 07:55:11","updateBy":null,"updateTime":null,"tenantId":null,"dataStatus":null,"dbtype":null,"id":"615574976749109248","partyType":null,"parentId":"0","path":"615574976749109248.","depth":null,"sn":null,"positionId":null,"levelID":"466946423468851200","type":"no","desc":null,"posAlias":"gtx","orgID":"","relRoles":null,"level":null,"levelName":null,"orgName":null,"isMainPost":"N","isPrincipal":"N","hasChild":false}]
        
        data.unshift({
          id: 0,
          name: '岗位树',
          parentId: null
        })
        this.orgTreeData = data
        
      }).catch(() => {
      })
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
            this.levelId = data.levelID
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
      this.readonly = true
      this.positionId = data.id + ''
      this.show = 'detail'
    },
     handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
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
    search() {
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    },
    /**
     * 设置分类
     */
    handleSetCategory(editId) {
      this.editId = editId || ''
      this.settingTypeFormVisible = true
    },
    /**
     * 保存分类
     */
    saveSettingType(typeId) {
      setCategory({
        boDefIds: this.editId,
        typeId: typeId
      }).then(response => {
        ActionUtils.successMessage('保存成功')
        this.settingTypeFormVisible = false
        this.search()
      }).catch((err) => {
        console.info(err)
      })
    },
    /**
     * 添加
     */
    handleEdit(editId = '', readonly = false) {
      this.editId = editId || ''
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 更多版本
     */
    handleVersions(code = '') {
      this.code = code || ''
      this.versionsFormVisible = true
    },
    // 获取code
    handleRowClick(row, event, column) {
      this.code = row.code
    },
    /**
     * 点击表格
     */
    handleLinkClick(data, columns) {
      console.log(data.id)
    },
    /**
     * 复制
     */
    handleCopy(editId = '') {
      this.editId = editId || ''
      this.copyFormVisible = true
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
          break
        case 'edit': // 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            // TODO 功能
            this.handleEdit(id)
            this.code = data.code
          }).catch(() => { })
          break
        case 'remove': // 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'detail': // 明细
          ActionUtils.selectedRecord(selection).then((ids) => {
            this.handleEdit(ids, true)
          }).catch(() => { })
          break
        case 'setCategory': // 设置分类
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleSetCategory(id)
          }).catch(() => { })
          break
        case 'export': // 导出
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleExport(ids)
          }).catch(() => { })
          break
        case 'import': // 导入
        // TODO
          this.handleImport()
          break
        case 'copy': // 复制
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleCopy(id)
            this.copyData = data
          }).catch(() => { })
          break
        case 'genBoTable': // 生成表
          ActionUtils.selectedRecord(selection).then((id) => {
            this.$confirm('确定生成表吗？表名自动添加【T_】业务前缀。', '消息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleGenBoTable(id)
              this.$message.closeAll()
              this.$message({
                type: 'success',
                message: '生成表成功！'
              })
            }).catch(() => {})
          }).catch(() => { })
          break
        case 'syncBoTable': // 同步表结构
          ActionUtils.selectedRecord(selection).then((id) => {
            this.$confirm('是否同步表结构?', '消息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleSyncBoTable(id)
              this.$message.closeAll()
              this.$message({
                type: 'success',
                message: '同步外部数据表结构成功！'
              })
            }).catch(() => {})
          }).catch(() => {})
          break
        default:
          break
      }
    },
    handleExport(ids) {
      exportFile({ boDefIds: ids }).then((response) => {
        if (!response) {
          return
        }
        ActionUtils.exportFile(
          response.data,
          'boDef_' + fecha.formatDate('yyyyMMddHHmmss') + '.zip'
        )
      }).catch(() => {

      })
    },
    handleImport() {
      this.importFormVisible = true
    },
    handleRemove(id) {
      remove({
        boDefIds: id,
        rmType: 'all',
        clean: true
      }).then(response => {
        // TODO
        this.loadData()
      })
    },
    handleSyncBoTable(id) {
      syncBoTable({
        boDefId: id
      }).then(response => {
        this.loadData()
      })
    },
    handleGenBoTable(id) {
      genBoTable({
        boDefId: id
      }).then(response => {
        this.loadData()
      })
    },
    handleVersion(id) {
      this.handleEdit(id, true)
    },
    handleVersionCount(code) {
      this.handleVersions(code)
    },
    handleNodeClick(id) {
      this.loadData(id)
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    }
  }
}
</script>
<style lang="scss">
.version{
  cursor: pointer;
  color: #337ab7;
}
</style>
