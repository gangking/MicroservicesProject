<template>
  <div class="panel panel-default toolbars-panel">
    <div class="panel-heading">布局设置</div>
    <div class="panel-body">
      <el-form-item v-if="types.includes('rows')">
        <template slot="label">行数<help-tip prop="rows" /></template>
        <el-input v-model="fieldOptions.rows" />
      </el-form-item>
      <el-form-item v-if="types.includes('autosize')" label-width="120px">
        <template slot="label">自适应高度<help-tip prop="autosize" /></template>
        <el-switch v-model="fieldOptions.autosize" />
        <div v-if="fieldOptions.autosize">
          <el-input-number
            v-model="fieldOptions.min_rows"
            :min="1"
            placeholder="最小行数"
            controls-position="right"
            style="width:90px;"
          />
          -
          <el-input-number
            v-model="fieldOptions.max_rows"
            :min="fieldOptions.min_rows||1"
            placeholder="最大行数"
            controls-position="right"
            style="width:90px;"
          />
        </div>
      </el-form-item>
      <el-form-item v-if="types.includes('mode')">
        <template slot="label">编辑模式<help-tip prop="tableMode" /></template>
        <el-select v-model="fieldOptions.mode">
          <el-option
            v-for="(mode,index) in tabeModeOptions"
            :key="index"
            :value="mode.value"
            :label="mode.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="types.includes('index')">
        <template slot="label">显示序号<help-tip prop="index" /></template>
        <el-switch v-model="fieldOptions.index" />
      </el-form-item>

      <el-form-item v-if="types.includes('height')">
        <template slot="label">高度<help-tip prop="height" /></template>
        <el-input v-model="fieldOptions.height">
          <template slot="append">像素(px)</template>
        </el-input>
      </el-form-item>

      <el-form-item v-if="types.includes('gridsToOccupy')" label-width="120px">
        <template slot="label">字段占比%<help-tip prop="gridsToOccupy" /></template>
        <el-radio-group v-model="fieldOptions.grids_to_occupy">
          <el-radio-button label="1">25</el-radio-button>
          <el-radio-button label="2">50</el-radio-button>
          <el-radio-button label="3">75</el-radio-button>
          <el-radio-button label="4">100</el-radio-button>
        </el-radio-group>
      </el-form-item>

    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
      tabeModeOptions: [{
        value: 'inner',
        label: '表内编辑模式'
      }, {
        value: 'block',
        label: '块模式'
      }, {
        value: 'dialog',
        label: '弹窗模式'
      }]
    }
  }
}
</script>

