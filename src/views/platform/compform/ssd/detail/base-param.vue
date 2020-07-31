<template>
  <div :style="{height:height+'px'}" class="el-body">
    <div style="padding:10px;">
      <p>表头名称</p>
      <el-form :label-width="formLabelWidth">
        <el-form-item label="业务类型选择:" prop="name">
          <el-select v-model="value" placeholder="请选择" class="bai">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item><!-- select end -->
        <el-form-item label="业务类型选择:" prop="name1">
          <el-tree
            :props="props"
            :load="loadNode"
            lazy
            show-checkbox
            @check-change="handleCheckChange">
          </el-tree>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" >保存</el-button>.
          <el-button type="" >取消</el-button>
        </el-form-item> -->
      </el-form>
    </div>
   <el-row type="flex" class="row-bg" justify="space-around" style="margin-top:20px;">
      <div>
        <el-button type="primary" >下一步</el-button>
        <el-button type="" >取消</el-button>
      </div>
  </el-row>
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
      input2: '',
       value: '',
      readonly: false,
      ceroParams: {
        unshow: ['org-info', 'role-info'],
        groundId: '',
        prem: 'add,delete,edit'
      },
      props: {
          label: 'name',
          children: 'zones'
        },
      count: 1,  // j节点
      loading: true,
      listData: [],
      pagination: {},
      sorts: {},
      
      options: [    // 测试数据 
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
    // 节点树 展开缩小
    handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
    // 节点树
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);
        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
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