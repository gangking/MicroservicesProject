<template>
  <div>
    <div v-if="readonly">
      <el-form :label-width="formLabelWidth">
        <el-form-item label="机构名称:" prop="name">
          <span>{{ org.name }}</span>
        </el-form-item>
        <el-form-item label="机构别名:" prop="orgAlias">
          <span>{{ org.orgAlias }}</span>
        </el-form-item>
        <el-form-item label="机构等级:" prop="levelID">
          {{ org.levelID|optionsFilter(levelOptions,'name','id') }}
        </el-form-item>
        <el-form-item label="机构状态" prop="status">
          <el-tag :type="org.status|optionsFilter(statusOption,'type')">
            {{ org.status|optionsFilter(statusOption,'label') }}
          </el-tag>
        </el-form-item>
      </el-form>
    </div>
    <ibps-container v-else type="full" header-background-color class="page">
      <template slot="header">
        <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      </template>
      <el-form ref="orgForm" :model="org" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="org.name" v-pinyin="{vm:org,key:'orgAlias'}" autocomplete="off" />
        </el-form-item>
        <el-form-item label="机构别名" prop="orgAlias">
          <el-input v-model="org.orgAlias" :disabled="formId!==''" autocomplete="off" />
        </el-form-item>
        <el-form-item label="机构等级" prop="levelID">
          <el-select v-model="org.levelID" style="width:100%;">
            <el-option v-for="(v,i) in levelOptions" :key="i" :label="v.name" :value="v.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="机构状态" prop="status">
          <el-select v-model="org.status" style="width:100%;">
            <el-option v-for="(v,i) in statusOption" :key="i" :label="v.label" :value="v.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </ibps-container>
  </div>
</template>
<script>
import { orgStatusOption } from './constants'
import { save, get } from '@/api/platform/org/org'
import { findByType as findLevelByType } from '@/api/platform/org/level'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'

export default {
  props: {
    id: [String, Number],
    parentId: [String, Number],
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formName: 'orgForm',
      formLabelWidth: '120px',
      formId: '',
      clientHeight: '',
      levelOptions: [],
      statusOption: orgStatusOption,
      defaultForm: {},
      org: {
        id: '',
        parentId: this.parentId,
        name: '',
        orgAlias: '',
        levelID: '',
        status: 'actived'
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        orgAlias: [{ required: true, validator: validateKey }],
        levelID: [{ required: true, message: this.$t('validate.required') }],
        status: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  // 监听
  watch: {
    id: {
      handler: function(val, oldVal) {
        this.formId = this.id
        this.getFormData()
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.org))
    this.loadLevelList()
  },
  methods: {
    loadLevelList() {
      findLevelByType({
        type: 'org'
      }).then(response => {
        this.levelOptions = response.data
        if (this.$utils.isNotEmpty(this.levelOptions)) {
          this.defaultForm.levelID = this.levelOptions[0].id
          if (this.$utils.isEmpty(this.formId)) {
            this.org.levelID = this.defaultForm.levelID
          }
        }
      })
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
      console.log(this.org)
      save(this.org).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          this.$emit('success', rtn)
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 获取编辑数据
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 页面渲染完后初始化表单
        this.$nextTick(() => {
          // 重置表单
          this.org = JSON.parse(JSON.stringify(this.defaultForm))
          this.org.parentId = this.parentId
          this.formValidate()
        })
      } else {
        get({ orgId: this.formId }).then(response => {
          this.org = response.data
          if (!this.readonly) {
            this.formValidate()
          }
        }).catch(() => {
        })
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    }
  }
}
</script>
