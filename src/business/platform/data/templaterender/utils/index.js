
import Utils from '@/utils/util'

export function buildFelds(fields, datasets) {
  const fieldMap = {}
  fields.forEach(field => {
    if (field.field_type === 'grid') {
      field.field_options.columns.forEach(column => {
        column.fields.forEach(cfield => {
          fieldMap[cfield.field_name] = cfield
        })
      })
    } else {
      fieldMap[field.field_name] = field
    }
  })
  const rtn = []
  datasets.forEach(dataset => {
    const field = fieldMap[dataset.name]
    if (Utils.isNotEmpty(field)) {
      dataset.field_type = field.field_type
      dataset.field_options = field.field_options
    }
    rtn.push(dataset)
  })
  return rtn
}
