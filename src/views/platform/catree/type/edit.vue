<template>
  <!--对话框-->
  <el-dialog
    v-if="displayType ==='dialog'"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    class="dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="typeForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="type"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item v-show="!formId" label="父节点名称:">
        <span>{{ parentData.name }}</span>
      </el-form-item>
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="type.name" v-pinyin="{vm:type,key:'bizKey'}" />
      </el-form-item>
      <el-form-item label="分类Key:" prop="bizKey">
        <el-input v-model="type.bizKey" />
      </el-form-item>
      <el-form-item v-show="categoryKey==='DIC_TYPE'" label="分类类型:" prop="struType">
        <el-radio-group v-model="type.struType">
          <el-radio
            v-for="option in srtuOptions"
            :key="option.value"
            :label="option.value"
          >{{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
  <!--默认形式-->
  <div v-else class="main-container">
    <ibps-container type="full" class="page">
      <template slot="header">
        <el-button type="primary" :disabled="readonly" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      </template>
      <el-form ref="typeForm" :model="type" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="分类:">
          <span>{{ isPrivate ? '私有分类' : '普通分类' }}</span>
        </el-form-item>
        <el-form-item v-show="!formId" label="父节点名称:">
          <span>{{ parentData.name }}</span>
        </el-form-item>
        <el-form-item label="分类名称:" prop="name">
          <el-input v-if="!readonly" v-model="type.name" v-pinyin="{vm:type,key:'bizKey'}" />
          <span v-else>{{ type.name }}</span>
        </el-form-item>
        <el-form-item label="分类Key:" prop="bizKey">
          <el-input v-if="!readonly" v-model="type.bizKey" :disabled="$utils.isNotEmpty(formId)" />
          <!-- <span v-else>{{ type.typeKey }}</span> -->
           <span v-else>{{ type.bizKey }}</span> 
        </el-form-item>
        <el-form-item v-show="categoryKey==='DIC_TYPE'" label="字典类型:" prop="struType">
          <el-radio-group v-model="type.struType">
            <el-radio
              v-for="option in srtuOptions"
              :key="option.value"
              :label="option.value"
            >{{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </ibps-container>
  </div>
</template>
<script>
import { save, get } from '@/api/platform/compform/type'
import ActionUtils from '@/utils/action'
import { srtuOptions } from './constants'
import { validateKey } from '@/utils/validate'
import { debug } from 'util';
export default {
  props: {
    id: {
      type: String
    },
    parentData: Object, // 父类数据
    categoryKey: String, // 分类标识key
    isPrivate: Boolean, // 是否是私有的
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    displayType: {
      type: String,
      default: 'dialog'
    }
  },
  data() {
    return {
      formName: 'typeForm',
      formLabelWidth: '120px',
      dialogVisible: false,
      dialogLoading: false,

      srtuOptions: srtuOptions,
      defaultForm: {},
      type: {
        struType: '1',
        name: '',
        typeKey: '',
        bizKey: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        bizKey: [{ required: true, validator: validateKey }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    formId() {
      if (this.displayType !== 'dialog') {
        this.getFormData()
        if (!this.id) this.type = JSON.parse(JSON.stringify(this.defaultForm))
      }
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.type))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      if (this.$utils.isEmpty(this.formId)) {
        if (this.parentData.depth === 0 || this.parentData.depth === '0') {
          this.type.path = this.parentData.id + '.'
          this.isRoot = true
        } else {
          this.type.path = this.parentData.path
        }
        this.type.parentId = this.parentData.id
        // this.type.categoryKey = this.categoryKey
        this.type.bizTypeKey = 'a'
        this.type.bizKey = this.type.typeKey
        this.type.struType = this.parentData.struType || '0'
      }
      console.log('ss'+JSON.stringify(this.type));
      // debugger
       save(JSON.stringify(this.type)).then(response => {
      // save(JSON.stringify(json)).then(response => {
        if (this.displayType === 'dialog') {
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
            this.$emit('callback', true)
          })
        } else {
          ActionUtils.removeSuccessMessage('保存成功')
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          this.$emit('callback', true)
        }
      }).catch((err) => {
        console.info(err)
      })
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.type = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      get({
        id: this.formId
      }).then(response => {
        this.$refs[this.formName].clearValidate()
        this.type = response.data
      }).catch(() => { })
    }
  }
}
</script>
