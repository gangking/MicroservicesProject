<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-script-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @close="closeDialog"
  >
    <div v-if="dialogVisible">
      <el-form label-width="120px">
        <el-form-item label="数据关联来源:">
          <ibps-data-template-selector2
            v-model="linkageData.dataSource"
            @change="changeDataSource"
          />
        </el-form-item>
        <el-form-item label="动态参数:">
          <el-button style="width:100%;" type="primary" plain size="mini">设置动态参数</el-button>
        </el-form-item>
        <p />
        <p />
        <div>
          <el-select v-model="linkageData.boField" placeholder="请选择对象字段">
            <el-option
              v-for="item in boFieldOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
          <span>值&nbsp;&nbsp;等&nbsp;&nbsp;于</span>
          <el-select v-model="linkageData.relyData" no-data-text="请先选择数据关联来源" placeholder="请选择关联数据">
            <el-option
              v-for="item in relyDataOptins"
              :key="item.key"
              :label="item.label"
              :value="item.name"
            />
          </el-select>
          的值时
        </div>
        <p />
        <p />
        <div>
          <el-input :value="label" style="width:215px;" disabled />
          联动显示
          <el-select v-model="linkageData.dataField" no-data-text="请先选择数据关联来源" placeholder="请选择关联数据">
            <el-option
              v-for="item in relyDataOptins"
              :key="item.key"
              :label="item.label"
              :value="item.name"
            />
          </el-select>
          中的对应值
        </div>
      </el-form>
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
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
export default {
  components: {
    IbpsDataTemplateSelector2
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    data: {
      type: [String, Object, Array]
    },
    boData: {
      type: Array
    },
    title: {
      type: String,
      default: '联动数据'
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,

      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],

      dataSourceOptions: [],
      relyDataOptins: [],
      linkageData: {
        dataSource: '',
        field: '',
        relyData: '',
        dataField: ''
      }

    }
  },
  computed: {
    boFieldOptions() {
      return this.boData
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
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      //
      this.$emit('callback', this.linkageData)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    changeDataSource(data) {
      let options = []
      if (this.$utils.isNotEmpty(data)) {
        options = JSON.parse(data.resultColumns)
      }
      this.relyDataOptins = options
    }
  }
}
</script>

