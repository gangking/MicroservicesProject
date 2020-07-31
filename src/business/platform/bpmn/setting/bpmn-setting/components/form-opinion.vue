<template>
  <el-dialog
    :title="'表单意见设置'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ibps-form-suggestion"
    top="5%"
    width="65%"
    append-to-body
    @close="closeDialog"
    @open="loadData"
  >
    <div class="form-header forms-content">
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple">表单流程意见</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">绑定全局或节点</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">是否隐藏流程意见</div></el-col>
      </el-row>
    </div>
    <div class="forms-content">
      <template>
        <el-row v-for="(formList,index) of suggestionList" :key="index">
          <el-col :span="8" class="form-content"><div>{{ formList.label }}</div></el-col>
          <el-col :span="8" class="form-content"><div class="select">
            <el-select v-model="node[index]" placeholder="请选择">
              <el-option label="全局" value="all" />
              <template v-for="item of nodeMap">
                <el-option v-if="item.node_type==='userTask'" :key="item.id" :label="item.node_name" :value="item.id" />
              </template>
            </el-select>
          </div></el-col>
          <el-col :span="8" class="form-content"><div class="select">
            <el-select v-model="hidden[index]" placeholder="请选择">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </div></el-col>
        </el-row>
      </template>

    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { findFormOptionField } from '@/api/platform/form/formDef'
export default {
  props: {
    nodeMap: Object,
    defId: String,
    visible: {
      type: Boolean,
      default: false
    },
    formKey: String,
    formOpinions: Object

  },
  data() {
    return {
      list: [],
      value: '',
      hidden: [false, false],
      dialogVisible: this.suggestionVisible,
      loading: true,
      suggestionList: [],
      node: ['all', 'all'],
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      pagination: {},
      Sorts: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    saveData() {
      // this.$emit('callback', this)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    // 加载已回复数据
    loadData() {
      this.loading = true
      findFormOptionField({ formKey: this.formKey }).then(response => {
        this.suggestionList = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang='scss'>
.ibps-form-suggestion{
  .el-row {
       &:first-child {
      border-top: 1px solid #DDDDDD;
    }
    .el-col{
       &:last-child {
      border-right: 1px solid #DDDDDD;
    }
    }

     .form-content{
    height: 50px;
   line-height: 50px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #DDDDDD;
    border-top:none;
    border-right: none;
    .select{
      margin: 0 20px;
    }
    }
      .bg-purple {
       height: 40px;
       line-height: 40px;
       font-weight: bold;
    text-align: center;
    background-color: #f5f5f6;
    border-left: 1px solid #dddd;
  }
    .grid-content {
    min-height: 36px;
  }
  .row-bg {
    background-color: #f9fafc;
  }
  }
  .el-table__body-wrapper{
    min-height: 200px;

    .el-table__empty-block{
   min-height:200px;
    }

  }

}

</style>

