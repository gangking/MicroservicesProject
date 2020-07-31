<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">关联数据</template>
        <ibps-data-template-selector2
          v-model="fieldOptions.linkdata"
          placeholder="请选择关联数据"
          type="valueSource"
          @change="changeLinkdata"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">是否多选</template>
        <el-switch
          v-model="fieldOptions.multiple"
          active-value="Y"
          inactive-value="N"
        />
      </el-form-item>
      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__label">关联配置</div>
        <div class="el-form-item__content">
          <el-button style="width:100%;" type="primary" size="mini" @click="settingLinkConfig">设置关联配置</el-button>
        </div>
      </div>
      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__label">关联字段动态参数</div>
        <div class="el-form-item__content">
          <el-button style="width:100%;" type="primary" size="mini" @click="settingLinkCondition">设置关联字段动态参数</el-button>
        </div>
      </div>

      <div v-if="fieldOptions.multiple === 'N'" class="el-form-item el-form-item--mini">
        <div class="el-form-item__label">设置联动数据</div>
        <div class="el-form-item__content">
          <el-button style="width:100%;" type="primary" size="mini" @click="settingLinkLinkage">设置联动数据</el-button>
        </div>
      </div>
      <div v-if="fieldOptions.multiple === 'N'" class="el-form-item el-form-item--mini">
        <div class="el-form-item__label">设关联属性</div>
        <div class="el-form-item__content">
          <el-button style="width:100%;" type="primary" size="mini" @click="settingLinkAttr">关联属性</el-button>
        </div>
      </div>
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
  mixins: [EditorMixin],
  data() {
    return {
      resultColumns: []
    }
  },
  methods: {
    changeLinkdata(data) {
      var resultColumns = []
      if (this.$utils.isNotEmpty(data)) {
        resultColumns = data.resultColumns ? JSON.parse(data.resultColumns) : []
      }
      this.resultColumns = resultColumns
    },
    settingLinkConfig() {
      if (this.$utils.isEmpty(this.fieldOptions.linkdata)) {
        this.$message.closeAll()
        this.$message({
          message: '请选择关联数据',
          type: 'warning'
        })
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        this.$message.closeAll()
        this.$message({
          message: '未获取关联设置',
          type: 'warning'
        })
        return
      }
    },
    settingLinkCondition() {

    },
    settingLinkLinkage() {

    },
    settingLinkAttr() {

    }
  }
}
</script>

