export default {
  props: {
    fieldItem: {
      type: Object,
      required: true
    },
    types: {
      type: String
    }
  },
  computed: {
    fieldOptions() {
      return this.fieldItem.field_options || {}
    },
    fieldType() {
      return this.fieldItem.field_type
    }
  }
}
