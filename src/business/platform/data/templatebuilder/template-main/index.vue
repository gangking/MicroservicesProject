<template>
  <div class="template-main">
    <el-header :height="'40px'" class="layout-header">
      <div class="layout-header-title">
        模版设计
      </div>
      <div class="layout-tools">
        <el-button type="info" size="mini" icon="el-icon-view" @click="previewTemplate()">预览</el-button>
        <el-button type="primary" size="mini" icon="ibps-icon-save" @click="saveTemplate()">保存</el-button>
        <el-button v-if="$utils.isNotEmpty(dataTemplate.id)" type="primary" size="mini" icon="ibps-icon-telegram" @click="addMenu()">添加为菜单</el-button>
        <!-- <el-button type="primary" size="mini" icon="ibps-icon-question-circle-o" @click.prevent.stop="guide()">介绍</el-button> -->
        <el-button size="mini" icon="ibps-icon-close" @click="closeDialog()">关闭</el-button>
      </div>
    </el-header>
    <!--标题-->
    <div :class="{selected:selected}" class="template-header">
      <div class="title">{{ dataTemplate.name||'未设置模版标题' }}</div>
    </div>
    <component
      :is="temlateType"
      v-if="template"
      :template="template"
    />
    <data-template-render-preview
      :visible="templateRendererDialogVisible"
      :data="dataTemplate"
      @close="visible => templateRendererDialogVisible = visible"
    />
    <!-- :data="dataTemplate" -->
    <add-menu
      :edit-id="dataTemplate.id"
      :visible="addMenuDialogVisible"
      @close="visible => addMenuDialogVisible = visible"
    />

  </div>
</template>
<script>
import DataTemlate from './templates'
import DataTemplateRenderPreview from '@/business/platform/data/templaterender/preview/index.vue'
import AddMenu from '@/business/platform/auth/resources/add-menu'
export default {
  components: Object.assign({
    DataTemplateRenderPreview,
    AddMenu
  }, DataTemlate),
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      templateRendererDialogVisible: false,
      addMenuDialogVisible: false,
      selected: false
    }
  },
  computed: {
    dataTemplate() {
      return this.data ? this.data : {}
    },
    temlateType() {
      if (!this.dataTemplate) {
        return
      }
      let key = ''
      if (this.dataTemplate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemplate.showType === 'compose') {
          key = this.dataTemplate.composeType
        } else {
          key = this.dataTemplate.showType
        }
      }
      if (this.$utils.isEmpty(key)) { return }
      return 'ibps-data-template-fake-' + key
    },
    template() {
      if (!this.dataTemplate) {
        return
      }

      const templates = this.dataTemplate.templates || []
      if (this.dataTemplate.showType === 'compose') {
        return templates
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    }

  },
  methods: {
    previewTemplate() {
      console.log('值来源模版预览')
      this.templateRendererDialogVisible = true
    },
    closeDialog() {
      this.$emit('close')
    },
    saveTemplate() {
      this.$emit('save')
    },
    // 添加为菜单
    addMenu() {
      this.addMenuDialogVisible = true
    }
  }
}
</script>

