<template>
  <el-form ref="form" class="basic-info-form" :model="form" :rules="rules" label-width="140px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" v-pinyin="{vm:form,key:'code'}" :disabled="readonly" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="编码：" prop="code">
          <el-input v-model="form.code" :disabled="readonly||id!==''" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="数据格式：" prop="dataFormat">
          <el-select v-model="form.dataFormat" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in dataFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="form.dsName" :span="24">
        <el-form-item v-if="form.boType==='out'" label="数据源：" prop="dsName">
          <el-input v-model="form.dsName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="当前对象主键：" prop="pk">
          <el-select v-model="form.pk" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in changeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isMaster" :span="12">
        <el-form-item label="当前对象外键" class="forms" prop="fk">
          <span class="forms-span">
            <el-tooltip
              class="item"
              effect="light"
              placement="bottom"
            >
              <div slot="content">设置外键为当前主键时，则表示关系类<br>型为一对一 </div>
              <ibps-icon name="exclamation-circle" class="forms-icon" />
            </el-tooltip>：
          </span>
          <el-select v-model="form.fk" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in changeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isMaster" :span="12">
        <el-form-item label="来自主对象属性：" prop="fromAttr">
          <el-select v-model="form.fromAttr" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in pkOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isMaster" :span="24">
        <el-form-item label="关系类型：" prop="relation">
          <el-select v-model="form.relation" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in relationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述：" prop="desc">
          <el-input v-model="form.desc" :autosize="{ minRows: 5, maxRows: 10}" :disabled="readonly" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { dataFormatOptions, relationOptions } from '../../constants'
import { validateKey } from '@/utils/validate'

export default {
  props: {
    isMaster: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    formData: Object,
    parentData: Object,
    id: String,
    code: String,
    action: String
  },
  data() {
    return {
      formName: 'form',
      dataFormatOptions: dataFormatOptions,
      relationOptions: relationOptions,
      form: this.formData,
      changeOptions: [],
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        code: [{ required: true, validator: validateKey }],
        dataFormat: [{ required: true, message: this.$t('validate.required') }],
        pk: [{ required: true, message: this.$t('validate.required') }],
        fk: [{ required: true, message: this.$t('validate.required') }],
        fromAttr: [{ required: true, message: this.$t('validate.required') }],
        relation: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    pkOptions() {
      return this.parentData.attrs
    }
  },
  watch: {
    form: { // 返回数据给父组件
      handler: function(val, oldVal) {
        this.$emit('change', val)
      },
      deep: true
    },
    formData: {
      handler: function(val, oldVal) {
        this.form = this.formData
      },
      deep: true
    },
    changeOptions: { // 初始化下拉数据
      handler: function(val, oldVal) {
        if (val === undefined) return
        this.form.pk = this.form.pk === null || this.form.pk === '' ? val[0].code : this.form.pk

        if (this.parentData.attrs !== undefined) {
          this.form.fromAttr = this.form.fromAttr === null || this.form.fromAttr === '' ? this.parentData.attrs[0].code : this.form.fromAttr
        }
        const fkIndex = val.findIndex(item => item.code === 'parentId')
        this.form.fk = this.form.fk === null || this.form.fk === '' ? fkIndex > -1 ? val[fkIndex].code : val[0].code : this.form.fk
      },
      deep: true
    }
  },
  mounted() {
    this.formValidate()
  },
  created() {
    this.changeOptions = this.formData.attrs
  },
  methods: {
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    pkChange(value) {
      this.changeOptions = value
    }
  }
}
</script>
<style lang="scss">
.basic-info-form{
    .forms{
      position: relative;
      label{
        width: 110px!important;
      }
      .forms-span{
        position:absolute;
        left: -41px;
        top: 0;
        .forms-icon{
          color: #337ab7;
        }
      }
    }
}
</style>
