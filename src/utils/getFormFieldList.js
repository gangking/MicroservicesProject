import _ from 'lodash'
import FormOptions from '@/business/platform/form/constants/formoptions.js'
import FormUtil from '@/business/platform/form/utils/formUtil.js'
import util from '@/utils/util'
const getProp = _.curry((key, obj) => obj && obj[key])

const pipe = functions => data => {
    return functions.reduce(
        (value, func) => func(value),
        data
    )
}
/**
 * 读取对象上的name
 */
const getFormFieldByName = getProp('name')

const getFormFieldByDefaultValue = getProp('default_value')

const getFormFieldOptions = getProp('field_options')

const getFormFieldType = getProp('field_type')

const getFieldDefaultValueType = getProp('default_value_type')

const getFormColumns = getProp('columns')

const isGridField = (obj) => getFormFieldType(obj) === 'grid'

const isTableField = (obj) => getFormFieldType(obj) === 'table'

const isApprovalOpinion = (obj) => getFormFieldType(obj) === 'approval_opinion'

const getFields = getProp('fields')

const getFormFieldDefaultValue = pipe([getFormFieldOptions, getFormFieldByDefaultValue])

const getFormFieldDefaultValueType = pipe([getFormFieldOptions, getFieldDefaultValueType])

const isFixedDefaultValue = (obj) => getFormFieldDefaultValueType(obj) === 'fixed'

const getGridClumnsFields = pipe([getFormFieldOptions, getFormColumns])
const getFieldByGrid = (obj) => {
    /* const columns = getGridClumnsFields(obj) || []
    console.log('columnsTY:', columns) */

    return (getGridClumnsFields(obj) || []).reduce((totalFields, item) => totalFields.concat(getFields(item) || []), [])
}

const getFormFieldList = function (fields) {
    return fields.reduce((total, item) => {
        if (isGridField(item)) {
            return total.concat(getFormFieldList(getFieldByGrid(item)))
        } else if (isTableField(item)) {
            console.log('...isTableField.')
        } else if (isApprovalOpinion(item)) {
            console.log('...isApprovalOpinion.')
        } else {
            total.push(item)
            return total
        }
    }, [])
}

export default function getFormFieldListValue(obj) {
    // console.log('getFields(obj)',)
    console.log('getFormFieldList(obj)', getFormFieldList(getFields(obj)))

    return getFormFieldList(getFields(obj)).reduce((params, item) => {
        const fieldName = getFormFieldByName(item)
        const value = getFormFieldDefaultValue(item)
        if (!util.isEmpty(value) && isFixedDefaultValue(item) && !util.isArray(value)) {
            params[fieldName] = value
        }

        /* if (FormOptions.t.NON_MODEL_FIELD_TYPES.includes(getFormFieldType(item))) {
            params[getFormFieldByName(item)] = FormUtil.getFieldDefaultValue(item, (name, val) => {

            })
        } else if (isFixedDefaultValue(item)) {
            params[getFormFieldByName(item)] = getFormFieldDefaultValue(item)
        } */
        return params
    }, {})
}

