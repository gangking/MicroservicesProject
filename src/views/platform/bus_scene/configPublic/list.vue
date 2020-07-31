<template>
  <div class="main-container">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :index-row="false"
      :search-form="listConfig.searchForm"
      :row-handle="listConfig.rowHandle"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :loading="loading"
      @action-event="handleAction"
      @column-link-click="handleLinkClick"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <add-menu
      :edit-id="dataTemplate.id"
      :visible="addMenuDialogVisible"
      :data="menuData"
      @close="visible => addMenuDialogVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, removeScene, saveScene, queryFormByBoList, queryYWLCByIdList, queryYWCJList, queryBOList, releaseOK } from '@/api/platform/buscene'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { statusOptions } from './constants' // 静态变量
import edit from './edit'
import AddMenu from '@/business/platform/auth/resources/add-menu'
import DataTemlate from './templates'

export default {
    components: Object.assign({
        edit,
        AddMenu
    }, DataTemlate),

    mixins: [FixHeight],
    data() {
        return {
            dialogFormVisible: false, // 弹窗
            editId: '', // 编辑dialog需要使用
            readonly: true, // 是否只读
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            title: '业务场景',
            loading: true,
            height: document.clientHeight,
            addMenuDialogVisible: false,
            listData: [],
            pagination: {},
            pageData: '',
            menuData: {},
            sorts: {},
            listConfig: {
                toolbars: [
                    { key: 'search' }, { key: 'add' },
                    { key: 'remove' }, { key: 'save', label: '发布' }
                ],
                searchForm: {
                    forms: [
                        { prop: 'Q^BO_KEY_^SL', label: '业务对象' },
                        { prop: 'Q^BS_CODE_^SL', label: '业务场景' },
                        { prop: 'Q^BPM_KEY_^SL', label: '业务流程' }

                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'boKey', label: '业务对象', width: 70 },
                    { prop: 'boDescribe', label: '业务对象描述', width: 95 },
                    { prop: 'bsCode', label: '业务场景', width: 70 },
                    { prop: 'bsDescribe', label: '业务场景描述', width: 95 },
                    { prop: 'bpmKey', label: '业务流程', width: 82 },
                    { prop: 'bpmDescribe', label: '业务流程描述', width: 95 },
                    // { prop: 'formKey', label: '业务流程技术表单', width: 120 },
                    { prop: 'key', label: '业务场景应用ID' },
                    { prop: 'describe', label: '业务场景应用描述' },
                    { prop: 'appUrl', label: 'Url' },
                    { prop: 'status', label: '应用发布状态', tags: statusOptions }
                ],
                rowHandle: {
                    actions: [{
                        key: 'detail', label: '发布'
                    }]
                }
            }
        }
    },
    computed: {

        dataTemplate() {
            return this.data ? this.data : {}
        }

    },
    created() {
        this.loadData()
    },
    methods: {
    // 加载数据
        loadData() {
            this.loading = true
            queryPageList(this.getSearcFormData()).then(res => {
                ActionUtils.handleListData(this, res.data)

                this.loading = false
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
                    this.title = '添加业务场景发布'
                    break
                case 'save':// 发布
                    ActionUtils.selectedRecord(selection).then((id) => {
                        // console.log('sele000', selection)
                        this.handleFabu(id, true)
                    }).catch(() => { })
                    break

                case 'remove'://
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => { })
                    this.title = '删除'
                    break
                case 'detail':
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleFabu(id, true)
                    }).catch(() => { })
                    this.title = '发布'
                    break
                default:
                    break
            }
        },
        /**
         * 删除
         */
        handleRemove(ids, readonly = false) {
            this.loading = true
            const params = {
                id: ids
            }
            removeScene(params).then(res => {
                this.loading = false
                this.loadData()
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         *  添加
         */
        handleEdit(id = '', readonly = false) {
            this.editId = id
            this.readonly = readonly
            this.dialogFormVisible = true
        },
        // 发布
        handleFabu(id = '', readonly = false) {
            // alert('9999')
            this.editId = id
            console.log('iddddd-', id)
            const info = this.listData.filter(item => {
                return item.id === id
            })
            const [objInfo] = info
            this.menuData = objInfo
            console.log('info0000-=--', info)

            this.title = '发布'
            this.addMenuDialogVisible = true
        },
        handleLinkClick(data) {
            this.handleEdit(data.id, true)
        }
    }
}
</script>

