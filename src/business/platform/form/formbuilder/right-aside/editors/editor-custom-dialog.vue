<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">对话框类型</template>
        <el-select v-model="fieldOptions.dialog_type" style="width:100%;">
          <el-option value="dialog" label="自定义对话框" />
          <el-option value="url" label="URL对话框" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="fieldOptions.dialog_type==='dialog'">
        <template slot="label">自定义对话框</template>
        <ibps-data-template-selector2
          v-model="fieldOptions.dialog"
          type="dialog"
          placeholder="请选择自定义对话框"
        />
        <div v-if="fieldOptions.dialog" class="ibps-pt-5">
          <el-button style="width:100%;" type="primary">设置自定义对话框</el-button>
        </div>
      </el-form-item>
      <el-form-item v-else-if="fieldOptions.dialog_type==='url'">
        <template slot="label">URL设置</template>
        <el-button style="width:100%;" type="primary">设置</el-button>
      </el-form-item>
      <el-form-item>
        <template slot="label">是否多选</template>
        <el-switch
          v-model="fieldOptions.multiple"
          active-value="Y"
          inactive-value="N"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">图标</template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item>
        <template slot="label">存储格式</template>
        <el-select v-model="fieldOptions.store" style="width:100%;">
          <el-option value="id" label="仅存ID" />
          <el-option value="json" label="JSON格式" />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import EditorMixin from '../mixins/editor'

export default {
  components: {
    IbpsDataTemplateSelector2
  },
  mixins: [EditorMixin]

}
</script>

