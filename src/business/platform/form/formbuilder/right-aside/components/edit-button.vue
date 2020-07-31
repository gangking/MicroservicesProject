<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="设置按钮"
    class="form-button-dialog"
    top="5vh"
    width="60%"
    append-to-body
    @close="closeDialog"
  >
    <el-form :model="formData" label-width="150px" size="mini">
      <el-form-item label="按钮名称">
        <el-input v-model="formData.label" placeholder="按钮名称" />
      </el-form-item>
      <el-form-item v-if="formData.type === 'custom'" label="按钮编码">
        <el-input v-model="formData.code" placeholder="按钮编码" />
      </el-form-item>
      <el-form-item v-if="type==='function'" label="按钮位置">
        <el-radio-group v-model="formData.position">
          <el-radio-button
            v-for="item in positionType"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="按钮颜色">
        <el-select v-model="formData.style" placeholder="按钮颜色">
          <el-option value="default" label="默认" />
          <el-option value="primary" label="主要" />
          <el-option value="success" label="成功" />
          <el-option value="info" label="信息" />
          <el-option value="warning" label="警告" />
          <el-option value="danger" label="危险" />
        </el-select>
      </el-form-item>
      <el-form-item label="按钮图标">
        <ibps-icon-select v-model="formData.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item label="启用自定义对话框">
        <el-switch
          v-model="formData.enabledCustom"
          :active-value="'Y'"
          :inactive-value="'N'"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
      <el-form-item v-if="formData.enabledCustom==='Y'" label="自定义对话框配置">
        <ibps-data-template-selector v-model="formData.dialog" placeholder="请选择自定义对话框" type="dialog" />
        <div class="ibps-pt-5">
          <el-button style="width:100%;" type="primary">配置自定义对话框</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import IbpsDataTemplateSelector from '@/business/platform/data/dataTemplate/selector'

import { hasPermission } from '../../../constants/buttonTypes'

export default {
  components: {
    IbpsDataTemplateSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'function'
    }
  },
  data() {
    return {
      dialogVisible: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: {}
    }
  },
  computed: {
    positionType() {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })
      const type = this.formData.type || ''
      if (hasPermission(type, 'toolbar')) {
        positionType.push({
          value: 'toolbar',
          label: '仅顶部'
        })
      }

      if (hasPermission(type, 'manage')) {
        positionType.push({
          value: 'manage',
          label: '仅管理'
        })
      }
      return positionType
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.formData = val
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
      const data = JSON.parse(JSON.stringify(this.formData))
      this.$emit('close', false)
      this.$emit('callback', data)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }

}
</script>

