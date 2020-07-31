import * as operator from './operator'
import * as format from './format'
import _ from 'lodash'
export function renderOutlineTable(style, row, fieldName) {
    let stylePositions = { 'top': [], 'left': [], 'right': [], 'bottom': [] }
    const stylePositionsGap = { 'top': '<br>', 'left': '', 'right': '', 'bottom': '<br>' }
    const checkStyleList = { 'icon': renderIcon, 'unitField': renderUnitField }
    let fieldValue = renderOutlineTableValue(style.value || {}, row, fieldName)
    _.forOwn(checkStyleList, function(functionName, key) {
        if (style[key]) {
            stylePositions = functionName(style[key], row, fieldName, stylePositions)
        }
    })
    _.forOwn(stylePositions, function(value, key) {
        if (value.length > 0) {
            fieldValue = value.join('') + stylePositionsGap[key] + fieldValue
        }
    })

    return fieldValue
}

const renderIcon = function({ iconName = null, position = 'left', style = {}, dynamic = null },
    row, fieldName, stylePositions) {
    if (iconName) {
        stylePositions[position].push(`<i class="icon-${iconName}" style="${parseStyle(style)}"></i>`)
    } else if (dynamic) {
        const iconItemStyle = meetAConditionItem(dynamic, row, 'field')
        if (iconItemStyle) {
            renderIcon(iconItemStyle, row, fieldName, stylePositions)
        }
    }
    return stylePositions
}

const renderUnitField = function(UnitStyle, row, fieldName, stylePositions) {
    const { position = 'left', field } = UnitStyle
    // 这个字段的值要存在才处理
    if (field && row[field]) {
        stylePositions[position].push(renderOutlineTableValue(UnitStyle, row, field))
    }
    return stylePositions
}

const renderOutlineTableValue = function(valueStyle, row, fieldName) {
    const { format = null, style = null, dynamic = null } = valueStyle
    const fieldValue = row[fieldName]
    if (style) {
        return `<span style="${parseStyle(style)}">${parseFilter(format, fieldValue)}</span>`
    } else if (dynamic) {
        const itemStyle = meetAConditionItem(dynamic, row, 'field')
        // 查看formart 是否为空 否则直接等于默认的format
        itemStyle['format'] = itemStyle['format'] || format
        return itemStyle ? renderOutlineTableValue(itemStyle, row, fieldName) : fieldValue
    }
    return fieldValue
}

const meetAConditionItem = function(list, row, field) {
    return list.find((item) => {
        const [fieldName, operation, value] = item[field]
        return operator[operation](row[fieldName], value)
    })
}

const parseStyle = function(styles) {
    return _.transform(styles, function(result, value, key) {
        result.push(`${key}:${value};`)
        return true
    }, []).join('')
}

const parseFilter = function(filtersFunctionString, value) {
    if (filtersFunctionString) {
        const filtersFunctionList = filtersFunctionString.replace(/\$\#/ig, value).split('|').map((item) => {
            const [functionName, args] = item.replace(/\s/g, '').split('(')

            return [functionName, args.substr(0, args.length - 1).split(',')]
        })
        console.log('filtersFunctionList', filtersFunctionList)
        return filtersFunctionList.reduce((result, [functionName, args]) => {
            if (format[functionName]) {
                result = format[functionName].apply(null, args)
            }
            return result
        }, '')
    }
    return value
}
