import EditorBase from '../editors/editor-base'
import EditorRules from '../editors/editor-rules'
import EditorRights from '../editors/editor-rights'
import EditorLayout from '../editors/editor-layout'

import EditorOptions from '../editors/editor-options'
import EditorEditor from '../editors/editor-editor'
import EditorTable from '../editors/editor-table'
import EditorSelector from '../editors/editor-selector'
import EditorDictionary from '../editors/editor-dictionary'
import EditorAutonumber from '../editors/editor-autonumber'
import EditorAttachment from '../editors/editor-attachment'
import EditorCustomDialog from '../editors/editor-custom-dialog'
import EditorLinkdata from '../editors/editor-linkdata'
import EditorAddress from '../editors/editor-address'
import EditorImage from '../editors/editor-image'
import EditorHyperlink from '../editors/editor-hyperlink'

import EditorOpinion from '../editors/editor-opinion'

import EditorRemoteSearch from '../editors/editor-remote-search' // 远程搜索配置
import EditorFsscCustom from '../editors/editor-fssc-custom' // 自定义对话框配置

export default {
  components: {
    EditorBase,
    EditorOptions,
    EditorEditor,
    EditorTable,
    EditorDictionary,
    EditorAutonumber,
    EditorSelector,
    EditorAttachment,
    EditorCustomDialog,
    EditorLinkdata,
    EditorAddress,
    EditorOpinion,
    EditorRules,
    EditorRights,
    EditorLayout,
    EditorHyperlink,
    EditorImage,
    EditorRemoteSearch,
    EditorFsscCustom
  },
  props: {
    boData: {
      type: Array
    },
    fieldItem: {
      type: Object,
      required: true
    }
  },
  watch: {
    fieldItem: {
      handler(val) {
        console.log(val)
      }
    },
    immediate: true
  },
  computed: {
    fieldOptions() {
      return this.fieldItem.field_options || {}
    },
    fieldType() {
      return this.fieldItem.field_type
    }
  },
  methods: {
    handleSelect(field) {
      this.$emit('select', field)
    }

  }
}
