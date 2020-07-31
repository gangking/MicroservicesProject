<template>
  <div :style="{height:height+'px'}" class="el-body">
            <div style="padding:10px;padding-top:50px; ">
              <!-- <p>表头名称</p> -->
              <el-form :label-width="formLabelWidth">
                <el-form-item label="影像" >
                  <el-switch v-model="form.delivery"></el-switch>
                </el-form-item>
                <el-form-item label="附件上传">
                  <el-switch v-model="form.delivery1"></el-switch>
                </el-form-item>
                <el-form-item label="凭证生成">
                  <el-switch v-model="form.delivery2"></el-switch>
                </el-form-item>
                <el-form-item label="打印预览">
                  <el-switch v-model="form.delivery3"></el-switch>
                </el-form-item>
                <el-form-item label="前序表单">
                  <el-switch v-model="form.delivery4"></el-switch>
                </el-form-item>
              </el-form>
            </div>
  </div>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import edit from '@/views/platform/org/employee/edit'
import ActionUtils from '@/utils/action'
import { queryOrgUser as queryPageList, removeOrgUser, addOrgUser } from '@/api/platform/org/employee'
import { employeeStatusOption, genderOption } from '../constants'
export default {
  components: {
    edit,
    IbpsEmployeeSelectorDialog
  },
  props: {
    id: [String, Number],
    height: Number,
    isTreeAll: {
      type: Boolean,
      default: true
    },
    rightsArr: {
      type: Array,
      default: () => []
    },
    visible: Boolean
  },
  data() {
    return {
      selectorVisible: false,
      editVisible: false,
      formLabelWidth: '120px',
      pkKey: 'id',

      editId: '',
      title: '',
      span: '',
      readonly: false,
      ceroParams: {
        unshow: ['org-info', 'role-info'],
        groundId: '',
        prem: 'add,delete,edit'
      },
      loading: true,
      listData: [],
      pagination: {},
      sorts: {},
        form: {
          delivery: false,
          delivery1: true,
          delivery2: false,
          delivery3: true,
          delivery4: false,
        },
        options: [
        {
          value: "选项1",
          label: "基本表"
        },
        {
          value: "选项2",
          label: "业务表"
        },
        {
          value: "选项3",
          label: "对象表"
        }
      ],
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'join',
            label: '加入',
            icon: 'el-icon-plus',
            hidden: () => {
              return !this.rightsArr.includes('join')
            }
          },
          {
            key: 'add',
            label: '添加',
            icon: 'el-icon-plus',
            hidden: () => {
              return !this.rightsArr.includes('add')
            }
          },
          {
            key: 'edit',
            label: '编辑',
            icon: 'el-icon-edit',
            hidden: () => {
              return !this.rightsArr.includes('edit')
            }
          },
          {
            key: 'remove',
            label: this.rightsArr.includes('delete') ? '移除' : '删除',
            icon: 'el-icon-delete',
            hidden: () => {
              if (this.rightsArr.includes('remove')) return false
              if (this.rightsArr.includes('delete')) return false
              return true
            }
          }
        ],
        searchForm: {
          inline: true,
          forms: [
            { prop: 'Q^NAME_^SL', label: '姓名：' },
            { prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'], label: '创建时间：', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          // { prop: 'status', label: '状态', tags: employeeStatusOption },
          // { prop: 'gender', label: '性别', tags: genderOption },
          { prop: 'createTime', label: '创建时间' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove',
              hidden: () => {
                return !this.rightsArr.includes('remove')
              }
            },
            {
              key: 'edit',
              hidden: () => {
                return !this.rightsArr.includes('edit')
              }
            },
            {
              key: 'detail',
              hidden: () => {
                return !this.rightsArr.includes('detail')
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    tableHeight() {
      return this.height - 145
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loadData()
      }
    },
    id() {
      this.ceroParams.groundId = this.id
    }
  },
  methods: {
    // 初始化数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^GROUP_ID_^S'] = this.id
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
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
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    search() {
      ActionUtils.setPagination(this.pagination)
      ActionUtils.setSorts(this.sorts)
      this.loadData()
    },
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        // 组织负责人
        case 'search':// 查询
          this.search()
          break
        case 'join':// 加入
          this.handleJoin()
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.title = '编辑员工'
            this.span = 13
            this.handleAdd(id)
          }).catch(() => {})
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleAdd(id, true)
            this.span = 24
            this.title = '员工明细'
          }).catch(() => {})
          break
        case 'add':// 添加
          this.span = 13
          this.title = '员工添加'
          this.handleAdd()
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
    // 添加人员
    handleAdd(editId, readonly = false) {
      this.editId = editId || ''
      this.editVisible = true
      this.readonly = readonly
    },
    // 加入人员
    handleJoin() {
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      addOrgUser({
        orgId: this.id,
        userIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        this.$message.closeAll()
        this.$message({
          message: '加入人员成功!',
          type: 'success'
        })

        this.search()
      })
    },
    handleRemove(ids) {
      removeOrgUser({
        orgId: this.id,
        userIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-body{
  background: #fff;
}
.fylx {
  float: left;
  width: 22%;
  margin-right: 3%;
}
</style>