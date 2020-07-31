<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-grid
        :field-item="fieldItem"
      />
    </el-form>
  </div>
</template>

<script>
import EditorGrid from '../editors/editor-grid'
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-grid',
  components: {
    EditorGrid
  },
  mixins: [typeMixin]
}
</script>
